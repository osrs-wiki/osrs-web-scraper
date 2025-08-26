import fs from "fs";
import client from "https";
import path from "path";

import { formatText } from "./text";

/**
 * Get the correct file extension based on MIME type
 * @param mimeType The MIME type
 * @returns The correct file extension
 */
export const getCorrectExtensionFromMimeType = (mimeType: string): string => {
  const mimeToExtensionMap: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg", 
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
    "image/svg+xml": "svg",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv"
  };
  
  return mimeToExtensionMap[mimeType] || mimeType.split('/')[1] || "bin";
};

/**
 * Download a file from a url
 * @param url The url of the file to download
 * @param filepath The filepath of the downloaded file
 * @returns Promise resolving to the actual filepath (may differ from input if extension was corrected)
 */
export const downloadFile = async (url: string, filepath: string): Promise<string> => {
  console.info(`Attempting file download: ${url}`);
  
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        const writeStream = fs.createWriteStream(filepath);
        res
          .pipe(writeStream)
          .on("error", reject)
          .once("close", async () => {
            try {
              // Check the actual MIME type of the downloaded file using dynamic import
              const { fileTypeFromFile } = await import("file-type");
              const fileType = await fileTypeFromFile(filepath);
              
              if (fileType) {
                const actualExtension = getCorrectExtensionFromMimeType(fileType.mime);
                const currentExtension = getFileExtension(filepath);
                
                // If the extensions don't match, rename the file
                if (actualExtension !== currentExtension) {
                  const dir = path.dirname(filepath);
                  const basename = path.basename(filepath, `.${currentExtension}`);
                  const correctedFilepath = path.join(dir, `${basename}.${actualExtension}`);
                  
                  // Rename the file to have the correct extension
                  fs.renameSync(filepath, correctedFilepath);
                  
                  console.info(`Downloaded file ${filepath} and corrected extension to ${correctedFilepath}`);
                  resolve(correctedFilepath);
                } else {
                  console.info(`Downloaded file ${filepath}`);
                  resolve(filepath);
                }
              } else {
                // If we can't detect the file type, use the original filepath
                console.info(`Downloaded file ${filepath} (could not detect file type)`);
                resolve(filepath);
              }
            } catch (error) {
              // If file type detection fails, just use the original filepath
              console.warn(`File type detection failed for ${filepath}:`, error);
              console.info(`Downloaded file ${filepath}`);
              resolve(filepath);
            }
          });
      } else {
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`)
        );
      }
    });
  });
};

/**
 * Get a file from a url
 * @param fileUrl The file url
 * @returns
 */
export const getFileName = (fileUrl: string) => {
  const parsed = new URL(fileUrl);
  return path.basename(parsed.pathname);
};

/**
 * Get the extension of a file from a url link.
 * @param fileUrl The file url
 * @returns
 */
export const getFileExtension = (fileUrl: string) => {
  return fileUrl.split(/[#?]/)[0].split(".").pop().trim();
};

const fileCharsReplaceMap: { [key: string]: string } = {
  ":": "-",
  "|": "-",
  "&nbsp;": "",
  "?": "",
};

/**
 * Find a file by its base name, ignoring extension. Useful when extension might have been corrected.
 * @param directory The directory to search in
 * @param baseName The base name without extension
 * @returns The actual filename if found, undefined otherwise
 */
export const findFileByBaseName = (directory: string, baseName: string): string | undefined => {
  if (!fs.existsSync(directory)) {
    return undefined;
  }
  
  const files = fs.readdirSync(directory);
  
  // Look for files that start with the base name followed by a dot
  const matchingFile = files.find(file => {
    const withoutExt = file.substring(0, file.lastIndexOf('.'));
    return withoutExt === baseName;
  });
  
  return matchingFile;
};

/**
 * Format a file name to ensure it is valid.
 * @param fileName The file name
 * @returns
 */
export const formatFileName = (fileName: string) => {
  const cleanedFileName = Object.keys(fileCharsReplaceMap).reduce(
    (name, find) => name.replaceAll(find, fileCharsReplaceMap[find]),
    fileName
  );
  return formatText(cleanedFileName).trim();
};

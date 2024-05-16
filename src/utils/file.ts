import fs from "fs";
import client from "https";
import path from "path";

import { formatText } from "./text";

/**
 * Download a file from a url
 * @param url The url of the file to download
 * @param filepath The filepath of the downloaded file
 * @returns
 */
export const downloadFile = async (url: string, filepath: string) => {
  console.info(`Attempting file download: ${url}`);
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
        console.info(`Downloaded file ${filepath}`);
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
  return formatText(cleanedFileName);
};

import fs from "fs";
import client from "https";
import path from "path";

import { formatText } from "./text";

/**
 * Download an image from a url
 * @param url The url of the image to download
 * @param filepath The filepath of the downloaded image
 * @returns
 */
export const downloadImage = async (url: string, filepath: string) => {
  console.info(`Attempting image download: ${url}`);
  return new Promise((resolve, reject) => {
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res
          .pipe(fs.createWriteStream(filepath))
          .on("error", reject)
          .once("close", () => resolve(filepath));
        console.info(`Downloaded image ${filepath}`);
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
 * Get an image name from a url
 * @param imageUrl The image url
 * @returns
 */
export const getImageName = (imageUrl: string) => {
  const parsed = new URL(imageUrl);
  return path.basename(parsed.pathname);
};

/**
 * Get the extension of an image from a url link.
 * @param imageUrl The image url
 * @returns
 */
export const getImageExtension = (imageUrl: string) => {
  return imageUrl.split(/[#?]/)[0].split(".").pop().trim();
};

/**
 * Format a file name to ensure it is valid.
 * @param fileName The file name
 * @returns
 */
export const formatFileName = (fileName: string) => {
  return formatText(fileName.replaceAll(":", "-"));
};

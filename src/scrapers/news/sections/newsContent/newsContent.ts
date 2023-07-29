import fs from "fs";
import { parse } from "node-html-parser";

import { nodeParser } from "./nodes";
import { downloadImage } from "../../../../utils/images";
import { MediaWikiContent } from "../../../../utils/mediawiki";
import { getNodeTagName } from "../../../../utils/nodes";
import { NewsSection } from "../types";

export type ContentSection = NewsSection & {
  title: string;
};

const ignoredTags = ["style"];

export const ContentContext = {
  imageCount: 0,
};

const newsContent: NewsSection = {
  format: async (html, url, title) => {
    const contentRoot = parse(html);

    const images = contentRoot.querySelectorAll("img");
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const imageLink = image.attributes.src;

      if (imageLink.endsWith("hr.png")) {
        continue;
      }

      const imageDirectory = `./out/news/${title}`;
      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      const imageName = `${title} (${index + 1})`;
      await downloadImage(imageLink, `${imageDirectory}/${imageName}.png`);
    }

    let content: MediaWikiContent[] = [];

    contentRoot.childNodes.forEach((node) => {
      const tag = getNodeTagName(node);
      if (ignoredTags.includes(tag) || tag === undefined) {
        return;
      }
      const result = nodeParser(node, { url, title });
      if (result === undefined) {
        return;
      }
      if (Array.isArray(result)) {
        content = content.concat(result);
      } else {
        content.push(result);
      }
    });

    return content;
  },
};

export default newsContent;

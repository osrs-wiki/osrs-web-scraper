import {
  MediaWikiBuilder,
  MediaWikiTemplate,
  PollWrapperTemplate,
} from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import { pollHeader, pollQuestions } from "./sections";
import { formatFileName } from "../../utils/file";
import { ScrapingService } from "../types";

const polls: ScrapingService<MediaWikiBuilder> = {
  scrape: async (page): Promise<MediaWikiBuilder> => {
    try {
      const results = await page.evaluate(() => {
        const poll = document.querySelector(
          '[data-testid="PollView"], .widescroll-content'
        );
        const title = poll?.querySelector("h1, h2")?.textContent;

        if (!poll || !title) {
          throw new Error("Could not find poll content");
        }

        return {
          content: poll.outerHTML,
          title,
        };
      });

      const contentRoot = parse(results.content);
      const contentNodes =
        contentRoot.querySelector(
          '[data-testid="PollView"], .widescroll-content'
        ) ?? contentRoot;

      const builder = new MediaWikiBuilder();
      builder.addContents(await pollHeader.format(contentNodes, page.url()));
      builder.addContents(await pollQuestions.format(contentNodes, page.url()));
      builder.addContent(new MediaWikiTemplate("PollFooter"));
      builder.addContent(new PollWrapperTemplate("bottom").build());

      console.info("Writing poll results to file...");
      try {
        if (!fs.existsSync("out/poll")) {
          fs.mkdirSync("out/poll", { recursive: true });
        }
        const fileName = formatFileName(
          results.title.replaceAll(/\((.)*\)/g, "")
        );
        fs.writeFileSync(`out/poll/${fileName}.txt`, builder.build());
        console.info("Successfully created poll file");
      } catch (err) {
        console.error(err);
      }

      return builder;
    } catch (error) {
      console.error(error);
    }
  },
};

export default polls;

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Ignore window typing
        const $ = window.$;
        const title = $(".widescroll-content h2").html();
        const content = $(".widescroll-content").html();

        return {
          content,
          title,
        };
      });

      const contentNodes = parse(results.content);

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
        await fs.writeFileSync(`out/poll/${fileName}.txt`, builder.build());
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

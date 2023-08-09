import fs from "fs";

import { pollHeader, pollQuestions } from "./sections";
import { formatFileName } from "../../utils/images";
import { MediaWikiBuilder } from "../../utils/mediawiki";
import { ScrapingService } from "../types";

const polls: ScrapingService<MediaWikiBuilder> = {
  scrape: async (page): Promise<MediaWikiBuilder> => {
    try {
      const results = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Ignore window typing
        const $ = window.$;
        const title = $(".widescroll-content h2").html();
        const header = $(".widescroll-content :not(fieldset)").html();
        const questions = $(".widescroll-content fieldset").html();

        return {
          header,
          questions,
          title,
        };
      });

      const builder = new MediaWikiBuilder();
      builder.addContents(await pollHeader.format(results.header, page.url()));
      builder.addContents(
        await pollQuestions.format(results.questions, page.url())
      );

      console.info("Writing poll results to file...");
      try {
        await fs.writeFileSync(
          `out/polls/${formatFileName(results.title)}.txt`,
          builder.build()
        );
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

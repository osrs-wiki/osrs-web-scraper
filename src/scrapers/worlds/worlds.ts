import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import fs from "fs";
import parse from "node-html-parser";

import { getWorldLines } from "./worlds.utils";
import { ScrapingService } from "../types";

const worlds: ScrapingService<MediaWikiBuilder> = {
  scrape: async (page): Promise<MediaWikiBuilder> => {
    try {
      const results = await page.evaluate(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Ignore window typing
        const $ = window.$;
        const worldRows = $(".server-list__body").html();

        return {
          worldRows,
        };
      });

      const worldNodes = parse(results.worldRows);

      const builder = new MediaWikiBuilder();
      builder.addContents(getWorldLines(worldNodes));

      console.info("Writing world list results to file...");
      try {
        if (!fs.existsSync("out/worlds")) {
          fs.mkdirSync("out/worlds", { recursive: true });
        }
        await fs.writeFileSync(`out/worlds/worlds.txt`, builder.build());
        console.info("Successfully created worlds file");
      } catch (err) {
        console.error(err);
      }

      return builder;
    } catch (error) {
      console.error(error);
    }
  },
};

export default worlds;

import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import * as fileUtils from "../../../../../../utils/file";
import audioParser from "../audio";

describe("audio node", () => {
  test("audio node should parse and render", () => {
    const downloadFileSpy = jest
      .spyOn(fileUtils, "downloadFile")
      .mockImplementationOnce(() => Promise.resolve("./out/news/test title/test title narration.mp3"));

    const root = parse(
      '<audio controls=""><source src="test.mp3" type="audio/wav"></audio>'
    );
    const builder = new MediaWikiBuilder();
    builder.addContents(
      [audioParser(root.firstChild, { title: "test title" })].flat()
    );

    expect(downloadFileSpy).toHaveBeenCalledWith(
      "test.mp3",
      "./out/news/test title/test title narration.mp3"
    );
    expect(builder.build()).toMatchSnapshot();
  });
});

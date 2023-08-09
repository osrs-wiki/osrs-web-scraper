import { parse } from "node-html-parser";

import { PollSection } from "./types";
import { MediaWikiBreak, MediaWikiContent } from "../../../utils/mediawiki";

const pollQuestions: PollSection = {
  format: async (html) => {
    const headerContent = parse(html);

    const questionNodes = headerContent.querySelector("fieldset");

    const content: MediaWikiContent[] = [];

    content.push(new MediaWikiBreak());

    return content;
  },
};

export default pollQuestions;

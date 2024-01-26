import {
  MediaWikiBreak,
  MediaWikiContent,
  // eslint-disable-next-line import/named
  PollAnswer,
  PollTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { PollSection } from "./types";

const pollQuestions: PollSection = {
  format: async (htmlElement) => {
    const questionNodes = htmlElement.querySelectorAll("fieldset");
    const content: MediaWikiContent[] = questionNodes.map((questionNode) => {
      if (questionNode instanceof HTMLElement) {
        const questionElement = questionNode as HTMLElement;
        const question = questionNode.querySelector("b").textContent;

        const answers: PollAnswer[] = [];
        const answerNodes = questionElement.querySelectorAll("tr");
        answerNodes.forEach((answerNode) => {
          const answerColumns = answerNode.childNodes.filter(
            (node) => node instanceof HTMLElement
          );
          const answer = answerColumns?.[0].textContent;
          const voteRaw = answerColumns?.[2].textContent;
          const vote =
            voteRaw === "Results Hidden"
              ? "1"
              : voteRaw
                  .replaceAll(/([\d\.\d\%]* \()+/g, "")
                  .replaceAll(" votes)", "");
          answers.push({
            answer,
            vote,
          });
        });

        return new PollTemplate(question, answers).build();
      }
    });

    content.push(new MediaWikiBreak());

    return content;
  },
};

export default pollQuestions;

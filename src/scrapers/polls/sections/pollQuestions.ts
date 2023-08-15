import { HTMLElement } from "node-html-parser";

import { PollSection } from "./types";
import {
  MediaWikiBreak,
  MediaWikiContent,
  PollAnswer,
  PollTemplate,
} from "../../../utils/mediawiki";

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
          const vote = answerColumns?.[2].textContent
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

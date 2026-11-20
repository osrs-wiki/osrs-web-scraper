import {
  MediaWikiBreak,
  MediaWikiContent,
  // eslint-disable-next-line import/named
  PollAnswer,
  PollTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { getPollQuestionVote } from "./polls.utils";
import { PollSection } from "./types";

const pollQuestions: PollSection = {
  format: async (htmlElement) => {
    const questionNodes = htmlElement.querySelectorAll("fieldset");
    const content: MediaWikiContent[] = questionNodes.map((questionNode) => {
      if (questionNode instanceof HTMLElement) {
        const questionElement = questionNode as HTMLElement;
        const questionContainer = questionElement.parentNode as HTMLElement;
        const question =
          questionElement.querySelector("b")?.textContent ??
          questionContainer.querySelector("h1, h2, h3, h4, h5, h6")
            ?.textContent;

        if (!question) {
          throw new Error("Could not find poll question");
        }

        const answers: PollAnswer[] = [];
        const legacyAnswerNodes = questionElement.querySelectorAll("tr");
        const answerNodes =
          legacyAnswerNodes.length > 0
            ? legacyAnswerNodes
            : questionElement.querySelectorAll("li");
        const newLayout = answerNodes.some((node) => node.tagName === "LI");

        answerNodes.forEach((answerNode) => {
          if (newLayout) {
            const answerElement = answerNode.querySelector("span");
            const answer =
              answerElement?.textContent === "Skipped"
                ? "Skip question"
                : answerElement?.textContent;

            if (!answer) {
              throw new Error("Could not find poll answer");
            }

            answers.push({
              answer,
              vote: getPollQuestionVote(
                answerNode.textContent.replace(answerElement.textContent, "")
              ),
            });
            return;
          }

          const answerColumns = answerNode.childNodes.filter(
            (node) => node instanceof HTMLElement
          );
          answers.push({
            answer: answerColumns?.[0].textContent,
            vote: getPollQuestionVote(answerColumns?.[2].textContent),
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

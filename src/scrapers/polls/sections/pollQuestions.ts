import {
  MediaWikiBreak,
  MediaWikiContent,
  MediaWikiTemplate,
  // eslint-disable-next-line import/named
  PollAnswer,
  PollTemplate,
} from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { getPollQuestionVote } from "./polls.utils";
import { PollSection } from "./types";

const formatQuestion = (questionNode: HTMLElement) => {
  const questionContainer = questionNode.parentNode as HTMLElement;
  const question =
    questionNode.querySelector("b")?.textContent ??
    questionContainer.querySelector("h1, h2, h3, h4, h5, h6")?.textContent;

  if (!question) {
    throw new Error("Could not find poll question");
  }

  const answers: PollAnswer[] = [];
  const legacyAnswerNodes = questionNode.querySelectorAll("tr");
  const answerNodes =
    legacyAnswerNodes.length > 0
      ? legacyAnswerNodes
      : questionNode.querySelectorAll("li");
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
};

const formatNewLayout = (htmlElement: HTMLElement) => {
  const children = htmlElement.childNodes.filter(
    (node): node is HTMLElement => node instanceof HTMLElement
  );
  const questionStartIndex = children.findIndex(
    (child) => child.id === "poll-questions"
  );
  if (questionStartIndex === -1) {
    throw new Error("Could not find poll questions");
  }
  const content: MediaWikiContent[] = [];

  for (const child of children.slice(questionStartIndex)) {
    const unsupportedQuestion = [
      child,
      ...child.querySelectorAll(
        '[data-testid="RankedQuestion"], [data-testid="MatrixQuestion"], [data-testid="TextQuestion"]'
      ),
    ].find(
      (element) =>
        element.getAttribute("data-testid") === "RankedQuestion" ||
        element.getAttribute("data-testid") === "MatrixQuestion" ||
        element.getAttribute("data-testid") === "TextQuestion"
    );
    if (unsupportedQuestion) {
      throw new Error(
        `Unsupported poll question layout: ${unsupportedQuestion.getAttribute(
          "data-testid"
        )}`
      );
    }

    const questions = child.querySelectorAll("fieldset");
    if (questions.length > 0) {
      questions.forEach((question) => content.push(formatQuestion(question)));
      continue;
    }

    const paragraphTexts = child
      .querySelectorAll("p")
      .map((paragraph) => paragraph.textContent.trim());
    if (paragraphTexts.some((paragraph) => paragraph.startsWith("Thanks "))) {
      continue;
    }
    const description = paragraphTexts
      .filter((paragraph) => paragraph && !paragraph.startsWith("Skipped:"))
      .join("\n\n");
    if (description) {
      const descriptionTemplate = new MediaWikiTemplate("PollDescription");
      descriptionTemplate.add("", description);
      content.push(descriptionTemplate);
    }
  }

  return content;
};

const pollQuestions: PollSection = {
  format: async (htmlElement) => {
    const newContent =
      htmlElement.getAttribute("data-testid") === "PollView"
        ? formatNewLayout(htmlElement)
        : null;
    if (newContent) {
      newContent.push(new MediaWikiBreak());
      return newContent;
    }

    const questionNodes = htmlElement.querySelectorAll("fieldset");
    const content: MediaWikiContent[] = questionNodes.map(formatQuestion);

    content.push(new MediaWikiBreak());

    return content;
  },
};

export default pollQuestions;

import { Template } from "./types";
import MediaWikiTemplate from "../template";

export type PollAnswer = {
  answer: string;
  vote: string;
};

class PollTemplate extends Template {
  answers: PollAnswer[];
  question: string;

  constructor(question: string, answers: PollAnswer[]) {
    super("Poll");
    this.question = question;
    this.answers = answers;
  }

  build() {
    const pollTemplate = new MediaWikiTemplate(this.name);
    pollTemplate.add("Question", this.question);
    this.answers.forEach((pollAnswer, index) => {
      pollTemplate.add(`Answer${index + 1}`, pollAnswer.answer);
      pollTemplate.add(`Votes${index + 1}`, pollAnswer.vote);
    });
    return pollTemplate;
  }
}

export default PollTemplate;

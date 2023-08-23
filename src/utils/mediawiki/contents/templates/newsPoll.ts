import { Template } from "./types";
import MediaWikiTemplate from "../template";

class NewsPollTemplate extends Template {
  number: number;
  question: string;

  constructor(number: number, question: string) {
    super("News Poll");
    this.number = number;
    this.question = question;
  }

  build() {
    const newsPollTemplate = new MediaWikiTemplate(this.name);
    newsPollTemplate.add("", this.number?.toString() ?? "1");
    newsPollTemplate.add("", this.question);
    return newsPollTemplate;
  }
}

export default NewsPollTemplate;

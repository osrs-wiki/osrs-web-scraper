import { Template } from "./types";
import MediaWikiTemplate from "../template";

class PollNoticeTemplate extends Template {
  end: string;
  number: number;
  start: string;
  question: string;

  constructor(number: number, start: string, end: string) {
    super("PollNotice");
    this.number = number;
    this.start = start;
    this.end = end;
  }

  build() {
    const pollNoticeTemplate = new MediaWikiTemplate(this.name);
    pollNoticeTemplate.add("", this.number.toString());
    pollNoticeTemplate.add("", this.start);
    pollNoticeTemplate.add("", this.end);
    return pollNoticeTemplate;
  }
}

export default PollNoticeTemplate;

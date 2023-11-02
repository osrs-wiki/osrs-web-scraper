import { Template } from "./types";
import MediaWikiContent from "../../content";
import MediaWikiTemplate from "../template";

class LetterTemplate extends Template {
  value: MediaWikiContent[] | MediaWikiContent | string;

  constructor(value: MediaWikiContent[] | MediaWikiContent | string) {
    super("Letter");
    this.value = value;
  }

  build() {
    const parsedValue = Array.isArray(this.value)
      ? this.value.reduce(
          (value, content) => (content ? value + "" + content.build() : value),
          ""
        )
      : this.value instanceof MediaWikiContent
      ? this.value.build()
      : this.value;
    const letterTemplate = new MediaWikiTemplate(this.name);
    letterTemplate.add("", parsedValue);
    return letterTemplate;
  }
}

export default LetterTemplate;

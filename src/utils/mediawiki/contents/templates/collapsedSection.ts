import { Template } from "./types";
import MediaWikiTemplate from "../template";

class CollapedSectionTemplate extends Template {
  length: number;
  title: string;

  constructor(length: number, title: string) {
    super("Collapsed section");
    this.length = length;
    this.title = title;
  }

  build() {
    const collapsibleTemplate = new MediaWikiTemplate(this.name);
    collapsibleTemplate.add("", this.length.toString());
    collapsibleTemplate.add("", this.title);
    return collapsibleTemplate;
  }
}

export default CollapedSectionTemplate;

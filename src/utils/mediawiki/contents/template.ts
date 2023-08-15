import MediaWikiContent from "../content";

type TemplateParam = { key: string; value: string };

class MediaWikiTemplate extends MediaWikiContent {
  name: string;
  params: TemplateParam[];

  constructor(name: string) {
    super();
    this.name = name;
    this.params = [];
  }

  add(key: string, value: string) {
    this.params.push({ key, value });
  }

  build() {
    const params = this.params.reduce(
      (allParams, param) =>
        `${allParams}${this.params.length > 3 ? "\n" : ""}|${
          param.key ? param.key + "=" : ""
        }${param.value}`,
      ""
    );
    return `{{${this.name}${params}}}\n`;
  }
}

export default MediaWikiTemplate;

import { HTMLElement } from "node-html-parser";

import { NewsPollTemplate } from "../../../../../../utils/mediawiki";
import { formatText } from "../../../../../../utils/text";
import { ContentNodeParser } from "../../types";

export const pollBoxParser: ContentNodeParser = (node) => {
  if (node instanceof HTMLElement) {
    const divElement = node as HTMLElement;
    const childNodes = divElement.childNodes.filter(
      (childNode) =>
        (childNode instanceof HTMLElement &&
          (childNode as HTMLElement).rawTagName === "p") ||
        (childNode as HTMLElement).rawTagName === "b"
    );
    let parsedNumber;
    let question = "";
    if (childNodes?.length > 1) {
      const number = childNodes?.[0]?.textContent?.replaceAll(/[^0-9]+/g, "");
      parsedNumber = parseInt(number ? number : "1");
      question = formatText(childNodes?.[1]?.textContent);
    } else {
      question = formatText(childNodes?.[0]?.textContent);
    }
    return new NewsPollTemplate(question, parsedNumber).build();
  }
};

export default pollBoxParser;

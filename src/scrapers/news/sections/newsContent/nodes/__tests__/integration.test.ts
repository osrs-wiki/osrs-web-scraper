import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import nodeParser from "../parser";

describe("integration test for trailing breaks", () => {
  test("should have proper spacing between headers and content", () => {
    const html = `
<h1>Community Discord Event</h1>
<h3>JMod Wars</h3>
<p>Join us for another round of JMod Castle Wars action!</p>
<p><b>When?</b></p>
<ul>
  <li>Friday, October 24th</li>
  <li>4:00-5:00 PM BST</li>
</ul>
<p><b>Where?</b></p>
<ul>
  <li>World 522</li>
</ul>
<p><b>What?</b></p>
<p>We're flipping your classic Castle Wars experience.</p>
<p>Two J-Mods will join the fray.</p>
`;

    const root = parse(html);
    const builder = new MediaWikiBuilder();

    root.childNodes.forEach((node) => {
      const result = nodeParser(node, { title: "test" });
      if (result) {
        builder.addContents([result].flat());
      }
    });

    expect(builder.build()).toMatchSnapshot();
  });
});

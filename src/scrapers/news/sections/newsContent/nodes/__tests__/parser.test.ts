import parse from "node-html-parser";

import nodeParser from "../parser";

describe("nodeParser ignored tags", () => {
  test("link tag (e.g. a stylesheet) should be ignored and not render an unsupported tag comment", () => {
    const root = parse(
      '<link rel="stylesheet" href="https://example.com/style.css">'
    );

    expect(nodeParser(root.firstChild, {})).toBeUndefined();
  });

  test("button tag (e.g. a back-to-top button) should be ignored and not render an unsupported tag comment", () => {
    const root = parse(
      '<button onclick="scrollToTop()" id="backToTopButton">Top</button>'
    );

    expect(nodeParser(root.firstChild, {})).toBeUndefined();
  });
});

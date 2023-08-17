import MediaWikiTable from "../table";
import MediaWikiText from "../text";

describe("MediaWikiTable", () => {
  test("it should build correctly", () => {
    const table = new MediaWikiTable(
      [
        [
          [
            new MediaWikiText("test1", { bold: true }),
            new MediaWikiText(" table1"),
          ],
          [
            new MediaWikiText("test2", { bold: true }),
            new MediaWikiText(" table2"),
          ],
        ],
        [
          [
            new MediaWikiText("test3", { italics: true }),
            new MediaWikiText(" table3"),
          ],
          [new MediaWikiText("test4\n"), new MediaWikiText(" table4")],
        ],
      ],
      {
        headers: ["test1", "test2"],
      }
    );
    expect(table.build()).toBe(
      "{| class=\"wikitable\"\n|-\n!test1\n!test2\n|-\n|'''test1''' table1\n|'''test2''' table2\n|-\n|''test3'' table3\n|test4\n table4\n|}"
    );
  });
});

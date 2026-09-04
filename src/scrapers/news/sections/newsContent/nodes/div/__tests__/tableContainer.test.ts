import { MediaWikiBuilder } from "@osrs-wiki/mediawiki-builder";
import parse from "node-html-parser";

import tableContainerParser from "../tableContainer";

const teamHtml = (
  colorHex: string,
  teamName: string,
  members: { url: string; name: string }[]
) => `
  <div class="table-scroll-group">
    <div class="table-scroll-notice" aria-hidden="true">scroll</div>
    <div class="table-scroll" role="region" tabindex="0" aria-label="Scrollable table">
      <table>
        <tbody><tr>
          <th colspan="3" style="background-color: ${colorHex};"><u>${teamName}</u></th>
        </tr><tr>
        </tr><tr>
          ${members
            .map(
              (member) =>
                `<td><a href="${member.url}" target="_blank" rel="noopener noreferrer">${member.name}</a></td>`
            )
            .join("")}
        </tr><tr>
      </tr></tbody></table>
    </div>
  </div>
`;

describe("table-container node", () => {
  test("should render one column per table-scroll-group with nested sub-tables", () => {
    const html = `
      <div class="table-container">
        ${teamHtml("#78ddeb", "Team Saradomin", [
          { url: "https://www.twitch.tv/purpp", name: "Purpp" },
          { url: "https://www.twitch.tv/potatohime", name: "Potatohime" },
          { url: "https://www.twitch.tv/mr_mammal", name: "Mr Mammal" },
        ])}
        ${teamHtml("#e05858", "Team Zamorak", [
          { url: "https://www.youtube.com/@SoloMission", name: "SoloMission" },
          { url: "https://www.twitch.tv/tastylife", name: "Tastylife" },
          { url: "https://www.twitch.tv/sardaco", name: "Sardaco" },
        ])}
      </div>
    `;

    const root = parse(html);
    const containerNode = root.querySelector(".table-container");
    const builder = new MediaWikiBuilder();
    builder.addContents([tableContainerParser(containerNode)].flat());
    const result = builder.build();

    // Outer table wraps one cell per scroll group, each holding a nested sub-table
    // that starts on its own line
    expect(result).toMatch(/^\{\|\n\|-\n\| \n\{\| class="wikitable"/);
    expect(result).toContain("Team Saradomin");
    expect(result).toContain("Team Zamorak");
    expect(result).toContain("[https://www.twitch.tv/purpp Purpp]");
    expect(result).toContain(
      "[https://www.youtube.com/@SoloMission SoloMission]"
    );

    expect(result).toMatchSnapshot();
  });

  test("should return undefined when there are no table-scroll-groups", () => {
    const root = parse(`<div class="table-container"></div>`);
    const containerNode = root.querySelector(".table-container");

    expect(tableContainerParser(containerNode)).toBeUndefined();
  });

  test("should skip scroll groups without a table", () => {
    const html = `
      <div class="table-container">
        <div class="table-scroll-group"><div class="not-a-table">no table here</div></div>
        ${teamHtml("#78ddeb", "Team Saradomin", [
          { url: "https://www.twitch.tv/purpp", name: "Purpp" },
        ])}
      </div>
    `;

    const root = parse(html);
    const containerNode = root.querySelector(".table-container");
    const builder = new MediaWikiBuilder();
    builder.addContents([tableContainerParser(containerNode)].flat());
    const result = builder.build();

    expect(result).toContain("Team Saradomin");
    expect(result).toContain("[https://www.twitch.tv/purpp Purpp]");
  });
});

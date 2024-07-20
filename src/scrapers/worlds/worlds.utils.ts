import { MediaWikiTemplate } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

export const WORLD_LIST_URL = "https://oldschool.runescape.com/a=13/slu";

export const getWorldLines = (worldRows: HTMLElement) => {
  const worldRowNodes = worldRows.childNodes.filter(
    (node) => node instanceof HTMLElement && node.tagName === "TR"
  );
  const worldLines = worldRowNodes.map((node) => {
    const tdNodes = node.childNodes.filter(
      (node) => node instanceof HTMLElement && node.tagName === "TD"
    );
    const worldLine = new MediaWikiTemplate("WorldLine", { collapsed: true });
    const worldNumber =
      tdNodes[0].childNodes?.[1].textContent?.replaceAll(/^\D+/g, "") ?? "";
    const region = tdNodes[2].textContent;
    const activity = tdNodes[4].textContent;
    const members = activity.includes("Deadman")
      ? "deadman"
      : tdNodes[3].textContent === "Members"
      ? "yes"
      : "no";
    worldLine.add("", worldNumber);
    worldLine.add("", region);
    worldLine.add("mems", members);
    worldLine.add("", activity);
    return worldLine;
  });
  return worldLines;
};

import { MediaWikiTemplate } from "@osrs-wiki/mediawiki-builder";
import { HTMLElement } from "node-html-parser";

import { World } from "./worlds.types";

export const WORLD_LIST_URL = "https://oldschool.runescape.com/a=13/slu";

/**
 * Convert html td rows to MediaWikiTemplate's
 * @param worldRows An array of world td rows
 * @returns An array of MediaWikiTemplate's
 */
export const getWorldLines = (worldRows: HTMLElement) => {
  const worldRowNodes = worldRows.childNodes.filter(
    (node) => node instanceof HTMLElement && node.tagName === "TR"
  );
  const worldLines = worldRowNodes
    .map<World>((node) => {
      const tdNodes = node.childNodes.filter(
        (node) => node instanceof HTMLElement && node.tagName === "TD"
      );
      const worldNumber =
        parseInt(
          tdNodes[0].childNodes?.[1].textContent?.replaceAll(/^\D+/g, "") ?? "1"
        ) + 300;
      const region = tdNodes[2].textContent;
      const activity = tdNodes[4].textContent;
      const members = activity.includes("Deadman")
        ? "deadman"
        : tdNodes[3].textContent === "Members"
        ? "yes"
        : "no";

      return {
        activity,
        number: worldNumber,
        region,
        type: members,
      };
    })
    .sort((a, b) => a.activity.localeCompare(b.activity))
    .map(getWorldTemplate);
  return worldLines;
};

/**
 * Convert a World to a MediaWikiTemplate
 * @param world The World
 * @returns MediaWikiTemplate
 */
export const getWorldTemplate = (world: World) => {
  const worldLine = new MediaWikiTemplate("WorldLine", { collapsed: true });
  worldLine.add("", world.number.toString());
  worldLine.add("", world.region);
  worldLine.add("mems", world.type);
  worldLine.add("", world.activity);
  return worldLine;
};

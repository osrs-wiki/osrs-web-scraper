import { formatText } from "../text";

describe("formatText", () => {
  test("should decode HTML ampersand entities", () => {
    expect(formatText("Fish &amp; Chips")).toBe("Fish & Chips");
  });

  test("should decode &nbsp; entities into regular spaces", () => {
    expect(formatText(" &nbsp; &nbsp;")).toBe(" ");
  });

  test("should collapse a newline followed by indentation into a single space", () => {
    const text =
      "Curious about PvP in Old School RuneScape? It can be a little intimidating to get into,\n    but with the right mentality and proper training, anyone can do it… Right?";
    expect(formatText(text)).toBe(
      "Curious about PvP in Old School RuneScape? It can be a little intimidating to get into, but with the right mentality and proper training, anyone can do it… Right?"
    );
  });

  test("should collapse tabs and carriage returns into a single space", () => {
    expect(formatText("Hello\t\tworld\r\nagain")).toBe("Hello world again");
  });

  test("should collapse repeated spaces into a single space", () => {
    expect(formatText("Too    many     spaces")).toBe("Too many spaces");
  });

  test("should return undefined for undefined input", () => {
    expect(formatText(undefined)).toBeUndefined();
  });
});

import ListenTemplate, { ListeTemplateOptions } from "../listen";

describe("ListenTemplate", () => {
  test("it should render with only a file", () => {
    expect(new ListenTemplate("test.mp3").build()).toMatchSnapshot();
  });

  test.each<ListeTemplateOptions>([
    { align: "left" },
    { title: "test title" },
    { align: "left", title: "test title" },
  ])("it should render with options: %j", (options) => {
    expect(new ListenTemplate("test.mp3", options).build()).toMatchSnapshot();
  });
});

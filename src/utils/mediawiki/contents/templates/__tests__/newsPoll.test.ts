import NewsPollTemplate from "../newsPoll";

describe("NewsPollTemplate", () => {
  test("it should render with a number and question", () => {
    expect(new NewsPollTemplate("test?", 5).build()).toMatchSnapshot();
  });

  test("it should render with only a question", () => {
    expect(new NewsPollTemplate("test?").build()).toMatchSnapshot();
  });
});

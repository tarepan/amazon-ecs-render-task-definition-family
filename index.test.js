const run = require(".");
const core = require("@actions/core");
const tmp = require("tmp");
const fs = require("fs");

jest.mock("@actions/core");
jest.mock("tmp");
jest.mock("fs");

describe("Render task definition", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    core.getInput = jest
      .fn()
      .mockReturnValueOnce("task-definition.json") // task-definition
      .mockReturnValueOnce("-prod"); // suffix

    process.env = Object.assign(process.env, { GITHUB_WORKSPACE: __dirname });
    process.env = Object.assign(process.env, {
      RUNNER_TEMP: "/home/runner/work/_temp",
    });

    tmp.fileSync.mockReturnValue({
      name: "new-task-def-file-name",
    });

    fs.existsSync.mockReturnValue(true);
  });

  test("renders the task definition with `-prod` family suffix and creates a new task def file", async () => {
    // mock set up
    jest.mock(
      "./task-definition.json",
      () => ({
        family: "family-value",
        containerDefinitions: [
          {
            name: "envcon",
            image: "some-other-image",
          },
        ],
      }),
      { virtual: true }
    );

    // test
    await run();
    expect(tmp.fileSync).toHaveBeenNthCalledWith(1, {
      tmpdir: "/home/runner/work/_temp",
      prefix: "task-definition-",
      postfix: ".json",
      keep: true,
      discardDescriptor: true,
    });
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      "new-task-def-file-name",
      JSON.stringify(
        {
          family: "family-value-prod",
          containerDefinitions: [
            {
              name: "envcon",
              image: "some-other-image",
            },
          ],
        },
        null,
        2
      )
    );
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      "task-definition",
      "new-task-def-file-name"
    );
  });
});

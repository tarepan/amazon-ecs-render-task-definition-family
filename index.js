const path = require("path");
const core = require("@actions/core");
const tmp = require("tmp");
const fs = require("fs");

async function run() {
  try {
    // Get inputs
    const taskDefinitionFile = core.getInput("task-definition", {
      required: true,
    });
    const suffixValue = core.getInput("suffix", { required: true });

    // Parse the task definition
    const taskDefPath = path.isAbsolute(taskDefinitionFile)
      ? taskDefinitionFile
      : path.join(process.env.GITHUB_WORKSPACE, taskDefinitionFile);
    if (!fs.existsSync(taskDefPath)) {
      throw new Error(
        `Task definition file does not exist: ${taskDefinitionFile}`
      );
    }
    //// node.js `require` read file as json
    const taskDefContents = require(taskDefPath);

    // Append suffix
    if (!taskDefContents.family) {
      throw new Error(
        "Invalid task definition format: family section should exist"
      );
    }
    taskDefContents.family = `${taskDefContents.family}${suffixValue}`;

    // Write out a new task definition file
    var updatedTaskDefFile = tmp.fileSync({
      tmpdir: process.env.RUNNER_TEMP,
      prefix: "task-definition-",
      postfix: ".json",
      keep: true,
      discardDescriptor: true,
    });
    const newTaskDefContents = JSON.stringify(taskDefContents, null, 2);
    fs.writeFileSync(updatedTaskDefFile.name, newTaskDefContents);
    core.setOutput("task-definition", updatedTaskDefFile.name);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;

/* istanbul ignore next */
if (require.main === module) {
  run();
}

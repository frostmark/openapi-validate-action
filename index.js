const core = require('@actions/core');
const api = require("@apidevtools/swagger-cli");
const fs = require('fs');

try {
  const directory = core.getInput('directory', { required: true }).trim();

  let invalidFiles = [];
  let validFiles = [];

  core.info(directory)

  fs.readdir(directory, (err, files) => {
    core.info(files);

    files.forEach(file => {
      core.info(`Validating file: ${file}`);

      var error = validate(`${directory}/${file}`, {
        type: "yaml",
        wrap: Infinity
      });

      if (error) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });
  })

  core.setOutput('invalidFiles', invalidFiles);
  core.setOutput('validFiles', validFiles);
} catch (error) {
  core.setFailed(error);
}

async function validate(file, options) {
  var error;
  try {
    await api.validate(file, options);
    core.info(`${file} is valid`);
  } catch (error) {
    core.setFailed(`${file} is invalid\n${error.message}`);
  }
  return error;
}

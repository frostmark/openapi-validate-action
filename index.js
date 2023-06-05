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

      validate(`${directory}/${file}`, {
        type: "yaml",
        wrap: Infinity
      }).then(() => {
        validFiles.push(file);
      }).catch(error => {
        invalidFiles.push(file);
        core.setFailed(`${file} is invalid\n${error.message}`);
      });
    });
  })

  core.setOutput('invalidFiles', invalidFiles);
  core.setOutput('validFiles', validFiles);
} catch (error) {
  core.setFailed(error);
}

async function validate(file, options) {
  await api.validate(file, options);
  core.info(`${file} is valid`);
}

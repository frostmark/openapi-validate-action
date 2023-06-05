const core = require('@actions/core');
const api = require("@apidevtools/swagger-cli");

try {
    const directory = core.getInput(
        '/',
        { required: true }
    ).trim();

    let files = [];
    let invalidFiles = [];
    let validFiles = [];

    fs.readdir(directory, (err, paths) => {
      paths.forEach(filePath => {
        files += filePath
      });
    });

    if (files === []) {
        return core.info('No files to validate');
    }

    files.split(/\n/).forEach(file => {
        core.info(`Validating file: ${file}`);

        var error = validate(file, {
            format: 3,
            type: "yaml",
            wrap: Infinity
        });

        if(error) {
            invalidFiles.push(file);
        } else {
            validFiles.push(file);
        }
    });

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

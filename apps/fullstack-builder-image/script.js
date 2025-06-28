const { exec } = require('child_process');
const path = require('path');

// Mocked Redis publisher
const publishLog = (log) => {
    console.log(log);
};

const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        const p = exec(cmd);

        p.stdout.on('data', (data) => publishLog(data.toString()));
        p.stderr.on('data', (data) => publishLog(`Error: ${data.toString()}`));

        p.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with exit code ${code}`));
        });
    });
};

const init = async () => {
    console.log("Starting the build server");
    publishLog("Build Started...");

    const outDirPath = path.join(__dirname, 'output');
    console.log(outDirPath);

    try {
        await runCommand(`cd ${outDirPath} && npm install && npm run build && npm run start -- --port 80`);
    } catch (err) {
        publishLog(`Error in initial command: ${err.message}`);
        publishLog("Trying fallback command...");

        try {
            await runCommand(`cd ${outDirPath} && npm install -g serve && serve -s dist -l 80`);
        } catch (fallbackErr) {
            publishLog(`Fallback command failed: ${fallbackErr.message}`);
            publishLog("Exiting the process...");
            process.exit(1);
        }
    }
};

init();

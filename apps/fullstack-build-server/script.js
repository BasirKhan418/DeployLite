const { exec } = require('child_process');
const path = require('path');
// const fs = require('fs');
// const Redis = require('ioredis');
// const publisher = new Redis();

// Redis publisher (mocked for now)
const publishLog = (log) => {
    // publisher.publish(`logs:${projectid}`, JSON.stringify({ log }));
    console.log(log);
};

// Function to execute a command and handle stdout, stderr, and exit
const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        const p = exec(cmd);

        p.stdout.on('data', (data) => {
            publishLog(data.toString());
        });

        p.stderr.on('data', (data) => {
            publishLog(`Error: ${data.toString()}`);
        });

        p.on('exit', (code) => {
            if (code === 0) {
                resolve(); // Command successful
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });
    });
};

// Main logic
const init = async () => {
    console.log("Starting the build server");
    publishLog("Build Started...");

    const outDirPath = path.join(__dirname, 'output');
    console.log(outDirPath);

    try {
        // Try running the build and start command on port 9000
        await runCommand(`cd ${outDirPath} && npm install && npm run build && npm run start -- --port 9000`);
    } catch (err) {
        publishLog(`Error in initial command: ${err.message}`);
        publishLog("Trying fallback command...");
        
        try {
            // If the first command fails, try running the fallback command on port 9002
            await runCommand(`cd ${outDirPath} && npm install -g serve && serve -s dist -l 9000`);
        } catch (fallbackErr) {
            // If the fallback command also fails, log the error and exit
            publishLog(`Fallback command failed: ${fallbackErr.message}`);
            publishLog("Exiting the process...");
            process.exit(1);  // Exit the process with failure
        }
    }
};

init();

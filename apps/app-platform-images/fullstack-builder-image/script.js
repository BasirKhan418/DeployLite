const { exec } = require('child_process');
const path = require('path');
const Redis = require('ioredis');
const axios = require('axios');
const fs = require('fs');

// Redis configuration (Aiven)
const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default',
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {}
};

const publisher = new Redis(redisConfig);

// Environment variables
const { projectid,techused,installcommand,buildcommand,env,runcommand } = process.env;

if(techused !== "Next.js" && techused !== "Node.js") {
    console.error("Invalid tech stack specified. Supported stacks are: Next.js, Node.js");
    process.exit(1);
}

// Redis log publisher
const publishLog = (message, type = 'info') => {
    const log = {
        timestamp: new Date().toISOString(),
        message,
        type,
        projectId: projectid
    };
    publisher.publish(`logs:${projectid}`, JSON.stringify(log));
    console.log(`[${type.toUpperCase()}] ${message}`);
};

// Status updater
const updateDeploymentStatus = async (status) => {
    try {
        await axios.post("https://api.deploylite.tech/status/deploy", {
            name: projectid,
            status: status
        }, {
            headers: { "Content-Type": "application/json" }
        });
        publishLog(`Deployment status updated to: ${status}`, 'info');
    } catch (err) {
        publishLog(`Failed to update status: ${err.message}`, 'error');
    }
};

// Run shell command
const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        const process = exec(cmd);

        process.stdout.on('data', (data) => publishLog(data.toString().trim(), 'info'));
        process.stderr.on('data', (data) => publishLog(data.toString().trim(), 'error'));

        process.on('exit', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with exit code ${code}`));
        });
    });
};

// Main runner
const init = async () => {
    publishLog("🚀 Starting Next.js SSR deployment");

    const appPath = path.join(__dirname, 'output');
    const envPath = path.join(appPath, '.env');

    try {
        publishLog("Writing .env file...", 'info');

        fs.writeFileSync(envPath, env || "");

        publishLog("✅ .env file created successfully", 'success');

        await runCommand(`cd ${appPath} && ${installcommand || "npm install"}`);
        if (techused === "Next.js") {
            await runCommand(`cd ${appPath} && ${buildcommand || 'npm run build'}`);
        }
        if(techused === "Node.js" && buildcommand!=="") {
            await runCommand(`cd ${appPath} && ${buildcommand || 'npm run build'}`);
        }
        await updateDeploymentStatus("live");
        publishLog("✅ Deployment successful and server running fine", 'success');
        await runCommand(`cd ${appPath} && npm run start -- --port 80`);
        

        
    } catch (err) {
        publishLog(`❌ Deployment failed: ${err.message}`, 'error');
        await updateDeploymentStatus("failed");
        process.exit(1);
    }
};

init();

const { exec } = require('child_process');
const path = require('path');
const Redis = require('ioredis');
const axios = require('axios');
const fs = require('fs');
const http = require('http');
// Redis configuration (Aiven)

const serveStaticHTML = () => {
    const filePath = path.join(__dirname, 'output', 'index.html');

    const server = http.createServer((req, res) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    });

    server.listen(80, () => {
        publishLog("📡 Static HTML served on port 80", 'success');
    });
};

const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default',
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {}
};

const publisher = new Redis(redisConfig);

// Environment variables
const { projectid,env } = process.env;


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
    publishLog("🚀 Starting chatbot deployment");

    const appPath = path.join(__dirname, 'output');
    const envPath = path.join(appPath, '.env');

    try {
        publishLog("Writing .env file...", 'info');

        fs.writeFileSync(envPath, env || "");

        publishLog("✅ .env file created successfully", 'success');

        await runCommand(`cd ${appPath} && npm install`);
      
    
        publishLog("✅ Deployment successful and server running fine", 'success');
        serveStaticHTML();
        publishLog("✅ Static HTML served successfully", 'success');
        await runCommand(`cd ${appPath} && node src/index.js`);
        publishLog("✅ Application started successfully", 'success');
        
    } catch (err) {
        publishLog(`❌ Deployment failed: ${err.message}`, 'error');
        process.exit(1);
    }
};

init();

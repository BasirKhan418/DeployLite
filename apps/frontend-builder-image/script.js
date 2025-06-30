const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');
const axios = require('axios');

// Log Types
const LOG_TYPES = {
    INFO: 'info',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning'
};

// Env Vars
const {
    region,
    accesskeyid,
    accesskeysecret,
    projectid,
    bucket,
    techused,
} = process.env;

if(techused !== "HTML,CSS,JS") {
    console.error("Invalid tech stack specified. Supported stacks are: React, Vite, HTML,CSS,JS");
    process.exit(1);
}

// Redis Config
const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default',
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {}
};

const publisher = new Redis(redisConfig);

// AWS S3 Client
const s3client = new S3Client({
    region,
    credentials: {
        accessKeyId: accesskeyid,
        secretAccessKey: accesskeysecret
    }
});

// Log publisher
const publishLog = (message, type = LOG_TYPES.INFO) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        message,
        type,
        projectId: projectid
    };
    publisher.publish(`logs:${projectid}`, JSON.stringify(logEntry));
    console.log(`[${type.toUpperCase()}] ${message}`);
};

// Update Deployment Status
const updateDeploymentStatus = async (status) => {
    try {
        await axios.post("https://api.deploylite.tech/status/deploy", {
            name: projectid,
            status
        }, {
            headers: { "Content-Type": "application/json" }
        });
        publishLog(`Deployment status updated to: ${status}`, LOG_TYPES.INFO);
    } catch (error) {
        publishLog(`Failed to update deployment status: ${error.message}`, LOG_TYPES.ERROR);
    }
};

// Main logic
const init = async () => {
    try {
        publishLog("🚀 Starting static deployment...", LOG_TYPES.INFO);
        const distFolderPATH = path.join(__dirname, 'output');

        if (!fs.existsSync(distFolderPATH)) {
            throw new Error(`Output folder not found: ${distFolderPATH}`);
        }

        publishLog("📦 Uploading files to S3...", LOG_TYPES.INFO);
        const distFolderContents = fs.readdirSync(distFolderPATH, { recursive: true });

        let uploaded = 0;
        const total = distFolderContents.length;

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPATH, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            publishLog(`Uploading (${++uploaded}/${total}): ${file}`, LOG_TYPES.INFO);

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: `__outputs/${projectid}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || 'application/octet-stream'
            });

            await s3client.send(command);
            publishLog(`✅ Uploaded: ${file}`, LOG_TYPES.SUCCESS);
        }

        await updateDeploymentStatus("live");
        publishLog("🎉 Deployment completed successfully", LOG_TYPES.SUCCESS);
        publishLog(`🌐 Website is live at: https://${projectid}.cloud.deploylite.tech`, LOG_TYPES.SUCCESS);
        process.exit(0);

    } catch (err) {
        publishLog(`❌ Deployment failed: ${err.message}`, LOG_TYPES.ERROR);
        await updateDeploymentStatus("failed");
        process.exit(1);
    }
};

init();

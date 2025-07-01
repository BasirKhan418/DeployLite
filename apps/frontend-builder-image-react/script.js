const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');
const axios = require('axios');

// Constants for log types
const LOG_TYPES = {
    INFO: 'info',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning'
};

const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default', // Required for Aiven
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {} // ✅ Must enable TLS for Aiven
};

const publisher = new Redis(redisConfig);
const { region, accesskeyid, accesskeysecret, projectid, bucket,techused,installcommand,buildcommand,buildfolder,env} = process.env;

if(techused !== "React" && techused !== "Vite" && techused !=="Vue.js") {
    console.error("Invalid tech stack specified. Supported stacks are: React, Vite, HTML,CSS,JS");
    process.exit(1);
}

// Setting up the AWS client
const s3client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accesskeyid,
        secretAccessKey: accesskeysecret
    }
});

// Enhanced Redis publisher with log types
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

// Function to update deployment status
const updateDeploymentStatus = async (status) => {
    try {
        const response = await axios.post("https://api.deploylite.tech/status/deploy", {
            name: projectid,
            status: status
        }, {
            headers: { "Content-Type": "application/json" }
        });
        publishLog(`Deployment status updated to: ${status}`, LOG_TYPES.INFO);
        return response.data;
    } catch (error) {
        publishLog(`Failed to update deployment status: ${error.message}`, LOG_TYPES.ERROR);
        throw error;
    }
};

// Function to handle build process
const handleBuild = async (outDirPath) => {
    return new Promise((resolve, reject) => {
        publishLog("copying env ...", LOG_TYPES.INFO);

        try {
            // Directly write multi-line env content
            fs.writeFileSync(path.join(outDirPath, '.env'), env);
            publishLog("✅ .env file created successfully", LOG_TYPES.SUCCESS);
        } catch (err) {
            publishLog(`❌ Failed to write .env file: ${err.message}`, LOG_TYPES.ERROR);
            return reject(err);
        }

        publishLog("Initiating build process...", LOG_TYPES.INFO);
        const p = exec(`cd ${outDirPath} && ${installcommand || "npm install"} && ${buildcommand || 'npm run build'}`);

        p.stdout.on('data', (data) => {
            publishLog(data.toString().trim(), LOG_TYPES.INFO);
        });

        p.stderr.on('data', (data) => {
            publishLog(data.toString().trim(), LOG_TYPES.ERROR);
        });

        p.on('close', (code) => {
            if (code === 0) {
                publishLog("Build completed successfully", LOG_TYPES.SUCCESS);
                resolve();
            } else {
                publishLog(`Build failed with code ${code}`, LOG_TYPES.ERROR);
                reject(new Error(`Build process exited with code ${code}`));
            }
        });
    });
};

// Function to handle S3 uploads
const handleS3Upload = async (distFolderPATH) => {
    try {
        publishLog("Starting S3 upload process...", LOG_TYPES.INFO);
        const distFolderContents = fs.readdirSync(distFolderPATH, { recursive: true });
        let uploadedFiles = 0;
        const totalFiles = distFolderContents.length;

        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPATH, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            publishLog(`Uploading (${++uploadedFiles}/${totalFiles}): ${file}`, LOG_TYPES.INFO);
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: `__outputs/${projectid}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || 'application/octet-stream'
            });
            await s3client.send(command);
            publishLog(`Successfully uploaded: ${file}`, LOG_TYPES.SUCCESS);
        }
        publishLog("All files uploaded successfully", LOG_TYPES.SUCCESS);
    } catch (error) {
        publishLog(`S3 upload failed: ${error.message}`, LOG_TYPES.ERROR);
        throw error;
    }
};

// Main logic
const init = async () => {
    try {
        publishLog("🚀 Starting deployment process", LOG_TYPES.INFO);
        const outDirPath = path.join(__dirname, 'output');
        const distFolderPATH = path.join(outDirPath, `${buildfolder || 'dist'}`);

        // Build Phase
        await handleBuild(outDirPath);

        // Upload Phase
        await handleS3Upload(distFolderPATH);

        // Success completion
        await updateDeploymentStatus("live");
        publishLog("✅ Deployment completed successfully", LOG_TYPES.SUCCESS);
        publishLog(`🌐 Website is live at https://${projectid}.cloud.deploylite.tech`, LOG_TYPES.SUCCESS);
        process.exit(0);

    } catch (error) {
        publishLog(`❌ Deployment failed: ${error.message}`, LOG_TYPES.ERROR);
        await updateDeploymentStatus("failed");
        process.exit(1);
    }
};

init();
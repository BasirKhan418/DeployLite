const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');
const axios = require('axios');

const redisConfig = {
    username: 'default',
    password: 'FxvuXWrG8SprckQkqEZXU4I7fUnW6VKH',
    host: 'redis-19432.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 19432,
    retryStrategy: function(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
};

const publisher = new Redis(redisConfig);
const { region, accesskeyid, accesskeysecret, projectid, bucket } = process.env;

// Setting up the AWS client
const s3client = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accesskeyid,
        secretAccessKey: accesskeysecret
    }
});

// Redis publisher
const publishLog = (log) => {
    publisher.publish(`logs:${projectid}`, JSON.stringify({ log }));
    console.log(log);
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
        return response.data;
    } catch (error) {
        console.log(error);
        publishLog(`Error updating deployment status: ${error.message}`);
    }
};

// Main logic
const init = async () => {
    console.log("Starting the build server");
    publishLog("Build Started...");

    const outDirPath = path.join(__dirname, 'output');
    console.log(outDirPath);
    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', (data) => {
        publishLog(data.toString());
    });

    p.stderr.on('data', async (data) => {
        publishLog(`exError: ${data.toString()}`);
        await updateDeploymentStatus("failed");
    });

    p.on('close', async () => {
        publishLog("Build Completed...");
        const distFolderPATH = path.join(outDirPath, 'dist');
        const distFolderContents = fs.readdirSync(distFolderPATH, { recursive: true });
        publishLog("Uploading files to S3...");

        // Upload files to S3
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPATH, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            publishLog(`Uploading ${file}...`);
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: `__outputs/${projectid}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath) || 'application/octet-stream'
            });
            await s3client.send(command);
            publishLog(`Uploaded ${file}`);
        }

        publishLog("Upload Completed...");
        publishLog("Done...");
        await updateDeploymentStatus("live");
        publishLog("Success");
        publishLog(`Website is up and running at https://${projectid}.cloud.deploylite.tech`);
        process.exit(0);
    });
};

init();

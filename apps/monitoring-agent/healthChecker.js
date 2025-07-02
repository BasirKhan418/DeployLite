// apps/monitoring-agent/healthChecker.js
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const { memoryStore } = require('./redisSubscriber');
const { sendFailureEmail } = require('./mailer');
const { analyzeLogs } = require('../../packages/utils/logAnalyzer');

const docker = new Docker();

async function isContainerRunning(projectId) {
    const containers = await docker.listContainers();
    return containers.some(c => c.Names.includes(`/${projectId}`));
}

async function checkHealthAndPersist() {
    console.log(`[Monitor] Running 30-minute health check...`);

    for (const [projectId, data] of memoryStore.entries()) {
        const isRunning = await isContainerRunning(projectId);

        if (!isRunning) {
            // console.log(`[ALERT] Project ${projectId} is DOWN.`);
            // Here you'd call sendEmail(projectId, reason)

            const lastEntry = data[data.length - 1] || {};
            const { reason, suggestion } = analyzeLogs(lastEntry.logs || '');

            await sendFailureEmail({ projectId, reason, suggestion });
        } else {
            console.log(`[OK] Project ${projectId} is running.`);
        }

        // Simulate persisting to DB (write to file for now)
        const filename = path.join(__dirname, `logs_${projectId}.json`);
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        memoryStore.set(projectId, []); // clear buffer
    }
}

module.exports = { checkHealthAndPersist };

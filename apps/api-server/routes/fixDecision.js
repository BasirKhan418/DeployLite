
import express from 'express';
import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const docker = new Docker();

async function restartContainer(projectId) {
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find(c => c.Names.includes(`/${projectId}`));
    if (!containerInfo) return false;

    const container = docker.getContainer(containerInfo.Id);
    await container.restart();
    return true;
}

function logDecision(projectId, action) {
    const log = {
        projectId,
        action,
        timestamp: new Date().toISOString()
    };

    const filePath = path.join(__dirname, `../decision_log_${projectId}.json`);
    const old = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];
    old.push(log);
    fs.writeFileSync(filePath, JSON.stringify(old, null, 2));
}

router.get('/apply-fix', async (req, res) => {
    const { projectId } = req.query;
    const success = await restartContainer(projectId);
    logDecision(projectId, success ? 'fix_applied' : 'fix_failed');

    return res.send(success
        ? `<h2>Fix applied successfully for ${projectId}</h2>`
        : `<h2>Failed to apply fix for ${projectId}</h2>`);
});

router.get('/ignore-fix', (req, res) => {
    const { projectId } = req.query;
    logDecision(projectId, 'fix_ignored');
    return res.send(`<h2>Fix ignored for ${projectId}</h2>`);
});

export default router;


import express from 'express';
import fs from 'fs';
import path from 'path';
import Docker from 'dockerode';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const docker = new Docker();

// Load last 30-min metrics
router.get('/metrics', (req, res) => {
    const { projectId } = req.query;
    const filePath = path.join(__dirname, '../../monitoring-agent', `logs_${projectId}.json`);

    if (!fs.existsSync(filePath)) return res.json([]);

    const raw = fs.readFileSync(filePath, 'utf-8');
    try {
        const parsed = JSON.parse(raw);
        return res.json(parsed);
    } catch {
        return res.status(500).json({ error: 'Failed to parse metrics' });
    }
});

// Load latest logs (from logs.txt)
router.get('/logs', (req, res) => {
    try {
        const logs = fs.readFileSync('logs.txt', 'utf-8'); // Adjust path if needed
        return res.send(logs.split('\n').slice(-20).join('\n'));
    } catch {
        return res.send('[No logs found]');
    }
});

// Check container status
router.get('/status', async (req, res) => {
    const { projectId } = req.query;
    try {
        const containers = await docker.listContainers();
        const running = containers.some(c => c.Names.includes(`/${projectId}`));
        return res.send(running ? 'Running' : 'Stopped');
    } catch (err) {
        return res.status(500).send('Error checking container status');
    }
});

// Load decision history
router.get('/decisions', (req, res) => {
    const { projectId } = req.query;
    const filePath = path.join(__dirname, `../decision_log_${projectId}.json`);
    if (!fs.existsSync(filePath)) return res.json([]);

    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json(parsed);
    } catch {
        return res.status(500).json({ error: 'Failed to parse decision log' });
    }
});

export default router;

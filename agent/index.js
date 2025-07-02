const { collectMetrics } = require('./metricsCollector');
const { tailLogs } = require('./logTailer');
const { publishData } = require('./publisher');
// require('dotenv').config();


const PROJECT_ID = process.env.PROJECT_ID || 'test-project';

setInterval(async () => {
    try {
        const metrics = await collectMetrics();
        const logs = await tailLogs();

        const payload = {
            timestamp: Date.now(),
            logs,
            ...metrics,
        };

        await publishData(PROJECT_ID, payload);
        console.log(`[Agent] Data sent for ${PROJECT_ID}`);
    } catch (err) {
        console.error('[Agent Error]', err.message);
    }
}, 3000);

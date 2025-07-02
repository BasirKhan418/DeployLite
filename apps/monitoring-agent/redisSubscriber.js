// apps/monitoring-agent/redisSubscriber.js
const redis = require('redis');
const memoryStore = new Map(); // projectId -> [messages]

const MAX_ENTRIES = 600; // 3s interval * 600 = 30 minutes

async function subscribeToMetrics() {
    const sub = redis.createClient();
    await sub.connect();

    await sub.pSubscribe('project:*', (message, channel) => {
        const projectId = channel.split(':')[1];
        const parsed = JSON.parse(message);

        if (!memoryStore.has(projectId)) memoryStore.set(projectId, []);
        const list = memoryStore.get(projectId);
        list.push(parsed);

        // keep only last 30 minutes (max 600 entries)
        if (list.length > MAX_ENTRIES) list.shift();
    });

    console.log(`[Monitor] Subscribed to Redis`);
}

module.exports = { subscribeToMetrics, memoryStore };

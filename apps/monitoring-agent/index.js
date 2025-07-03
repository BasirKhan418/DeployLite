// apps/monitoring-agent/index.js
const { subscribeToMetrics } = require('./redisSubscriber');
const { checkHealthAndPersist } = require('./healthChecker');

(async () => {
    await subscribeToMetrics();

    // Run health + DB write every 30 minutes
    setInterval(checkHealthAndPersist, 30*60 * 1000);

    console.log(`[Monitor] Service started`);
})();

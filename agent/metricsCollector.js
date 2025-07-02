const pidusage = require('pidusage');

exports.collectMetrics = async () => {
    const stats = await pidusage(process.pid);
    return {
        cpu: stats.cpu.toFixed(2),
        memory: (stats.memory / 1024 / 1024).toFixed(2) + ' MB',
    };
};

const redis = require('redis');
const client = redis.createClient();

client.connect().catch(console.error);

exports.publishData = async (projectId, data) => {
    const channel = `project:${projectId}`;
    await client.publish(channel, JSON.stringify(data));
};

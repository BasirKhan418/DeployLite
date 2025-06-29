import { Server } from 'socket.io';
import { createServer } from 'http';
import Redis from 'ioredis';


const redisConfig = {
    host: 'valkey-1dec9a5f-basirkhanaws-5861.c.aivencloud.com',
    port: 24291,
    username: 'default',
    password: 'AVNS__TnY6dEjpphUtR6tTl4',
    tls: {}
};

// Create Redis Publisher & Subscriber
const subscriber = new Redis(redisConfig);
const publisher = new Redis(redisConfig);

// Redis Event Listeners
subscriber.on('connect', () => console.log('✅ Connected to Redis (Valkey)'));
subscriber.on('error', (err) => console.error('❌ Redis Error:', err));
subscriber.on('close', () => console.warn('⚠️ Redis connection closed'));
subscriber.on('ready', () => console.log('🟢 Redis Ready'));

// Create HTTP Server and Attach Socket.io
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket'],
    allowEIO3: true
});

// Socket.io Event Handling
io.on('connection', (socket) => {
    console.log(`🔗 Client connected: ${socket.id}`);

    socket.conn.on('ping', () => console.log(`📡 Ping from ${socket.id}`));
    socket.conn.on('pong', (latency) => console.log(`📡 Pong from ${socket.id} | Latency: ${latency} ms`));

    socket.on('subscribe', (channel) => {
        socket.join(channel);
        console.log(`📢 ${socket.id} subscribed to ${channel}`);
        socket.emit('message', `Joined ${channel}`);
    });

    socket.on('disconnect', (reason) => {
        console.log(`❌ ${socket.id} disconnected | Reason: ${reason}`);
    });
});

// Redis Pub/Sub Handling
async function initRedisSubscribe() {
    try {
        console.log('📡 Subscribing to channels matching: logs:*');
        await subscriber.psubscribe('logs:*');

        subscriber.on('pmessage', (pattern, channel, message) => {
            console.log(`📥 Redis [${channel}]: ${message}`);
            io.to(channel).emit('message', message);
        });
    } catch (err) {
        console.error('❌ Failed Redis Subscribe:', err);
    }
}

// Global Error Handling
process.on('uncaughtException', (err) => console.error('🔥 Uncaught Exception:', err));
process.on('unhandledRejection', (err) => console.error('🔥 Unhandled Promise Rejection:', err));

// Start HTTP Server
httpServer.listen(9000, () => {
    console.log('🚀 Socket.IO server running on port 9000');
    initRedisSubscribe();
});

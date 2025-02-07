import { Server } from 'socket.io';
import { createServer } from 'http';
import Redis from 'ioredis';

// Direct Redis Configuration (Visible but Well-Structured)
const redisConfig = {
    username: 'default',
    password: 'FxvuXWrG8SprckQkqEZXU4I7fUnW6VKH',
    host: 'redis-19432.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 19432,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3
};

// Create Redis Subscriber & Publisher
const subscriber = new Redis(redisConfig);
const publisher = new Redis(redisConfig);

// Redis Event Listeners
subscriber.on('connect', () => console.log('✅ Connected to Redis'));
subscriber.on('error', (error) => console.error('❌ Redis Error:', error));
subscriber.on('close', () => console.warn('⚠️ Redis connection closed, reconnecting...'));

// Create HTTP Server and Attach Socket.io
const httpServer = createServer();
const io = new Server(httpServer, { 
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
    transports: ['websocket'],
    allowEIO3: true
});

// Socket.io Connection Handling
io.on('connection', (socket) => {
    console.log(`🔗 New Client Connected: ${socket.id}`);

    socket.conn.on('ping', () => console.log(`📡 Ping from ${socket.id}`));
    socket.conn.on('pong', (latency) => console.log(`📡 Pong from ${socket.id}, Latency: ${latency} ms`));

    socket.on('subscribe', (channel) => {
        socket.join(channel);
        console.log(`📢 Client ${socket.id} subscribed to ${channel}`);
        socket.emit('message', `Joined ${channel}`);
    });

    socket.on('disconnect', (reason) => console.log(`❌ Client ${socket.id} disconnected. Reason: ${reason}`));
});

// Redis Subscription Logic
async function initRedisSubscribe() {
    try {
        console.log('📡 Subscribing to logs...');
        await subscriber.psubscribe('logs:*');

        subscriber.on('pmessage', (pattern, channel, message) => {
            console.log(`📥 Received message on ${channel}: ${message}`);
            io.to(channel).emit('message', message);
        });
    } catch (error) {
        console.error('❌ Redis Subscription Error:', error);
    }
}

// Global Error Handling
process.on('uncaughtException', (err) => console.error('🔥 Uncaught Exception:', err));
process.on('unhandledRejection', (err) => console.error('🔥 Unhandled Promise Rejection:', err));

// Start the Server
httpServer.listen(9000, () => {
    console.log('🚀 Socket Server Running on Port 9000');
    initRedisSubscribe();
});

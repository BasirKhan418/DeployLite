'use client'; // Ensure client-side execution

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Page = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socket: Socket = io('http://localhost:9000', {
            transports: ['websocket'], // ✅ Force WebSocket
            reconnection: true,        // ✅ Auto-reconnect enabled
            reconnectionAttempts: 5,   // ✅ Max retry attempts
            reconnectionDelay: 2000    // ✅ Delay before retrying
        });

        socket.on('connect', () => {
            console.log('✅ Connected to Socket.io server');
            setIsConnected(true);
            socket.emit('subscribe', 'logs:aniketguy');
        });

        socket.on('message', (msg) => {
            console.log('📥 New message received:', msg);
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('disconnect', (reason) => {
            console.warn('❌ Disconnected:', reason);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('🚨 Connection Error:', error);
        });

        return () => {
            socket.disconnect();
            console.log('🔌 Socket disconnected');
        };
    }, []);

    return (
        <div>
            <h1>Socket.io Logs</h1>
            <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default Page;

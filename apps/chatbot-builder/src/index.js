import express from 'express';
import 'dotenv/config';
import chat from '../routes/chat/chat.js';
import loaders from '../routes/loaders/loaders.js';


const app = express();
app.use(express.json());
app.use('/loaders', loaders.router);
app.use('/ai', chat.router);
app.get('/', (req, res) => {
    res.send("Welcome to the Chatbot Builder API! This is a simple chatbot builder application.");
});
app.listen(5080, () => {
    console.log('Chatbot Builder API is running on port 5080');
});
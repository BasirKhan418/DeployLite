import express from 'express';
import axios from 'axios';
const router = express.Router();
const AGENT_URL = 'https://agent-c46804c538b44b561000-89g8p.ondigitalocean.app/api/v1/chat/completions';
const checkApiKey = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    next();
};
router.get('/llm', (req, res) => {
    res.send('Hello from LLM!');
})
router.post('/llm',checkApiKey, async(req, res) => {
    const { question, stream = false } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    const payload = {
        messages: [{ role: 'user', content: question }],
        stream: stream
    };

    try {
        const config = {
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json'
            }
        };

        if (stream) {
            config.responseType = 'stream';
            const response = await axios.post(AGENT_URL, payload, config);

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            response.data.pipe(res);
        } else {
            const response = await axios.post(AGENT_URL, payload, config);
            res.json(response.data);
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ 
            error: error.response?.data || 'Failed to process request' 
        });
    }
})
export default { router };
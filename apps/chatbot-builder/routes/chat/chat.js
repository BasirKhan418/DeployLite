import express from 'express';
const router = express.Router();
import { ragWithOpenAI } from '../../rag/ragwithopenai.js';
import { ragWithGemini } from '../../rag/ragwithgemmeini.js';

router.get('/chat', (req, res) => {
    res.send("Welcome to the Chatbot Builder API! This is a simple chatbot builder application.");
});

router.post('/chat', async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { query,type } = req.body;
        if (!query||!type) {
            return res.status(400).send({ error: 'Query is required.' });
        }
        if(type === 'openai'){
            console.log("Using OpenAI for RAG");
            const response = await ragWithOpenAI(query);
            return res.status(200).send({
                message: 'Response from OpenAI:',
                data: response
            });
        }
        else{
            console.log("Using Google Gemini for RAG");
            const response = await ragWithGemini(query);
            return res.status(200).send({
                message: 'Response from Google Gemini:',
                data: response
            });
        }
        
    } catch (error) {
        console.error("Error in /chat route:", error);
        return res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
});


export default { router };
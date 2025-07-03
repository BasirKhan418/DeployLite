import express from 'express';
import { loadFileByType } from '../../functions/loadfileType.js';
import { textspitters } from '../../functions/textsplitters.js';
import { storeWithOpenAI } from '../../functions/storewithopenai.js';
import { storeWithGemini } from '../../functions/storewithgoogle.js';
const router = express.Router();

router.get('/train', async(req, res) => {
    
    res.send("Welcome to the Loaders API! This is a simple chatbot builder application.");
});
router.post('/train',async(req,res)=>{
try{
 const { url } = req.body;
 const data = await loadFileByType(url);
    if (!data || data.length === 0) {
        return res.status(400).send({ error: 'No data found for the provided URL.' });
    }
    // Split the data into smaller chunks
    const splitData = await textspitters(data);
    if (!splitData || splitData.length === 0) {
        return res.status(400).send({ error: 'No data found after splitting.' });
    }

    console.log("Data loaded and split successfully:", splitData.length, "chunks created.");
   if(req.body.storeType == 'openai'){
        const isStored = await storeWithOpenAI(splitData);
        if (!isStored) {
            return res.status(500).send({ error: 'Failed to store data with OpenAI.' });
        }
    }
    else{
        const isStored = await storeWithGemini(splitData);
        if (!isStored) {
            return res.status(500).send({ error: 'Failed to store data with Google Gemini.' });
    }
    return res.status(200).send({
        message: 'Data loaded, split, and stored successfully.',
        data: splitData
    });
   }

    return res.status(200).send({
        message: 'Data loaded and split successfully.',
        data: splitData 
    });


}
catch(err){
    console.log("Error in /train route:", err);
    return res.status(500).send({ error: 'An error occurred while processing your request.' });
}
})

export default { router };
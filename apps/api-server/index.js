import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config'
import deploy from './routes/deploy.js';
import createDeployment from './routes/createDeployment.js';
import ConnectDb from '../middleware/connectdb.js';
import createDeploymentMiddleware from './applogics/middleware/Checkauth.js';
import webhook from './routes/webhook.js';
import status from './routes/status.js';
import rebuild from './routes/rebuild.js';
import llm from './routes/llm.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin:'*'
}));
app.use('/chat',llm.router);
app.use('/status',status.router);
app.use('/rebuild',rebuild.router);
app.use('/deploy',deploy.router);
app.use('/webhook',webhook.router);
app.use('/createdeployment',createDeploymentMiddleware,createDeployment.router);
app.get('/',async(req,res)=>{
    


   
    res.send("API Server");
 
})

app.listen(5000,async()=>{
    console.log("API Server is running");
    await ConnectDb();
})
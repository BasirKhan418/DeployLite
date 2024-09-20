import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from '../models/User.js';
import 'dotenv/config'
import deploy from './routes/deploy.js';
import ConnectDb from '../middleware/connectdb.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin:'*'
}));
app.use('/deploy',deploy.router);
app.get('/',async(req,res)=>{
    
    const user = new User({
        name:"John Doe",
        email:"ab@gmail.com"
    })
    let data = await user.save();
    console.log(data);

   
    res.send("API Server");
 
})

app.listen(5000,async()=>{
    console.log("API Server is running");
    await ConnectDb();
})
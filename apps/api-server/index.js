import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import deploy from './routes/deploy.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin:'*'
}));
app.use('/deploy',deploy.router);
app.get('/',(req,res)=>{
    res.send("API Server");
})

app.listen(5000,()=>{
    console.log("API Server is running");
})
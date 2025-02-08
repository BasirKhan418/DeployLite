import express from 'express';
const router = express.Router();
import axios from 'axios';
import Project from '../../models/Project.js';
router.get('/', (req, res) => {
    res.send('rebuild API is working properly');
})
router.post('/', async(req, res) => {
    try{
     let project =await Project.findOneAndUpdate({repourl:req.body.repourl},{projectstatus:"creating"});
     if(project==null){
        return res.status(400).json({message:"Project not found",success:false});
     }
     let reep = await axios.post('https://api.deploylite.tech/deploy/react',{
            projectid:project.name,
            giturl:project.repourl
     });
     if(reep.data.success==true){
        return res.status(200).json({message:"Project rebuild initiated successfully",success:true});
     }
    }
    catch(err){
        return res.status(500).json({message:"Internal server error",success:false});
    }
})
export default {router};
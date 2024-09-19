import express from "express";
const router = express.Router();
router.get('/', (req, res) => {
    res.send("i am in deploy route");
});
router.post('/react',(req,res)=>{
    console.log(req.body,process.env.basir);
    res.send("react deploy");
})

export default { router };
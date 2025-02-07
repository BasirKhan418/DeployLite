import express from "express";

import { reactHost } from "../applogics/host/reacthost.js";
import { Checkip } from "../applogics/enquiry/Checkip.js";
import { FullStackHost } from "../applogics/host/FullStackHost.js";
import { Delete } from "../applogics/delete/Delete.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.send("i am in deploy route");
});

router.post('/react',reactHost);
router.post('/fullstack',FullStackHost);
router.post('/checkip',Checkip);
router.post('/delete',Delete);

export default { router };
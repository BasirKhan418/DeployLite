import express from "express";

import { reactHost } from "../applogics/host/reacthost.js";
import { angularHost } from "../applogics/host/angularhost.js";
import { frontendHost } from "../applogics/host/frontendhost.js";
import { Checkip } from "../applogics/enquiry/Checkip.js";
import { FullStackHost } from "../applogics/host/FullStackHost.js";
import { Delete } from "../applogics/delete/Delete.js";
import { WebBuilder } from "../applogics/host/webbuilder.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.send("i am in deploy route");
});

router.post('/react',reactHost);
router.post('/angular',angularHost);
router.post('/frontend',frontendHost);
router.post('/webbuilder',WebBuilder);
router.post('/fullstack',FullStackHost);
router.post('/checkip',Checkip);
router.post('/delete',Delete);

export default { router };
import express from "express";
import CreateDeployment from "../applogics/createDeployment/CreateDeployment.js";
import CreateWebbuilder from "../applogics/createDeployment/CreateWebbuilder.js";
import CreateVirtualSpace from "../applogics/createDeployment/CreateVirtualSpace.js";
const router = express.Router();
router.post('/',CreateDeployment);
router.post('/webbuilder',CreateWebbuilder);
router.post('/virtualspace',CreateWebbuilder);
export default { router };
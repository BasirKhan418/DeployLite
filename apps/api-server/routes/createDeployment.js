import express from "express";
import CreateDeployment from "../applogics/createDeployment/CreateDeployment.js";
import CreateWebbuilder from "../applogics/createDeployment/CreateWebbuilder.js";
const router = express.Router();
router.post('/',CreateDeployment);
router.post('/webbuilder',CreateWebbuilder);
export default { router };
import express from "express";
import CreateDeployment from "../applogics/createDeployment/CreateDeployment.js";
import CreateWebbuilder from "../applogics/createDeployment/CreateWebbuilder.js";
import CreateVirtualSpace from "../applogics/createDeployment/CreateVirtualSpace.js";
import CreateDatabase from "../applogics/createDeployment/CreateDatabase.js";
import Createchatbot from "../applogics/createDeployment/Createchatbot.js";
const router = express.Router();

router.post('/', CreateDeployment);
router.post('/webbuilder', CreateWebbuilder);
router.post('/virtualspace', CreateVirtualSpace);
router.post('/database', CreateDatabase);
router.post('/chatbot', Createchatbot);

export default { router };
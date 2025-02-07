import express from "express";
import CreateDeployment from "../applogics/createDeployment/CreateDeployment.js";
const router = express.Router();
router.post('/',CreateDeployment);
export default { router };
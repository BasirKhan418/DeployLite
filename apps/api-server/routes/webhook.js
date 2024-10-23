import express from 'express';
import getWebhook from '../applogics/webhooks/getWebhook.js';
import createWebhook from '../applogics/webhooks/createWebhook.js';
import deleteWebhook from '../applogics/webhooks/deleteWebhook.js';
import createDeploymentMiddleware from '../applogics/middleware/Checkauth.js';
const router = express.Router();
//handle all webhookcommits from github
//handle all webhookcommits from github
router.post('/',getWebhook);
//create webhooks from github
router.post('/create',createDeploymentMiddleware,createWebhook);
//delete webhooks from github
router.delete('/delete',createDeploymentMiddleware,deleteWebhook);
export default {router};
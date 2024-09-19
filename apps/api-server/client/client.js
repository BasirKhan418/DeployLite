import { ECSClient } from '@aws-sdk/client-ecs';
const client = new ECSClient({
    region:process.env.region,
    credentials:{
        accessKeyId:process.env.accesskeyid,
        secretAccessKey:process.env.accesskeysecret
    }
})
export default client;
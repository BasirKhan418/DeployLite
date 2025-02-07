const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const {S3Client,PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types');
const Redis = require('ioredis');
const redisConfig = {
    username: 'default',
    password: 'FxvuXWrG8SprckQkqEZXU4I7fUnW6VKH',
    host: 'redis-19432.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 19432,
    retryStrategy: function(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3
};
const publisher = new Redis(redisConfig);
const {region,accesskeyid,accesskeysecret,projectid,bucket} = process.env;
//setting the aws client
 const s3client = new S3Client({
    region:region,
    credentials:{
        accessKeyId:accesskeyid,
        secretAccessKey:accesskeysecret
    }
 })
 //redis publisher 
 const publishLog = (log)=>{
    publisher.publish(`logs:${projectid}`,JSON.stringify({log}));
    console.log(log);
 }
 //meat of the logic
 const init = async()=>{
console.log("Starting the build server");
publishLog("Build Started...");
const outDirPath = path.join(__dirname,'output');
console.log(outDirPath);
 const p = exec(`cd ${outDirPath} && npm install && npm run build`);
p.stdout.on('data',(data)=>{
    publishLog(data.toString());
})
p.stdout.on('error',(data)=>{
    publishLog(`exError: ${data.toString()}`);
})
p.on('close',async()=>{
publishLog("Build Completed...");
const distFolderPATH = path.join(outDirPath,'dist');
//get the contents of the dist folder
const distFolderContents = fs.readdirSync(distFolderPATH,{recursive:true});
publishLog("Uploading files to S3...");

//upload the files to s3
for(const file of distFolderContents){
    const filePath = path.join(distFolderPATH,file);
    if(fs.lstatSync(filePath).isDirectory()){
        continue;
    }
    publishLog(`Uploading ${file}...`);
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key:`__outputs/${projectid}/${file}`,
        Body:fs.createReadStream(filePath),
        ContentType:mime.lookup(filePath)
    })
    await s3client.send(command);
    publishLog(`Uploaded ${file}`);

}
publishLog("Upload Completed...");
publishLog("Done ...")
publishLog("Success");
publishLog(`Website is up and running at https://${projectid}.cloud.deploylite.tech`)
process.exit(0)

})

 }
 
 init();

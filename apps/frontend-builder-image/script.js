const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const {S3Client,PutObjectCommand} = require('@aws-sdk/client-s3')
const mime = require('mime-types');
// const Redis = require('ioredis');
// const publisher = new Redis();
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
    // publisher.publish(`logs:${projectid}`,JSON.stringify({log}));
    console.log(log);
 }
 //meat of the logic
 const init = async()=>{
console.log("Starting the build server");
publishLog("Build Started...");
const outDirPath = path.join(__dirname,'output');
console.log(outDirPath);
publishLog("Build Completed...");
//get the contents of the dist folder
const distFolderContents = fs.readdirSync(outDirPath,{recursive:true});
publishLog("Uploading files to S3...");

//upload the files to s3
for(const file of distFolderContents){
    const filePath = path.join(outDirPath,file);
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
process.exit(0)

 }
 
 init();

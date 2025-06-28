const express = require('express');
const httpProxy = require('http-proxy');
const app = express();
const port = 8000;
//ADD ENV
const BASE_URL= "https://s3.ap-south-1.amazonaws.com/deploylite.tech.prod/__outputs"
const proxy = httpProxy.createProxy();
app.use((req,res)=>{
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const resolvesto = `${BASE_URL}/${subdomain}`;
    console.log(hostname,subdomain,resolvesto);
    return proxy.web(req,res,{target:resolvesto,changeOrigin:true});
})
proxy.on('proxyReq',(proxyReq,req,res)=>{
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'
})
proxy.on('error',(err,req,res)=>{
    res.status(500).send('Something went wrong');
})
app.listen(port,()=>{
    console.log(`Reverse Proxy Server running on port ${port}`);
})

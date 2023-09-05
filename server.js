const express = require('express');
const app = express();
const port = 3000;

const podIP = process.env.POD_IP || 'IP not available';

app.all('*',(req,res)=>{
    const html = `
    
    <h1 style="margin:10px;text-align:center"> Hello , This site is hosted in K8 <br> Pod IP: ${podIP} </h1>  
    
    `;
    res.send(html);
})

app.listen(port,()=>{
    console.log(`http://localhost:${port} server is running`);
})
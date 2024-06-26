const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();

const port = 3000;

const podIP = process.env.POD_IP || 'IP not available';

app.get('/',async (req,res)=>{
    let html =  await ejs.renderFile(path.join(__dirname,'./views/resume.html'),{podIP});
    res.send(html);
})

app.use('/',express.static('public'));

app.listen(port,()=>{
    console.log(`http://localhost:${port} server is running`);
})
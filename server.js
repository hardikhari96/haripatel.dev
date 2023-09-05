const express = require('express');
const app = express();
const port = 3000;

const podIP = process.env.POD_IP || 'IP not available';

app.all('*',(req,res)=>{
    const html = `
    
    <!DOCTYPE html>
<html>
<head>
  <title>Your Site Hosted in Kubernetes</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin: 20px;
    }
    h1 {
      margin: 10px;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      margin: 10px;
      font-size: 18px;
    }
  </style>
</head>
<body>

  <h1>Hello, This site is hosted in K8</h1>
  <p>Pod IP: ${podIP}</p> <!-- Replace ${podIP} with the actual Pod IP using your server-side code -->

  <div class="social-links">
    <a class="social-link" href="https://github.com/hardikhari96" target="_blank">GitHub</a><br>
    <a class="social-link" href="https://www.linkedin.com/in/hardikhari96/" target="_blank">LinkedIn</a><br>
    <a class="social-link" href="https://stackoverflow.com/users/8823231/harikrushna-patel" target="_blank">Stack Overflow</a>
  </div>

</body>
</html>
 
    
    `;
    res.send(html);
})

app.listen(port,()=>{
    console.log(`http://localhost:${port} server is running`);
})
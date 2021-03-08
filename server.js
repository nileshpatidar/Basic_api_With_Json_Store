const express = require('express'); 
const app = express(); 
const { getUserData, saveUserData } = require("./commonFumction/common");
const Authchecker = require("./commonFumction/middelware");
  

app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>Hello Dear User I am Hear!</h1>');
    // Sending the response 
res.end();
})
  

// Establishing the port  
const PORT = process.env.PORT ||5000; 
  
// Executing the sever on given port number 
app.listen(PORT, console.log( 
  `Server started on port ${PORT}`)); 

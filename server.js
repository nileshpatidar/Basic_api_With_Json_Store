const express = require('express'); 
const app = express(); 
const { getUserData, saveUserData } = require("./commonFumction/common");
const Authchecker = require("./commonFumction/middelware");
 
let jwt = require('jsonwebtoken');
var md5 = require('md5')
var multer = require('multer')
var mkdirp = require('mkdirp');
mkdirp('uploads/profile/');
let SECRET_KEY = "nileshsecretkey1234567890"
 




var localstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        return cb('jpeg,jpg ,png file are allowed', false)
    }
}


var local_upload = multer({
    storage: localstorage,
    fileFilter: fileFilter,
}).single('profile_image')


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

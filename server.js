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
}).single('profile_image');


app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>Hello Dear User I am Hear!</h1>');
    // Sending the response 
res.end();
})
  
/* Create - register POST method */
app.post('/register', async (req, res) => {
    //get the new from post request

    var userData;
    await local_upload(req, res, async function (err) {
        userData = JSON.parse(req.body.data);
        if (err) {
            return res.end(err, "Something went wrong!");
        }
        //get the existing user data from json
        const existUsers = await getUserData();

        userData.profile_image = req.file ? req.file.path : '';
        // fname / lname / email / mobile / password / profile photo / address / city / state / country)
        if (userData.fname == null || userData.lname == null || userData.email == null || userData.country == null ||
            userData.state == null || userData.city == null || userData.address == null || userData.mobile == null || userData.password == null) {
            return res.status(401).send({ error: true, msg: 'User data missing' })
        }

        userData.password = md5(userData.password);
        console.log(existUsers);

        //check  exist already
        const findExist = existUsers.find(user => user.email === userData.email)
        if (findExist) {
            return res.status(409).send({ error: true, msg: 'user already exist' })
        }

        //append the user data
        existUsers.push(userData)

        //save the new user data
        saveUserData(existUsers);
        res.send({ success: true, msg: 'User  added successfully' })

    });

})



// Establishing the port  
const PORT = process.env.PORT ||5000; 
  
// Executing the sever on given port number 
app.listen(PORT, console.log( 
  `Server started on port ${PORT}`)); 

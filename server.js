// const http = require('http');

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>Hello World</h1>');
// });

const express = require('express')
let jwt = require('jsonwebtoken');
let SECRET_KEY = "nileshsecretkey1234567890"
const { getUserData, saveUserData } = require("./commonFumction/common");
const Authchecker = require("./commonFumction/middelware");

var md5 = require('md5')
var multer = require('multer')
var mkdirp = require('mkdirp');
mkdirp('uploads/profile/');

const app = express()
app.use(express.json())


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

        userData.profile_image = req.file.path;
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

 app.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello Dear User I am Hear!</h1>');
    // Sending the response 
})
/* Create -login POST method */
app.post('/login', async (req, res) => {
    //get the existing user data from json
    const existUsers = await getUserData()
    //get the new from post request
    const userData = req.body
    // fname / lname / email / mobile / password / profile photo / address / city / state / country)
    if (userData.email == null || userData.password == null) {
        return res.status(401).send({ error: true, msg: 'Email and Password Required' })
    }

    //check not exist  
    const findExist = existUsers.find(user => user.email === userData.email)
    if (!findExist) {
        return res.status(404).send({ error: true, msg: 'User Not Exist' })
    }
    if (findExist.password != md5(userData.password)) {
        return res.status(403).send({ error: true, msg: 'Email or Password is not Match' })
    }
    delete findExist.password;
    var date = new Date();
    var timestamp = date.getTime();
    let secret_key = jwt.sign({ auth: userData.email + timestamp }, SECRET_KEY, { expiresIn: '1h' });
    findExist.token = secret_key;

    res.send({ success: true, data: findExist, msg: 'User  added successfully' })

})


/* Read - GET method */
app.get('/user/list', Authchecker, async (req, res) => {
    const users = await getUserData()
    res.send(users)
})

/* Update - Patch method */
app.patch('/user/edit/:email', Authchecker, async (req, res) => {
    //get the username from url
    const email = req.params.email

    //get the update data
    const userData = req.body

    //get the existing user data
    const existUsers = await getUserData()

    //check if the username exist or not       
    const findExist = existUsers.find(user => user.email === email)
    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'user not exist' })
    }

    //filter the userdata
    const updateUser = existUsers.filter(user => user.email !== email)


    for (const [key, value] of Object.entries(findExist)) {
        findExist[key] = userData[key] ? userData[key] : value;
    }
    //push the updated data
    updateUser.push(findExist)

    //finally save it
    saveUserData(updateUser)

    res.send({ success: true, msg: 'User data updated successfully' })
})

//configure the server port
app.listen(3000, () => {
    console.log('Server runs on port 3000')
})

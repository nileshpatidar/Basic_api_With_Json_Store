const fs = require('fs')

//read the user data from json file
const saveUserData = async (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('users.json', stringifyData)
}

//get the user data from json file
const getUserData = async () => {
    const jsonData = fs.readFileSync('users.json');
    return JSON.parse(jsonData)
}



module.exports = { saveUserData, getUserData };

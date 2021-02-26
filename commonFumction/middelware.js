let jwt = require('jsonwebtoken');
let SECRET_KEY = "nileshsecretkey1234567890"
require('dotenv').config()
// //Check User Authentication
const Authchecker = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Token is not valid' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({ success: false, message: 'Auth token is not supplied' });
    }
}
module.exports = Authchecker;
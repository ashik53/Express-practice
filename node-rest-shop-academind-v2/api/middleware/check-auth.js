/*
    For details about route protection - https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=13
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)
        const decoded =jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
    
}

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    /*
        verfify methoded decoded the token & verify
    */
   
    try {
       
        //pass the token in Headers section of postman, otherwise 'Authentication will be failed'
       const token = req.headers.authorization 
       console.log(token)
       console.log("secret", process.env.JWT_KEY)
       const decoded = jwt.verify(token, process.env.JWT_KEY);
       req.userData = decoded ;
       next(); //when token verfication successful, move to next or block before
   } catch(error) {
       console.log(error)
       return res.status(401).json({
           message: 'Auth failed',
           
       })
   }
    
    
}
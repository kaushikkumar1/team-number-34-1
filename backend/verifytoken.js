const jwt= require('jsonwebtoken');

// MIDDLEWERE FUNCTION TO CHECK THE TOKEN
module.exports=function(req,res,next){
    const token =req.query.token;
    if(!token) return res.status(401).send("Access Denied")
    try{
      const verified =jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    }catch(error){
      return res.status(400).send('Invlid Token');
    }
}
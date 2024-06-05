const jwt=require('jsonwebtoken')

const JWT_SCRET='harshwebsite'    //this must be kept screat
const fetchuser=(req,res,next)=>{
    //get the user from jwt token and add id to req object
    const token =req.header('auth-token');
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try {
    const decode=jwt.verify(token,JWT_SCRET)
    console.log(decode)
    req.user=decode.user;
    next()
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})

    }
}

module.exports=fetchuser
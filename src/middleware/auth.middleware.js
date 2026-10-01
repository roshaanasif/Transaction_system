const userModel=require('.././models/user.model')
const config=require(".././config/config")
const jwt=require('jsonwebtoken')




const authMiddleware=async(req,res,next)=>{

    const token =req.cookies.Jwt_Token || req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"unAthourized Access,Token Is Missing"
        })
    }

    try{

    const decoded =jwt.verify(token,config.JWT_SECRET)
    const user = await userModel.findById(decoded.userId)

    req.user=user

    next()


    }catch(err){
        return res.status(401).json({
            message:"unAthourized Access,Invalid Token "
        })
    }


}

module.exports={
    authMiddleware
}
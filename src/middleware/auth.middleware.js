const userModel=require('.././models/user.model')
const tokenModel=require("../models/tokenBlacklisting.model")
const config=require(".././config/config")
const jwt=require('jsonwebtoken')




const authMiddleware=async(req,res,next)=>{

    const token =req.cookies.Jwt_Token || req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"unAthourized Access,Token Is Missing"
        })
    }

    const isBlacklisted=await tokenModel.findOne({token})

    if(isBlacklisted){
         return res.status(401).json({
            message:"unAthourized Access,Token Is Inavalid"
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

const systemAuthMiddleware=async(req,res,next)=>{
      const token =req.cookies.Jwt_Token || req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(403).json({
            message:"Forbidden Access"
        })
    }

    const isBlacklisted=await tokenModel.findOne({token})

    if(isBlacklisted){
         return res.status(401).json({
            message:"unAthourized Access,Token Is Inavalid"
        })
    }

    try{

    const decoded =jwt.verify(token,config.JWT_SECRET)
    const user = await userModel.findById(decoded.userId).select("+systemUser")


    if(!user.systemUser){
           return res.status(401).json({
            message:"Unauthourized Access,system user required"
        })
    }

    req.user=user

    next()

}catch(err){

        return res.status(401).json({
            message:"Unauthourized Access,token is invalid"
        })

}

}

module.exports={
    authMiddleware,
    systemAuthMiddleware
}
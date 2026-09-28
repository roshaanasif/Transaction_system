const userModel=require("../models/user.model")
const config=require(".././config/config")
const jwt =require('jsonwebtoken')

exports.userRegisterController= async(req,res)=>{

    const {name,email,password} =req.body;

    const IsAlreadyRegistered=await userModel.findOne({email})
    
    if(IsAlreadyRegistered){
        return res.status(422).json({
            message:"user Already Exists With Email",
            status:"failed"
        })
    }

    const user =await userModel.create({
        name,email,password
    })

    const token = jwt.sign(
        {userId:user._id},
        config.JWT_SECRET,
        {expiresIn:"3d"}
    )


    res.cookie("Jwt_Token",token)


    res.status(201).json({
        message:"user created succesfully",
        user:{
            id:user._id,
            username:user.name,
            email:user.email,
        },
        token
    })
}
exports.userLoginController= async(req,res)=>{

    const {email,password} =req.body;

    const user=await userModel.findOne({email}).select("+password");
    
    if(!user){
        return res.status(401).json({
            message:"Email or password is not valid",
            status:"failed"
        })
    }

    console.log("Request password:", password);
console.log("User password hash:", user.password);

    const isValid=await user.comparePasswords(password)

      if(!isValid){
        return res.status(401).json({
            message:"Email or password is not valid",
            status:"failed"
        })
    }

    const token = jwt.sign(
        {userId:user._id},
        config.JWT_SECRET,
        {expiresIn:"3d"}
    )


    res.cookie("Jwt_Token",token)


    res.status(200).json({
        message:"user login succesfully",
        user:{
            id:user._id,
            username:user.name,
            email:user.email,
        },
        token
    })
}
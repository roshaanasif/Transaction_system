const userModel=require("../models/user.model")
const config=require(".././config/config")
const jwt =require('jsonwebtoken')
const sendRegistrationEmail=require("../services/email.service")

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


await sendRegistrationEmail(
    user.email,
     "Welcome ! Your Registration Was Successful",
    `
        Dear ${user.name},

        Thank you for registering with us. Your account has been
        successfully created.

        We are delighted to have you as a member of our community.

        If you have any questions or need assistance, please don't
        hesitate to contact our support team.

        Best regards,
        The Support Team
    `,
     `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;">
        <h2 style="color: #2563eb;">Welcome, ${user.name}!</h2>

        <p>Dear ${user.name},</p>

        <p>
            Thank you for registering with us. We are pleased to inform
            you that your account has been successfully created.
        </p>

        <p>
            We are delighted to have you as a member of our community
            and look forward to providing you with an excellent experience.
        </p>

        <p>
            If you have any questions or require assistance, please
            don't hesitate to contact our support team.
        </p>

        <p style="margin-top: 30px;">
            Best regards,<br />
            <strong>The Developers Team</strong>
        </p>
        </div>
    `,
    );

 
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
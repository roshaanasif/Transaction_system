const accountModel=require('../models/accounts.model')



exports.createAccountController=async(req,res)=>{

    const user=req.user

    const account=await accountModel.create({userId:user._id})


   res.status(201).json({
    message:"Account Created Successfully",
    account
   })

}
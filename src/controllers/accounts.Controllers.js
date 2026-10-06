const accountModel=require('../models/accounts.model')



exports.createAccountController=async(req,res)=>{

    const user=req.user

    const account=await accountModel.create({userId:user._id})


   res.status(201).json({
    message:"Account Created Successfully",
    account
   })

}


exports.getAccountController=async(req,res)=>{

    const user=req.user

    const account=await accountModel.find({userId:user._id})


   res.status(201).json({
    message:"Account fetched Successfully",
    account,
   })

}

exports.getAccountBalanceController=async(req,res)=>{

    const {accountId}=req.params
    const user=req.user

    const account=await accountModel.findOne({
        _id:accountId,
        userId:user._id
    })

    if(!account){
        return res.status(404).json({
        message:"Account not found for the user ",
    })
    }

    const balance=await account.getBalance()

    res.status(200).json({
        account:account._id,
        balance
    })

}

const transactionModel=require("../models/transaction.model")
const accountModel=require("../models/accounts.model")
const ledgerModel=require("../models/ledger.model")
const mongoose =require('mongoose')


exports.initalFundsTransfer=async(req,res)=>{

    const{toAccount,amount,idempotencyKey}=req.body

    if(!toAccount||!amount||!idempotencyKey){

        return res.status(400).json({
            message:"fromAccount,toAccount,amount And idempotencyKey Is required For Making Transaction"
        })
    }

    const toUserAccount=await accountModel.findOne({userId:toAccount})

    
    if(!toUserAccount){
        return res.status(400).json({
            message:"toAccount should be valid For Making Transaction"
        })
    }


    const fromSystemAccount=await accountModel.findOne({userId:req.user._id})


     if(!fromSystemAccount){
        return res.status(400).json({
            message:"System user Account not found"
        })
    }

    
const session=await mongoose.startSession()

    session.startTransaction()


    const transaction=new transactionModel({
        fromAccount:fromSystemAccount._id,
        toAccount:toUserAccount._id,
        idempotencyKey,
        amount,
        status:"PENDING"
    })

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromSystemAccount._id,
        transaction:transaction._id,
        amount,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toUserAccount._id,
        transaction:transaction._id,
        amount,
        type:"CREDIT"
    }],{session})



  transaction.status="COMPLETED"

   await transaction.save({session})


   await session.commitTransaction()
   session.endSession()

    

   return res.status(201).json({
    message:"Initial funds transation completed successfully",
    transaction
   })




}
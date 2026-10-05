
const transactionModel=require("../models/transaction.model")
const accountModel=require("../models/accounts.model")
const ledgerModel=require("../models/ledger.model")
const emailService=require('../services/email.service')
const mongoose =require('mongoose')


exports.createTransaction = async(req,res)=>{

    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount||!toAccount||!amount||!idempotencyKey){

        return res.status(400).json({
            message:"fromAccount,toAccount,amount And idempotencyKey Is required For Making Transaction"
        })
    }

    const fromUserAccount=await accountModel.findOne({userId:fromAccount})

    const toUserAccount=await accountModel.findOne({userId:toAccount})



    if(!fromUserAccount||!toUserAccount){
        return res.status(400).json({
            message:"fromAccount,toAccount should be valid For Making Transaction"
        })
    }

    if (fromUserAccount.status !== "ACTIVE" ||toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "fromAccount and toAccount should be active for making a transaction"
        });
    }

    const isTransactionAlreadyExists=await transactionModel.findOne({idempotencyKey:idempotencyKey})



    if(isTransactionAlreadyExists){

        if(isTransactionAlreadyExists.status="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status="PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists.status="FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed,TRY AGAIN",
            })
        }
        if(isTransactionAlreadyExists.status="REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed ,TRY AGAIN",
            })
        }
    }


   const balance = await fromUserAccount.getBalance();

    if (balance<amount){
        return res.status(400).json({
            message:`Insufficient Balance , current Balance Is ${balance},Requested amount to send is ${amount}`
        })
    }


    const session=await mongoose.startSession()

    session.startTransaction()


    const transaction=new transactionModel({
        fromAccount,
        toAccount,
        idempotencyKey,
        amount,
        status:"PENDING"
    })

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromAccount,
        transaction:transaction._id,
        amount,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        transaction:transaction._id,
        amount,
        type:"CREDIT"
    }],{session})



  transaction.status="COMPLETED"

   await transaction.save({session})


   await session.commitTransaction()
   session.endSession()

    

   await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

   return res.status(201).json({
    message:"transation completed successfully",
    transaction
   })

}
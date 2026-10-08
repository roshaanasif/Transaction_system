
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

        if(isTransactionAlreadyExists.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists.status==="FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed,TRY AGAIN",
            })
        }
        if(isTransactionAlreadyExists.status==="REVERSED"){
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


    const transaction=await transactionModel.create([{
        fromAccount:fromUserAccount._id,
        toAccount:toUserAccount._id,
        idempotencyKey,
        amount,
        status:"PENDING"
    }],{session})

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromUserAccount._id,
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


    await transaction.findOneAndUpdate({_id:transaction._id},{status:"COMPLETED"},{session})


   await session.commitTransaction()
   session.endSession()

    

//    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

   return res.status(201).json({
    message:"transation completed successfully",
    transaction
   })

}




exports.getTransactionHistory=async(req,res)=>{

    const {accountId}=req.params
    const {from,to}=req.query

    const user=req.user

    const account=await accountModel.findOne({
         _id:accountId,
        userId:user._id
    })
    
    if(!account){
        return res.status(400).json({
            message:"Account not found for the user "
        })
    }
    
    let query={
        $or: [
        { fromAccount: accountId },
        { toAccount: accountId }
       ],
        status: "COMPLETED",
    }


    if(from || to){
        if(from && to){

            if (new Date(from) > new Date(to)) {
                return res.status(400).json({
                    message: "From date cannot be greater than to date"
                });
            }
            
            query.createdAt = {
                $gte: new Date(from)
            };

             const endDate = new Date(to);
            endDate.setDate(endDate.getDate()+1)
    
            // if using lte
            // endDate.setHours(23, 59, 59, 999);
    
    
           query.createdAt={
            ...query.createdAt,
            $lt:endDate
           }
    
        }else{
        return res.status(400).json({
            message:"Date RANGE is in complete"
        })
        }
    }else{

           const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        query.createdAt = {
            $gte: startOfMonth,
            $lt: startOfNextMonth
        };
    }


    const transactions=await transactionModel.find(query)

    return res.status(200).json({
            message:"transactions fetched successfully",
            transactions:transactions
        })

    
}

const transactionModel=require("../models/transaction.model")
const accountModel=require("../models/accounts.model")



exports.createTransaction = async(req,res)=>{

    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount||!toAccount||!amount||!idempotencyKey){

        return res.status(400).json({
            message:"fromAccount,toAccount,amount And idempotencyKey Is required For Making Transaction"
        })
    }

    const IsFromAccountExists=await accountModel.findOne({_id:fromAccount})

    const IsToAccountExists=await accountModel.findOne({_id:toAccount})



    if(!IsFromAccountExists||!IsToAccountExists){
        return res.status(400).json({
            message:"fromAccount,toAccount should be valid For Making Transaction"
        })
    }

    if (IsFromAccountExists.status !== "ACTIVE" ||IsToAccountExists.status !== "ACTIVE") {
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

    


    









}
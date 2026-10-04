const mongoose =require("mongoose")



const transactionSchema=new mongoose.Schema({

    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction should be Asscoiated From Any Account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction should be Asscoiated to Any Account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            required:[true,"Status can be either pending ,completed, failed or reversed"],
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        min:[0,"Amount Should Be In positive Values"],
        required:[true,"Amount Is Required For Transaction"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotancy key is required for transaction"],
        index:true,
        unique:true

    }
},{
    timestamps:true
})

const transactionModel=mongoose.model("transaction",transactionSchema)



module.exports=transactionModel
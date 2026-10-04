const mongoose =require("mongoose")



const ledgerSchema=new mongoose.Schema({

    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"ledger should be Asscoiated with Account"],
        index:true,
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"ledger should be Asscoiated with Transaction"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount Is Required For creating a ledger"],
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either DEBIT or CREDIT",
        },
        required:[true," ledger type Is Required "],
        immutable:true
    }
},{
    timestamps:true
})


function preventLedgerUpdate(){
    throw new error("Ledger entries cannot be modified or deleted")
}


ledgerSchema.pre("findOneAndUpdate", preventLedgerUpdate);
ledgerSchema.pre("findOneAndDelete", preventLedgerUpdate);
ledgerSchema.pre("findOneAndRemove", preventLedgerUpdate);
ledgerSchema.pre("findOneAndReplace", preventLedgerUpdate);
ledgerSchema.pre("updateOne", preventLedgerUpdate);
ledgerSchema.pre("deleteOne", preventLedgerUpdate);
ledgerSchema.pre("updateMany", preventLedgerUpdate);
ledgerSchema.pre("deleteMany", preventLedgerUpdate);
ledgerSchema.pre("remove", preventLedgerUpdate);



const ledgerModel=mongoose.model("ledger",ledgerSchema)



module.exports=ledgerModel
const mongoose=require('mongoose')
const ledgerModel=require('../models/ledger.model')


const userAccount=new mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user",
      required:[true,"User is required for creating account"],
      index:true,
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FREEZE","CLOSED"],
            required:[true,"Account Status Is Either Active Freeze Or Closed "],
        },
        default:"ACTIVE"
    },
    currency:{
      type:String,
      required:[true,"Currency is Required For Creating User"],
      default:'PKR'
    }
},{
    timestamps:true
})


userAccount.index({status:1,user:1})


userAccount.methods.getBalance=async function(){

    const balanceData=await ledgerModel.aggregate([
      {$match:{account:this._id}}  ,

       {
        $group:{
            _id:null,
            totalDebit:{
                $sum:{
                    $cond:[
                    { $eq:["$type","DEBIT"]},
                    "$amount",
                    0
                    ]
                }
            },

            totalCredit:{
                $sum:{
                    $cond:[
                        {
                            $eq:["$type","CREDIT"]
                        },
                        "$amount",
                        0
                    ]
                }
            }
            }
        },

        {$project:{
            _id:0,
            balance:{$subtract:["$totalDebit","$totalCredit"]}
        }}
    ])

    if(balanceData.length===0){
        return 0
    }

    return balanceData[0].balance
}

const accountModel=mongoose.model("account",userAccount)


module.exports=accountModel;


const mongoose=require('mongoose')



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


const accountModel=mongoose.model("account",userAccount)


module.exports=accountModel;


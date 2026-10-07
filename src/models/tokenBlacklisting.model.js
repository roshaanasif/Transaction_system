const mongoose =require("mongoose")


const tokenblacklistingSchema=new mongoose.Schema({
    token:{
        type:String,
        unique:true,
        required:true,
        immutable:true
    }
},{
    timestamps:true
})

tokenblacklistingSchema.index({createdAt:1},{expireAfterSeconds:60*60*24*3})

const tokenModel=mongoose.model("tokenblacklisting",tokenblacklistingSchema)


module.exports=tokenModel
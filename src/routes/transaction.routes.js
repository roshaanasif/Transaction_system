const express =require('express')

const router=express.Router()
const transactionControllers=require("../controllers/transaction.Controllers.js")


router.post("/",transactionControllers.createTransaction)





module.exports=router
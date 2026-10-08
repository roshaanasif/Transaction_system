const express =require('express')

const router=express.Router()
const transactionControllers=require("../controllers/transaction.Controllers.js")
const middleware =require('../middleware/auth.middleware')

router.post("/",middleware.authMiddleware,transactionControllers.createTransaction)

router.get("/history/:accountId",middleware.authMiddleware,transactionControllers.getTransactionHistory)





module.exports=router
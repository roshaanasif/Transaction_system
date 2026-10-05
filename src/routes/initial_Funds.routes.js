const express =require('express')

const router=express.Router()
const initalSystemTransferControllers=require("../controllers/initalTransfer.Controllers")
const middleware =require('../middleware/auth.middleware')


router.post("/initial-funds",middleware.systemAuthMiddleware,initalSystemTransferControllers.initalFundsTransfer)



module.exports=router
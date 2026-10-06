const express =require('express')

const router=express.Router()
const accountsControllers=require("../controllers/accounts.Controllers")
const middleware =require('../middleware/auth.middleware')


router.post("/",middleware.authMiddleware,accountsControllers.createAccountController)

router.get("/",middleware.authMiddleware,accountsControllers.getAccountController)

router.get("/balance/:accountId",middleware.authMiddleware,accountsControllers.getAccountBalanceController)



module.exports=router
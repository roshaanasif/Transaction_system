const express =require('express')

const router=express.Router()
const accountsControllers=require("../controllers/accounts.Controllers")
const middleware =require('../middleware/auth.middleware')


router.post("/",middleware.authMiddleware,accountsControllers.createAccountController)




module.exports=router
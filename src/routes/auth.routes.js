const express =require('express')

const router=express.Router()
const authControllers=require("../controllers/auth.Controllers")


router.post("/register",authControllers.userRegisterController)

router.post("/login",authControllers.userLoginController)



module.exports=router
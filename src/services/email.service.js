const nodemailer=require('nodemailer');

const config=require('.././config/config')

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
      type: "OAuth2",
      user: config.GOOGLE_USER,
      clientId:config.GOOGLE_CLIENT_ID,
      clientSecret:config.GOOGLE_CLIENT_SECRET,
      refreshToken:config.GOOGLE_REFRESH_TOKEN
    }
})


transporter.verify((error,success)=>{
    if(error){
        console.log("Error in connecting Email server:",error)
    }else{
        console.log("Email server is ready for sending emails")
    }

})


const sendEmail=async(to,subject,text,html)=>{

 
    try{
        const info=await transporter.sendMail({
            from:`transaction_system <${config.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html
        })

        console.log("message sent:",info.messageId)
        console.log("preview url:",nodemailer.getTestMessageUrl(info))
    }catch(err){
        console.log("error in sending email",err)
    }
}

module.exports=sendEmail
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

const sendRegistrationEmail = async (email, name) => {
     const subject = "Welcome! Your Registration Was Successful"; 
     const text = ` Dear ${name}, Thank you for registering with us. Your account has been successfully created. We are delighted to have you as a member of our community. If you have any questions or need assistance, please don't hesitate to contact our support team. Best regards, The Support Team `; 
     const html = ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333;"> <h2 style="color: #2563eb;"> Welcome, ${name}! </h2> <p> Dear ${name}, </p> <p> Thank you for registering with us. We are pleased to inform you that your account has been successfully created. </p> <p> We are delighted to have you as a member of our community and look forward to providing you with an excellent experience. </p> <p> If you have any questions or require assistance, please don't hesitate to contact our support team. </p> <p style="margin-top: 30px;"> Best regards,<br /> <strong>The Developers Team</strong> </p> </div> `; 
     
     return await sendEmail( email, subject, text, html ); 
};

const sendTransactionEmail = async ( toAccount, amount, name, userEmail ) => { 
    const subject = "Transaction Successful"; 
    const text = ` Dear ${name}, Your transaction has been successfully completed. Transaction Details:   The Amount: ${amount} has been successfully transferred to Account: ${toAccount}. If you did not authorize this transaction or have any questions, please contact our support team immediately. Best regards, The Developers Team `; 
    const html = ` <div style=" font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #333; "> <h2 style="color: #16a34a;"> Transaction Successful </h2> <p> Dear ${name}, </p> <p> Your transaction has been successfully completed. </p> <div style=" background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; "> <h3> Transaction Details </h3> <p> <strong>To Account:</strong> ${toAccount} </p> <p> <strong>Amount:</strong> ${amount} </p> </div> <p> The amount has been successfully transferred to the above account. </p> <p> If you did not authorize this transaction or have any questions, please contact our support team immediately. </p> <p style="margin-top: 30px;"> Best regards,<br /> <strong>The Developers Team</strong> </p> </div> `;
    
    return await sendEmail( userEmail, subject, text, html ); 
};

module.exports={
    sendRegistrationEmail,
    sendTransactionEmail
}
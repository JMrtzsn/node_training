const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to: email,
        from: "task-manager@taskmana.com",
        subject: "Thanks for signing up",
        text : `Welcome to the app, ${name}, Let me know how u like the app`
    })
}

const sendGoodbyeEmail = (email,name) =>{
    sgMail.send({
        to: email,
        from: "task-manager@taskmana.com",
        subject: "Good to see you go",
        text : `Thanks for leaving ${name}, we'r better without you`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}
const nodemMailer = require('../config/nodemailer');

exports.newUser = (user) => {
    // console.log('inside newuser mailer');
    let htmlString = nodemMailer.renderTemplate({user: user}, '/users/SignupSuccess.ejs');

    nodemMailer.transporter.sendMail({
        from: 'new@codeial.com',
        to: user.email,
        subject: 'Welcome to Codeial!',
        html: htmlString
    },(err, info) => {
        if(err){
            console.log('Error in sending Email', err);
            return;
        } 

        console.log('Message Sent', info);
        return;
    })
}
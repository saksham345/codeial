const nodemMailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    // console.log('inside comment mailer');
    let htmlString = nodemMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodemMailer.transporter.sendMail({
        from: 'new@codeial.com',
        to: comment.user.email,
        subject: 'New Comment Published!',
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
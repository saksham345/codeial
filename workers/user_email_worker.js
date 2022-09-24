const queue = require('../config/kue');
const usersMailer = require('../mailers/users_mailer');

queue.process('signup-success', function(job, done){
    console.log('emails worker is processing a job', job.data);

    usersMailer.newUser(job.data);

    done();
});

queue.process('user-password', function(job, done)
{
    console.log('User email worker is processing a job (Reset Password)');
    usersMailer.resetPassword(job.data);
    done();
});
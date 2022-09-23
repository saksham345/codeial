const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const queue = require('../config/kue');
const usersMailer = require('../mailers/users_mailer');
const userEmailWorker = require('../workers/user_email_worker');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile.ejs',{
            title: "Profile",
            profile_user: user
        });

    });
}

module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){
   try{
    let user = await User.findById(req.params.id);
    User.uploadedAvatar(req, res, function(err){
        if(err) {console.log('Multer error', err);}

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){

            if(user.avatar){
                fs.unlinkSync(path.join(__dirname, '..', user.avatar));
            }

            //saving path of uploaded file into avatar field in User
            user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
    });

   }
   catch(err){
       req.flash('error', err);
       return res.redirect('back');
   }
}
    else{
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
    title: "Ceodial || Sign Up"
    })
}

module.exports.signIn = function(req, res){
    
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title: "Codeial || User Sign In"
    })
}

//get sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Confirm password not matching');
        return res.redirect('/users/sign-up');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err) {req.flash('error', err); return}
        
        if(!user){
            User.create(req.body, function(err, user){
                if(err) { console.log('error while signing up'); return}
                let job = queue.create('signup-success', user).save(function(err){
                    if(err){
                        console.log('Error in sending to queue', err);
                        return;
                    }
                    console.group('Job enqueued', job.id);
                })
                req.flash('success', 'Sign up completed');
                return res.redirect('/users/sign-in');
            })
        }
        else {
            req.flash('error', 'Email already exists');
            return res.redirect('back');
        }
    });
}

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout(function(err) {
        if (err) { console.log('Error in signing out'); /*return next(err);*/ }
        req.flash('success', 'Logged Out  Successfully');
        res.redirect('/');
    }
    )};
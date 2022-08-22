const User = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('user_profile.ejs',{
        title: "Profile"
    });
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
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err) { console.log('error in finding user in signing up'); return}
        
        if(!user){
            User.create(req.body, function(err, user){
                if(err) { console.log('error while signing up'); return}
                return res.redirect('/users/sign-in');
            })
        }
        else {
            return res.redirect('back'); 
        }
    });
}

module.exports.createSession = function(req, res){
    return res.redirect('/users/profile');
}
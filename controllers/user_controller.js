const { model } = require("mongoose");

module.exports.profile = function(req, res){
    return res.render('./user_profile.ejs',{
        title: "Profile"
    });
}

module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
    title: "Ceodial || Sign Up"
    })
}

module.exports.signIn = function(req, res){
    return res.render('user_sign_in',{
        title: "Codeial || User Sign In"
    })
}
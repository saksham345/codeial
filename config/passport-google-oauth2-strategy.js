const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "538625213605-atfq0urk12hs6uab7fu0a7cjbmqbcu8l.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
function(accessToken, refreshToken, profile, done){
    //find a user
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        if(err){
            console.log('error in google-strategy passport', err);
            return;
        }
        console.log(profile);

        if(user){
            //find a user, if found set this as req.user
            return done(null, user);
        }
        else{
            //find a user, if not found create the user as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            },function(err, user){
                if(err) {console.log('error in creating user google-strategy passport', err); return;}

                return done(null, user);
            });
        }

    });
}

))
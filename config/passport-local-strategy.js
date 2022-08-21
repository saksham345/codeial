const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        //find a user and establish it's identity
        User.findOne({email:email}, function(err, user){
            if(err){
                console.log('Error in finding User----->passport');
                return done(err);
            }
            if( !user || user.password != password){
                console.log('Invalid email/password');
                return done(null, false);
            }

            return done(null, user);
        });
    }

));

//serialize user to decide which key to kept in cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserilizing the user from key in cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding User');
            return done(err);
        }
        return done(null, user);
    });
});

module.exports = passport;
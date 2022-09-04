const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email', 
        passReqToCallback: true
    },
    function(req, email, password, done){
        //find a user and establish it's identity
        User.findOne({email:email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);
            }
            if( !user || user.password != password){
                req.flash('error', 'Invalid Username/Password')
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

//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    //if user is signed in, then pass on to request to the next function
    if(req.isAuthenticated()){
        return next();
    }

    //if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
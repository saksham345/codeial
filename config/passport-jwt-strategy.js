const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

//jwt contains of header.payload.signature
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial'
}

passport.use(new JWTstrategy(opts, function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id, function(err, user) {

    if (err) {
        console.log('Error in finding user from JWT', err);
        return;
    }
    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
        // or you could create a new account
    }
})

}));

module.exports = passport;
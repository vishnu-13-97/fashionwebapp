const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done )=>{
    // console.log("Profile:", JSON.stringify(profile, null, 2));

    
    try {
        let user = await User.findOne({googleId:profile.id});
        if(user){
            return done(null,user)
        }else{
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            user = new User({
                name:profile.displayName,
                email:email,
                googleId:profile.id

            });
            await user.save();
            return done(null,user);
        }
    } catch (error) {
       return done (error,null)
        
    }

}

))

passport.serializeUser((user,done)=>{
 done(null,user.id)
});


passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id); 
      done(null, user); // Attach user object to `req.user`
    } catch (err) {
      done(err);
    }
  });

module.exports =passport;
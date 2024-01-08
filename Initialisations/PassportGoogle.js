import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../Models/UserModel.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auths/google/callback',
},
async (accessToken, refreshToken, profile, cb) => {
  let user = await User.findOne({googleId: profile.id});
  if (!user) {
    user = await User.create({googleId: profile.id, username: profile.displayName, email: profile.emails[0].value});
  }
  return cb(null, user);
},
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    cb(err, user);
  });
});

export default passport;

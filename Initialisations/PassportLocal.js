import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../Models/UserModel.js';

passport.use(new LocalStrategy({usernameField: 'email'},
    async (email, password, done) => {
      try {
        const user = await User.findOne({email});
        if (!user) {
          return done(null, false, {message: 'Incorrect email or password.'});
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, {message: 'Incorrect email or password.'});
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;

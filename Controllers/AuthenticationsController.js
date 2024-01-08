import User from '../Models/UserModel.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const AuthController = {
  async register(req, res, next) {
    try {
      const {email, password, username} = req.body;
      const userExists = await User.findOne({email});
      if (userExists) {
        return res.status(400).json({message: 'User already exists'});
      }
      const newUser = new User({username, email, password});
      await newUser.save();
      res.status(201).json({message: 'User registered successfully'});
    } catch (error) {
      next(error);
    }
  },
  async login(req, res, next) {
    passport.authenticate('local',
        {failureRedirect: '/login'}, (err, user, info) => {
          if (err) return res.status(400).json({"login":"failed"});
          if (!user) return res.status(400).json({"login":"failed"});

          req.logIn(user, (err) => {
            if (err) return next(err);
            const token = jwt.sign({
              userId: user._id,
              userRole: user.role,
            }, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.cookie('jwt', token,
                {httpOnly: true, sameSite: 'None', secure: true, domain: '.camille-lecoq.com'});
                //{httpOnly: true, sameSite: 'None', secure: true, domain: 'localhost'});
            return res.status(200).json({userId: user._id, role: user.role});
          });
        })(req, res, next);
  },
  async logout(req, res) {
    req.logout(function(err) {
      if (err) { return next(err); }
        //res.clearCookie('jwt', { domain: 'localhost' });
        res.clearCookie('jwt', { domain: '.camille-lecoq.com' });
      res.send('Logout Succeded');
    });
},
  initiateGoogleAuth(req, res, next) {
      passport.authenticate('google',
        {scope: ['profile', 'email']})(req, res, next);
  },
  googleAuthCallback(req, res, next) {
    passport.authenticate('google',
        {failureRedirect: '/login'}, (err, user, _info) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.redirect('/login');
          }
          req.logIn(user, (error) => {
            if (error) {
              return next(error);
            }
            const token = jwt.sign({
              userId: user._id,
              userRole: user.role,
            }, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.cookie('jwt', token,
                //{httpOnly: true, sameSite: 'None', secure: true, domain: 'localhost'});
                {httpOnly: true, sameSite: 'None', secure: true, domain: '.camille-lecoq.com'});
              return res.status(200).json({userId: user._id, role: user.role});
          });
        })(req, res, next);
  },
};

export default AuthController;

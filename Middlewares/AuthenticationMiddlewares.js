import jwt from 'jsonwebtoken';

const AuthenticationMiddleware = {
  verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(403).json({message: 'Aucun token fourni.'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({message: 'Échec de l\'authentification du token.'});
      }
      req.user = decoded;
      next();
    });
  },
};

export default AuthenticationMiddleware;

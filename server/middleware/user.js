const jwt = require('jsonwebtoken');

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.header('x-auth-token');
    if (token) {
      const accessToken = token;
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json('Token is not valid');
        }
        req.user = user;
        next();
      });

    }
    else {
      res.status(401).json("You're not authenticated");
    }
  },

  //verifyTokenAdminAuth
  verifyTokenAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.parmas.id || req.user.admin) {
        next();
      }
      else {
        res.status(403).json("You're not allowed to delete other")
      }
    });
  },

  notFound: (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
  },

  errHandler: (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    return res.status(statusCode).json({
      success: false,
      
      mes: error.message
    })
  }
}

module.exports = middlewareController;
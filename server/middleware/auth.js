const jwt = require("jsonwebtoken");
const Role = require("../model/role.model");
const middlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers["authorization"];
    const jwt = require("jsonwebtoken");
    
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid"); 
        }

        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },
  verifyTokenAdminAuth: async (req, res, next) => {
    await middlewareController.verifyToken(req, res, async () => {
  
      const userRoles = req.user.roles;
   
      
      
      const adminRole = await Role.findOne({ name: "admin" });
 
      
      if (adminRole) {
        const adminRoleId = adminRole._id.toString();
        const hasAdminRole = userRoles.some(
          (role) => role._id.toString() === adminRoleId
        );

        if (hasAdminRole) {
          next();
        } else {
          res
            .status(403)
            .json("Access denied: Only admins can access this route");
        }
      } else {
        res.status(403).json("Access denied: Admin role not found");
      }
    });
  },

getHeader:async (req, res, next) => {
    const token = req.headers["authorization"];
  
    if (token) {
      const accessToken = token.split(" ")[1]; 
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          req.user = null; 
          next();
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      req.user = null; 
      next();
    }
  }
  
  
};
module.exports = middlewareController;

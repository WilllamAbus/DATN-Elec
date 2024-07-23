const jwt = require('jsonwebtoken');
const Role = require('../model/role.model');
const middlewareController = {

    verifyToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json('Token is not valid');
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
            const adminRole = await Role.findOne({ name: 'admin' });

            if (adminRole && userRoles.includes(adminRole._id.toString())) {
                next();
            } else {
                res.status(403).json("Access denied: Only admins can access this route");
            }
        });
    }



}
module.exports = middlewareController;
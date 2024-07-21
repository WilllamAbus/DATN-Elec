// const userList = require('./../model/users');
const User = require('../model/users.model')
const {regisUser, verifyOtp} = require('../services/user.service')

const user = {
verifyOtp: async(req, res, next)=>{
    try {
        const {
            email,
            otp
        } = req.body

        const {
            code,
            elements,
            token,
            message,
        } = await verifyOtp({
            email, otp
        })

        return res.status(code).json({
            code,
            message,
            token,
            elements
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
},
regisUser: async(req, res, next) =>{
    try {
        const {email} = req.body;
        const {
            code, 
            message, 
            OTP,
            elements
        } = await regisUser({email})
        return res.status(code).json({
            code, 
            message,
            OTP,
            elements
        })
    } catch (error) {
        console.error(error);
        next(error)
    }
},

 // Đăng ký
 registerUser: async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({ msg: 'Email đã tồn tại' });
        }

        const newUser = new User({ email, password, name });
        const user = await newUser.save();

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpires = Date.now() + 3600000; // 1 giờ
        await user.save();
        const adminCategoriesDb = await Category.find({}).populate({
            path: 'userId',
            select: 'role'
        });
        adminCategoriesDb.forEach(async (element) => {
            if (element.userId && element.userId.role === "admin" && element.status === 'active') {
                await Category.create({
                    userId: user._id,
                    type: element.type,
                    name: element.name,
                    image:  element.image,
                    description: element.description,
                    status: element.status,
                    createdAt: element.createdAt,
                    updatedAt: element.updatedAt
                })
            }
        });
        await sendVerificationEmail(user.email, token);

        res.status(200).json({ msg: 'User registered. Verification email sent.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
},


loginUser: async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không chính xác' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Thông tin đăng nhập không chính xác' });
        }

        if (user && validPassword) {
            if (!user.isEmailVerified) {
                return res.status(400).json({ msg: 'Email chưa được xác minh' })

            }
            if (user.status != 'active') {
                console.log({ msg: 'Tài khoản đã bị khóa vui lòng liên hệ email: bemoney@gmail.com' });
                return res.status(400).json({ msg: 'Tài khoản đã bị khóa vui lòng liên hệ email: bemoney@gmail.com' });
            }
            const payload = {
                id: user.id,
                role: user.role,
                name: user.name,
            };
            const jwtSecret = process.env.JWT_ACCESS_KEY;
            if (!jwtSecret) {
                throw new Error('JWT_ACCESS_KEY is not defined');
            }

            const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
            const { password, ...others } = user._doc
            return res.status(200).json({ ...others, accessToken: token });
        }
    } catch (err) {
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
},

}


exports.verifyEmail = (req, res) => {
   
};

exports.resendEmail = (req, res) => {
    
};



exports.forgotPassword = (req, res) => {
   
};

exports.resetPassword = (req, res) => {
   
};

exports.getAllUser = (req, res) => {
    
};

exports.getProfile = (req, res) => {
  
};

exports.updatePassword = (req, res) => {
   
};

exports.deleteUser = (req, res) => {
    
};


module.exports = user
// // add a new user
// const addUser = async (req, res) => {
//     try {
//         const filter = { email: req.body.email };
//         const options = { upsert: true };
//         const updateDoc = {
//             $set: req.body
//         };
//         const result = await userList.updateOne(filter, updateDoc, options);
//         res.status(200).send(result);
//     } catch (err) {
//         console.log(err.message);
//         res.status(402).send({ err: err.message })
//     }
// };

// // update a user
// const updateUser = async (req, res) => {
//     try {
//         const filter = { email: req.body.email };
//         const updateDoc = {
//             $set: req.body
//         };
//         const result = await userList.updateOne(filter, updateDoc);
//         res.status(200).send(result);
//     }
//     catch (err) {
//         res.status(402).send({ err })
//     }
// }

// // get some users
// const someUsers = async (req, res) => {
//     try {
//         const dataCount = parseInt(req.query.dataCount)
//         const my = req.query.i;
//         const users = await userList.find({ email: { $ne: my } }).select('-password').limit(dataCount);

//         const totalUsers = await userList.estimatedDocumentCount();
//         const hasMore = (totalUsers - dataCount > 0) ? true : false;
//         res.status(200).send({ friends: users, hasMore });
//     }
//     catch (err) {
//         res.status(402).send({ err: err.message })
//     }
// }

// // find user
// const serchUser = async (req, res) => {
//     try {
//         const searchText = req.query.searchTxt;
//         const me = req.query.me;
//         if (searchText === '' || !searchText) return res.send([]);
//         const query = {
//             $or: [
//                 {
//                     $and: [
//                         {
//                             name: {
//                                 $regex: searchText,
//                                 $options: 'i'
//                             },
//                         },
//                         {
//                             email: { $ne: me }
//                         }
//                     ]

//                 },
//                 {
//                     $and: [
//                         {
//                             email: {
//                                 $regex: searchText,
//                                 $options: 'i'
//                             },
//                         },
//                         {
//                             email: { $ne: me }
//                         }
//                     ]

//                 },
//                 {
//                     $and: [
//                         {
//                             phone: {
//                                 $regex: searchText,
//                                 $options: 'i'
//                             },
//                         },
//                         {
//                             email: { $ne: me }
//                         }
//                     ]

//                 }
//             ]
//         }
//         const users = await userList.find(query).select('-password');
//         res.status(200).send(users);
//     }
//     catch (err) {
//         res.status(402).send({ err })
//     }
// }

// // single user
// const singleUser = async (req, res) => {
//     try {
//         const query = { _id: req.params.id }
//         const users = await userList.findOne(query).select('-password')
//         res.status(200).send(users);
//     }
//     catch (err) {
//         res.status(402).send({ err: err.message })
//     }
// }

// //get my profile info with email
// const myProfileData = async (req, res) => {
//     try {
//         const query = { email: req.params.email }
//         const users = await userList.findOne(query)
//         res.status(200).send(users);
//     }
//     catch (err) {
//         res.status(402).send({ err })
//     }
// }

// module.exports = {
//     addUser,
//     updateUser,
//     someUsers,
//     serchUser,
//     singleUser,
//     myProfileData
// }
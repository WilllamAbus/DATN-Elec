// const userList = require('./../model/users');
const User = require('../model/users.model')

const {regisUser, verifyOtp, getOne } = require('../services/user.service')
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
getCurrent: async (req, res) => {
    const { id } = req.user; 
    try {
      const response = await getOne(id); 
      return res.status(response.err === 0 ? 200 : 400).json(response); 
    } catch (error) {
      return res.status(500).json({
        err: -1,
        msg: `Failed at user controller: ${error.message}` 
      });
    }
  }
}

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
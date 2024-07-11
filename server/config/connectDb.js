const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI
const connectDb = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected @@...');
  } catch (error) {
    console.log(`${error}`.bgRed);
    process.exit(1);
  }
};

module.exports = connectDb;




// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log(process.env.MONGODB_URI);
//         console.log('MongoDB connected @@...');
//     } catch (error) {
//         console.error('MongoDB connection failed:', error.message);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
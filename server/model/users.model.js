
const {Schema, model } = require("mongoose");
const validator = require('validator');
const userSchema = Schema(
    {
   
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: 'Invalid email format'
            }
        },
        roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
         
    },{
        collection:'users',
        timestamps: true,
    }
);

userSchema.virtual('getTime').get(()=>{
    return Date.now()
})

userSchema.statics.getStatics = ()=>{
    return "get Statics"
}

userSchema.methods.getMethods = function() {
    return `get getMethods with ${this.getTime}`
}

userSchema.methods.populateRoles = async function () {
    await this.populate('roles');
    return this.roles;
};

// userSchema.pre('save', function(next) {
//     // Kiểm tra nếu user đã có userID, không làm gì cả (giả sử userID là duy nhất và đã tồn tại)
//     if (!this.userID) {
//       // Tạo userID ngẫu nhiên, có thể là số ngẫu nhiên hoặc tùy chọn theo cách thức của bạn
//       this.userID = Math.floor(Math.random() * 1000); // Ví dụ đơn giản là số ngẫu nhiên từ 0 đến 999
//     }
//     next();
//   });
module.exports = model("users", userSchema);
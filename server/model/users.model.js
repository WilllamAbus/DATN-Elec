const { Schema, model } = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: 'Invalid email format'
            }
        },
        address: { type: String, require: true},
        status: { type: String, default: 'Hoạt động' },
        socialLogin: {
            googleId: String,
            facebookId: String
        },
        tokenLogin: String,
        avatar: String,
        roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }]
    }, {
    collection: 'users',
    timestamps: true,
}
);

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.password && user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};



userSchema.virtual('getTime').get(() => {
    return Date.now();
});

userSchema.statics.getStatics = () => {
    return "get Statics";
};

userSchema.methods.getMethods = function () {
    return `get getMethods with ${this.getTime}`;
};

userSchema.methods.populateRoles = async function () {
    await this.populate('roles');
    return this.roles;
};

userSchema.pre('save', function (next) {
    if (!this.userId) {
        this.userId = Math.floor(Math.random() * 1000);
    }
    next();
});


module.exports = model("User", userSchema);

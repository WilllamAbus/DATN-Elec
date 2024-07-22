
const { Schema, model } = require("mongoose");

const otpSchema = Schema(
    {

        email: String,
        otp: String,
        time: { type: Date, default: Date.now, index: { expires: 20 } }

    }, {
    collection: 'otp',

}
);


module.exports = model("otp", otpSchema);
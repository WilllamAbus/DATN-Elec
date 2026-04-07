'use strict'
const bcrypt = require('bcrypt')
const _Otp =  require('../model/otp.model')
const otp = {
    validOtp: async({
        otp,
        hashOtp
    })=>{
        try {
            const isValid = await bcrypt.compare(otp, hashOtp)
            return isValid;
        } catch (error) {
            console.error(error)
        }
    },
    insertOTP: async ({
        otp,
        email
    })=>{
        try {
            const salt  = await bcrypt.genSalt(10);
            const hashOTP = await bcrypt.hash(otp, salt);
            const Otp = await _Otp.create({
                email,
                otp:hashOTP
            })

            return Otp ;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = otp
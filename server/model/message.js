const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = Schema(
    {
        msg: {
            type: {
                type: String,
                required: true
            },
            message: mongoose.Schema.Types.Mixed,
            reply: {
                type: Boolean,
            }
        },
        sender: {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            photoUrl: {
                type: String,
                required: true
            },
        },
        receiver: {
            id: {
                type: String,
            },
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            photoUrl: {
                type: String,
                required: true
            },
        },
        time: {
            type: Number,
        },

    }
);

module.exports = messages = mongoose.model("messages", messageSchema);
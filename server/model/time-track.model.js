const { Schema, model } = require("mongoose");




const timeTrackSchema = new Schema(
  {
 
    startTime: {
      type: Date,
      default: Date.now, // Optional: sets default to the current time if not provided
    },
    endTime: {
      type: Date,
    },
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "timetrack",
    timestamps: true,
  }
);



module.exports = model("timetrack", timeTrackSchema);
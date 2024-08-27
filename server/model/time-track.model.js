const { Schema, model } = require("mongoose");




const timeTrackSchema = new Schema(
  {
 
      Start_Time: {
        type: Date,
        default: () => new Date(new Date().setSeconds(0, 0))  // Set time to the beginning of the minute
      },
      End_Time: {
        type: Date,
        default: '0000-00-00 00:00:00'
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
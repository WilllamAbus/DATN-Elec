const { Schema, model } = require("mongoose");




const timeTrackSchema = new Schema(
  {
 
     startTime: {
        type: Date,
       // Set time to the beginning of the minute
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
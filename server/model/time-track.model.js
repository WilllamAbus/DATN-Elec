const { Schema, model } = require("mongoose");




const timeTrackSchema = new Schema(
  {
    productId :{type: Schema.Types.ObjectId , ref :'productAuction'},
    startTime: {
      type: Date,
      default: Date.now, // Optional: sets default to the current time if not provided
    },
    endTime: {
      type: Date,
    },
    endTimeBid :{ type: Date,},
    stateTime: {type: String , enum:['Thời gian đang chạy',"Thời gian kết thúc" ]},
    status: { type: String, default: 'active' },
    disabledAt: { type: Date, default: null },
  },
  {
    collection: "timetrack",
    timestamps: true,
  }
);



module.exports = model("timetrack", timeTrackSchema);
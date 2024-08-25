const { Schema, model } = require("mongoose");
const slugify = require('slugify')
const serviceSchema = new Schema(
  {
    service_name: { type: String, required: true }, // Name of the service
    description: { type: String, required: true },
     serrvice_slug: String,
    stateNoti :{type: String, default: 'has' },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: 'active' },
  serviceOpenDate: { type: Date, required: true },
    disabledAt: { type: Date, default: null },
    isOpenDate:{type: String, default: 'Close'},
    modifieon: { type: Date, default: Date.now }, // Ngày cập nhật giỏ hàng
  
  },
  {
    collection: "services", // Name of the collection
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

serviceSchema.pre('save', function(next){
    this.serrvice_slug = slugify(this.service_name, {lower: true})
    next()
})

module.exports = model("services", serviceSchema);

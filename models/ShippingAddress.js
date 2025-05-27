const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  full_name: String,
  address_line1: String,
  address_line2: String,
  city: String,
  state: String,
  postal_code: String,
  country: String,
  phone: String,
});

module.exports = mongoose.model("ShippingAddress", shippingAddressSchema);

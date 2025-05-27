const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  url: { type: String, required: true },
  alt_text: String,
});

module.exports = mongoose.model("ProductImage", productImageSchema);

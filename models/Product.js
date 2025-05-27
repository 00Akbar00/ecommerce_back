const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

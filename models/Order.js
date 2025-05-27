const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
    },
    total: Number,
    stripe_payment_id: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");

const paymentLogSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    stripe_payment_id: String,
    amount: Number,
    status: String,
    response: mongoose.Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("PaymentLog", paymentLogSchema);

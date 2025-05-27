const mongoose = require("mongoose");

const orderStatusLogSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
    },
    comment: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("OrderStatusLog", orderStatusLogSchema);

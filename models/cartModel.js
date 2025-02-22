const mongoose = require("mongoose");
const cartSchema = mongoose.Schema(
  {
    cartsItem: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    priceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

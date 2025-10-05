const mongoose = require('mongoose');

const buyerDetailsSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true,
  },
  phone: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('MinimalBuyerDetails', buyerDetailsSchema);

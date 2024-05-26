
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  nearbyHospital: { type: Number, required: true },
  nearbyCollege: { type: Number, required: true },
  rent: { type: Number, required: true },
  maintenance: { type: Number, required: true },
  noOfTenantsAllowed: { type: Number, required: true },
});

module.exports = mongoose.model('Property', propertySchema);

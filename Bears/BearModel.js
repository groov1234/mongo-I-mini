const mongoose = require('mongoose');

const BearSchema = new mongoose.Schema({
  species: {
    type: String,
    required: true
  },
  latinName: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now
  } // Date,  required, defaults to current date
});
// bear_list

const BearModel = mongoose.model('Bear', BearSchema);

module.exports = BearModel;

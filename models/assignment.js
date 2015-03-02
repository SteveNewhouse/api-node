// Load required packages
var mongoose = require('mongoose');

// Define our Assignment schema as basically 'anything goes'... easy, but has some cons...
var AssignmentSchema = new mongoose.Schema({}, { strict: false });

// Export the Mongoose model
module.exports = mongoose.model('Assignment', AssignmentSchema);

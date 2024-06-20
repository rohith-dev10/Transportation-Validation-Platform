const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    licenseNumber: String,
    drivingHistory: String
});

module.exports = mongoose.model('Driver', DriverSchema);

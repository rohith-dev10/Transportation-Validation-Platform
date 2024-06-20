const mongoose = require('mongoose');

const TruckOwnerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: String,
    maintenanceAPI: String,
    ownershipDuration: String
});

module.exports = mongoose.model('TruckOwner', TruckOwnerSchema);

const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: String,
    telematicsAPI: String,
    crmAPI: String,
    fleetSize: Number
});

module.exports = mongoose.model('Transportation Company', CompanySchema);

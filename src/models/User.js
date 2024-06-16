const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    relatedTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userType',
        default:null
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Truck Owner', 'Driver', 'Transportation Company']
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        default: null
    },
    resetPasswordOTP: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('User', UserSchema);

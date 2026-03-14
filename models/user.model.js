const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    credits: {
        type: Number,
        default: 20,
    },
    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    lastResetDate: {
        type: Date,
        default: Date.now,
    },
    email: String,
    displayName: String,
});

module.exports = mongoose.model('User', userSchema);

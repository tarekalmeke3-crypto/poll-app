const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    choice: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vote', voteSchema);

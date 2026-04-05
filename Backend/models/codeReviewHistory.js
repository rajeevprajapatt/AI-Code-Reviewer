import mongoose from 'mongoose';

const codeReviewHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputCode: {
        type: String,
        // required: true
    },
    outputCode: {
        type: String,
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const codeReviewHistory = mongoose.model('codeReviewHistory', codeReviewHistorySchema);

export default codeReviewHistory;
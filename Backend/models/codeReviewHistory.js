import mongoose from 'mongoose';

const codeReviewHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prompt: {
        type: String,
        required: true
    },

    title: String,
    text: String,
    action: String,
    suggestions: {
        reviewCode: String,
        explainCode: String,
        fixBugs: String,
        optimization: String,
        optimizatedCode: String
    }
}, { timestamps: true });

const codeReviewHistory = mongoose.model('codeReviewHistory', codeReviewHistorySchema);

export default codeReviewHistory;
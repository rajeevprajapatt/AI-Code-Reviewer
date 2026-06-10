import * as aiService from '../services/ai_service.js'
import codeReviewModel from '../models/codeReviewHistory.js'
import User from '../models/user.js';

export const generateResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await aiService.generateResponse(prompt);
        const userId = await User.getUserId(req.user.email);

        if (response.error) {
            return res.status(400).send({ msg: response.text })
        }

        const savedResponse = await codeReviewModel.create({
            userId: userId,
            prompt: prompt,
            title: response?.title,
            text: response?.text,
            action: response?.action,
            suggestions: response?.suggestions ? {
                reviewCode: response.suggestions.reviewCode || null,
                explainCode: response.suggestions.explainCode || null,
                fixBugs: response.suggestions.fixBugs || null,
                optimization: response.suggestions.optimization || null,
                optimizatedCode: response.suggestions.optimizatedCode || null
            } : null
        })

        console.log("saved response : ", savedResponse)
        res.status(200).send({ response: savedResponse })
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while generating response' })
    }
}

export const getDocument = async (req, res) => {
    const { documentId } = req.body;

    try {
        const document = await codeReviewModel.findById(documentId);

        res.status(200).send({ response: document });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while fetching document' })
    }
}

export const updateDocument = async (req, res) => {
    const { docId, aiResponse } = req.body;
    try{
        const updateDoc = await codeReviewModel.replaceOne({ _id: docId }, aiResponse);
        res.status(200).send({ msg: 'Document updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while updating document' })
    }
}

export const getAllResponses = async (req, res) => {
    try {
        const responses = await codeReviewModel.find();
        res.status(200).send({ responses });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while fetching all responses' })
    }
}

export const getUserHistory = async (req, res) => {
    const userId = await User.getUserId(req.user.email);
    try {
        const responses = await codeReviewModel.find({ userId: userId }).select("_id title action updatedAt");

        res.status(200).send({ responses });
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while fetching user history' })
    }
}


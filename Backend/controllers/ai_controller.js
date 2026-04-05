import * as aiService from '../services/ai_service.js'
import codeReviewModel from '../models/codeReviewHistory.js'

export const generateResponse = async (req, res) => {
    try {
        const { prompt } = req.query;

        let newPrompt = prompt + `\n\n\n\n\n Please review the above code and provide feedback on the following points : \n 1. Code Quality \n 2. Code Efficiency \n 3. Code Readability \n 4. Code Maintainability \n 5. Any potential bugs or issues in the code`
        console.log("running here")
        const response = await aiService.generateResponse(newPrompt);
        console.log("response :",response);

        console.log("req.user : ", req.user )

        // const codeReview = await codeReviewModel.create({
        //     userId: req.user._id,
        //     inputCode: prompt,
        //     outputCode: response
        // })

        res.status(200).send({ response })
    } catch (error) {
        console.error(error);
        res.status(400).send({ msg: 'Error while generating response' })
    }
}
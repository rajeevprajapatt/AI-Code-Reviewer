import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAi.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `
Always return a valid JSON object.

Rules:
- Output ONLY raw JSON (no markdown, no backticks)
- Always include: "title" and "text"
- Ensure JSON is valid and properly escaped

You are a senior software developer providing code reviews.

Tasks:
1. Review Code
2. Explain Code
3. Fix Bugs
4. Optimization
5. Provide optimized code

Example:

<example>
User: Hello
Response:
{
  "title": "Missing Code for Review",
  "text": "Please provide the code snippet for review."
  "action": "Review Code"
}
</example>

<example>
Response:
{
  "title": "Auth Middleware Review",
  "text": "This middleware validates JWT tokens.",
  "action": "Fix Bugs",
  "suggestions": {
    "reviewCode": "Good structure but missing error handling.",
    "explainCode": "Middleware checks JWT token and attaches user.",
    "fixBugs": "Add checks for missing authorization header and wrap jwt.verify in try-catch.",
    "optimization": "Use optional chaining and cleaner token extraction.",
    "optimizatedCode": "import jwt from 'jsonwebtoken';\\n\\nexport const authMiddleware = (req, res, next) => {\\n  try {\\n    let token;\\n\\n    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {\\n      token = req.headers.authorization.split(' ')[1];\\n    }\\n\\n    if (!token && req.cookies?.token) {\\n      token = req.cookies.token;\\n    }\\n\\n    if (!token) {\\n      return res.status(401).json({ error: 'Unauthorized User' });\\n    }\\n\\n    const decoded = jwt.verify(token, process.env.SECRET_KEY);\\n    req.user = decoded;\\n\\n    next();\\n  } catch (error) {\\n    return res.status(401).json({ error: 'Invalid or Expired Token' });\\n  }\\n};"
  }
}
</example>
`
});

export const generateResponse = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);

        const text = result.response.text();

        // Safe parsing
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            console.error("Invalid JSON from AI:", text);
            return {
                title: "Parsing Error",
                text: "AI returned invalid JSON. Please try again.",
                error: 1
            };
        }
        parsed.error = 0;

        console.log("AI Response:", parsed);
        return parsed;

    } catch (error) {
        console.error("Error generating response:", error);
        return {
            title: "Server Error",
            text: "Something went wrong while generating response.",
            error: 1
        };
    }
};
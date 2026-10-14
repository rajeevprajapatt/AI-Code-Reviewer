import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized User" });
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid Token" });
    }
}
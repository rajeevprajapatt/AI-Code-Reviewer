import jwt from 'jsonwebtoken'


export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized User" });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decode;
    next();
}
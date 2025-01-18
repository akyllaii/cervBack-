import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // Extract token

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123'); // Replace 'secret123' with your actual secret
            req.userId = decoded._id; // Attach the user ID to the request
            console.log('Decoded User ID:', req.userId); // Log for debugging
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа', // Access denied message
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа', // No access message
        });
    }
};

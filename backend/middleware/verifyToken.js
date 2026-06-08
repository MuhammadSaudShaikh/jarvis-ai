const { verifyToken } = require('../config/auth');

function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Check karo token hai ya nahi
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  // Token extract karo ("Bearer xyz123" se "xyz123")
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  // Token invalid hai to error
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
  
  // Token sahi hai to user data request mein attach karo
  req.user = decoded;
  next();
}

module.exports = verifyTokenMiddleware;
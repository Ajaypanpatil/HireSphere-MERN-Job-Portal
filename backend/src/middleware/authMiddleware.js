import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Make sure this path is correct

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user info from DB excluding password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach full user document to req.user

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

import admin from '../config/firebase-admin.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // For development, allow requests without token
    if (process.env.NODE_ENV !== 'production') {
      req.user = {
        firebaseUid: 'dev-uid',
        email: req.body.email || 'dev@example.com',
        emailVerified: true
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified
    };
    next();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      // In development, continue without token
      req.user = {
        firebaseUid: 'dev-uid',
        email: req.body.email || 'dev@example.com',
        emailVerified: true
      };
      return next();
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};
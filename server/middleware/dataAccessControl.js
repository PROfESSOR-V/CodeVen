import User from '../models/User.js';

export const dataAccessControl = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user.firebaseUid });
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store current user in request for later use
    req.currentUser = currentUser;

    // If admin, allow all access
    if (currentUser.role === 'admin') {
      return next();
    }

    // If accessing own profile, allow access
    if (req.params.userId === currentUser._id.toString()) {
      return next();
    }

    // If faculty member trying to access student data
    if (currentUser.role === 'faculty' && req.method !== 'GET') {
      const targetUser = await User.findById(req.params.userId);
      
      if (!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
      }

      // Only allow faculty to modify student data
      if (targetUser.role !== 'student') {
        return res.status(403).json({ 
          message: 'Faculty can only modify student data' 
        });
      }

      // Only allow faculty from same department
      if (targetUser.department !== currentUser.department) {
        return res.status(403).json({ 
          message: 'You can only access students from your department' 
        });
      }
    }

    // Students can only access their own data
    if (currentUser.role === 'student' && req.params.userId !== currentUser._id.toString()) {
      return res.status(403).json({ 
        message: 'Students can only access their own data' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking data access permissions' });
  }
};
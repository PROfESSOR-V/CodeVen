import express from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, async (req, res) => {
    try {
        console.log('Fetching dashboard data for user:', req.user.firebaseUid);
        
        const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
        console.log('User found:', user ? 'yes' : 'no');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate GPA (if academics data exists)
        let gpa = 0;
        if (user.academics?.marks?.length > 0) {
            console.log('Calculating GPA from', user.academics.marks.length, 'marks');
            const totalMarks = user.academics.marks.reduce((acc, mark) => {
                return acc + (mark.marks / mark.maxMarks) * 10;
            }, 0);
            gpa = totalMarks / user.academics.marks.length;
        }

        // Calculate approved and pending activities
        const activities = user.activities || [];
        console.log('Found activities:', activities.length);
        const approvedActivities = activities.filter(a => a.status === 'Approved').length;
        const pendingActivities = activities.filter(a => a.status === 'Pending').length;

        // Calculate recent activities (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentApproved = activities.filter(a => 
            a.status === 'Approved' && 
            new Date(a.updatedAt) > thirtyDaysAgo
        ).length;

        // Calculate average review time for completed activities
        let averageReviewTime = 0;
        const completedActivities = activities.filter(a => 
            a.status === 'Approved' || a.status === 'Rejected'
        );
        
        if (completedActivities.length > 0) {
            const totalReviewTime = completedActivities.reduce((acc, activity) => {
                const submitTime = new Date(activity.createdAt);
                const reviewTime = new Date(activity.updatedAt);
                return acc + (reviewTime - submitTime) / (1000 * 60 * 60 * 24); // Convert to days
            }, 0);
            averageReviewTime = totalReviewTime / completedActivities.length;
        }

        // Get coding problems count
        const codingProblems = user.codingStats?.problemsSolved || 0;
        const recentCoding = user.codingStats?.recentSolved || 0;

        // Get last semester GPA
        const lastSemesterGpa = user.academics?.lastSemesterGpa || 0;

        res.json({
            gpa,
            lastSemesterGpa,
            approvedActivities,
            pendingActivities,
            recentApproved,
            averageReviewTime: averageReviewTime.toFixed(1),
            codingProblems,
            recentCoding,
            activities: activities.slice(0, 3) // Only send 3 most recent activities
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

export default router;
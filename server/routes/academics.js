import express from 'express';
import { dataAccessControl } from '../middleware/dataAccessControl.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';
import User from '../models/User.js';

const router = express.Router();

// Get student marks
router.get('/students/:studentId/marks', 
  verifyFirebaseToken, 
  dataAccessControl,
  async (req, res) => {
    try {
      const student = await User.findById(req.params.studentId)
        .select('academics.marks name studentId');
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      res.json(student.academics.marks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student marks' });
    }
});

// Add marks for a student
router.post('/students/:studentId/marks',
  verifyFirebaseToken,
  dataAccessControl,
  async (req, res) => {
    try {
      const { subject, semester, marks, maxMarks } = req.body;

      // Validate input
      if (!subject || !semester || marks == null || !maxMarks) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Find student
      const student = await User.findById(req.params.studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Add marks
      student.academics.marks.push({
        subject,
        semester,
        marks,
        maxMarks,
        addedBy: req.currentUser._id,
        addedAt: new Date()
      });

      await student.save();
      res.json(student.academics.marks);
    } catch (error) {
      res.status(500).json({ message: 'Error adding marks' });
    }
});

// Update student marks
router.put('/students/:studentId/marks/:markId',
  verifyFirebaseToken,
  dataAccessControl,
  async (req, res) => {
    try {
      const { subject, semester, marks, maxMarks } = req.body;
      
      // Find and update the mark
      const student = await User.findById(req.params.studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const mark = student.academics.marks.id(req.params.markId);
      if (!mark) {
        return res.status(404).json({ message: 'Mark entry not found' });
      }

      // Only allow the faculty who added the marks to update them
      if (mark.addedBy.toString() !== req.currentUser._id.toString()) {
        return res.status(403).json({ 
          message: 'You can only update marks that you added' 
        });
      }

      // Update marks
      Object.assign(mark, {
        subject: subject || mark.subject,
        semester: semester || mark.semester,
        marks: marks ?? mark.marks,
        maxMarks: maxMarks || mark.maxMarks
      });

      await student.save();
      res.json(student.academics.marks);
    } catch (error) {
      res.status(500).json({ message: 'Error updating marks' });
    }
});

// Delete student marks
router.delete('/students/:studentId/marks/:markId',
  verifyFirebaseToken,
  dataAccessControl,
  async (req, res) => {
    try {
      // Find student
      const student = await User.findById(req.params.studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Find mark entry
      const mark = student.academics.marks.id(req.params.markId);
      if (!mark) {
        return res.status(404).json({ message: 'Mark entry not found' });
      }

      // Only allow the faculty who added the marks to delete them
      if (mark.addedBy.toString() !== req.currentUser._id.toString()) {
        return res.status(403).json({ 
          message: 'You can only delete marks that you added' 
        });
      }

      // Remove mark entry
      mark.remove();
      await student.save();
      
      res.json({ message: 'Mark entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting mark entry' });
    }
});

export default router;
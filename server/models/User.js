import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: [true, 'Role is required']
  },
  bio: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  socialLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  certificates: [{
    name: String,
    url: String,
    uploadDate: Date,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  academics: {
    marks: [{
      subject: String,
      semester: Number,
      marks: Number,
      maxMarks: Number,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
    attendance: [{
      subject: String,
      date: Date,
      present: Boolean,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    lastSemesterGpa: Number
  },
  activities: [{
    title: String,
    category: {
      type: String,
      enum: ['Competitions', 'Volunteering', 'Certifications', 'Projects', 'Internships', 'Other']
    },
    description: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }]
  }],
  verified: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.role === 'student'; }
  },
  facultyId: {
    type: String,
    sparse: true,
    unique: true,
    required: function() { return this.role === 'faculty'; }
  },
  department: {
    type: String,
    required: function() { return this.role === 'faculty' || this.role === 'student'; }
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
    required: function() { return this.role === 'student'; }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
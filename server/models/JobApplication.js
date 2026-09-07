const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, index: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  coverLetter: { type: String, default: '' },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'interview', 'rejected', 'hired'],
    default: 'submitted',
    index: true,
  },
  notes: { type: String, default: '' }, // internal admin notes, never exposed to the applicant
}, { timestamps: true });

// One application per email per job — resubmitting updates the existing
// record instead of creating duplicates in the pipeline.
jobApplicationSchema.index({ job: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

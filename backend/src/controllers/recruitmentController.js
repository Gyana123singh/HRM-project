const JobPosting = require('../models/JobPosting');
const Candidate = require('../models/Candidate');

// @desc    Get job postings
// @route   GET /api/recruitment/jobs
// @access  Public / Private
exports.getJobs = async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = department;
    }

    const jobs = await JobPosting.find(query)
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job posting
// @route   POST /api/recruitment/jobs
// @access  Private (Admin, HR)
exports.createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    const job = await JobPosting.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (Open, Closed, Draft)
// @route   PATCH /api/recruitment/jobs/:id/status
// @access  Private (Admin, HR)
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Open', 'Closed', 'Draft'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid job status' });
    }

    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job posting status updated to ${status}`,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit job application (Candidate apply)
// @route   POST /api/recruitment/apply
// @access  Public
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, fullName, email, phone, resumeUrl } = req.body;

    if (!jobId || !fullName || !email) {
      return res.status(400).json({ success: false, message: 'Please provide job ID, full name, and email' });
    }

    const job = await JobPosting.findById(jobId);
    if (!job || job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'Job opening is not available' });
    }

    // Check if candidate already applied to this job
    const existing = await Candidate.findOne({ jobId, email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job position' });
    }

    const candidate = await Candidate.create({
      jobId,
      fullName,
      email,
      phone,
      resumeUrl,
      status: 'Applied'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidates for a job posting (Kanban view)
// @route   GET /api/recruitment/candidates
// @access  Private (Admin, HR)
exports.getCandidatesByJob = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;
    const query = {};

    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    const candidates = await Candidate.find(query)
      .populate('jobId', 'title department location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate recruitment status
// @route   PATCH /api/recruitment/candidates/:id/status
// @access  Private (Admin, HR)
exports.updateCandidateStatus = async (req, res, next) => {
  try {
    const { status, notes, interviewDate } = req.body;

    if (!['Applied', 'Screened', 'Interviewed', 'Offered', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid candidate status' });
    }

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    }

    candidate.status = status;
    if (notes !== undefined) candidate.notes = notes;
    if (interviewDate !== undefined) candidate.interviewDate = interviewDate;

    await candidate.save();

    res.status(200).json({
      success: true,
      message: `Candidate status updated to ${status}`,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

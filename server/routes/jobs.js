const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

const router = express.Router();

// Every route below needs login
router.use(auth);

// GET /api/jobs?status=Applied&search=google
router.get("/", async (req, res) => {
  try {
    const filter = { user: req.userId }; // only MY jobs

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      // escape special characters so the search never crashes
      const safe = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const text = new RegExp(safe, "i");
      filter.$or = [{ company: text }, { role: text }];
    }

    const jobs = await Job.find(filter).sort({ appliedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/stats  -> counts per status
router.get("/stats", async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId });
    const stats = { Total: jobs.length, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    jobs.forEach((job) => {
      stats[job.status] = stats[job.status] + 1;
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const { company, role, status, appliedDate, link, notes, salary, location } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const job = await Job.create({
      user: req.userId,
      company,
      role,
      status,
      appliedDate,
      link,
      notes,
      salary,
      location,
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const { company, role, status, appliedDate, link, notes, salary, location } = req.body;

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // user check = security
      { company, role, status, appliedDate, link, notes, salary, location },
      { new: true, runValidators: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

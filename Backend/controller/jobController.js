const Job = require("../model/Job");
const User = require("../model/User");
const Application = require("../model/Application");
const SavedJob = require("../model/SavedJob");

//@desc Create a new job (employer only)
exports.createJob = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Only employers can post jobs" });
        }

        const job = await Job.create({ ...req.body, company: req.user._id });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const {
            keyword,
            location,
            category,
            type,
            minSalary,
            maxSalary,
            userId
        } = req.query;

        const query = {
            isClosed: false,
            ...(keyword && {
                title: { $regex: keyword, $options: "i" }
            }),
            ...(location && {
                location: { $regex: location, $options: "i" }
            }),
            ...(category && { category }),
            ...(type && { type }),
        };

        // Salary filter
        if (minSalary || maxSalary) {
            query.$and = [];

            if (minSalary) {
                query.$and.push({
                    salaryMax: { $gte: Number(minSalary) }
                });
            }

            if (maxSalary) {
                query.$and.push({
                    salaryMin: { $lte: Number(maxSalary) }
                });
            }
        }

        const jobs = await Job.find(query)
            .populate(
                "company",
                "name companyName companyLogo"
            );

        let savedJobIds = [];
        let appliedJobStatusMap = {};

        if (userId) {
            // Saved Jobs
            const savedJobs = await SavedJob
                .find({ jobSeeker: userId })
                .select("job");

            savedJobIds = savedJobs.map((s) => String(s.job));

            // Applications
            const applications = await Application
                .find({ applicant: userId })
                .select("job status");

            applications.forEach((app) => {
                appliedJobStatusMap[String(app.job)] = app.status;
            });
        }

        // Add extra information
        const jobsWithExtras = jobs.map((job) => {
            const jobIdStr = String(job._id);

            return {
                ...job.toObject(),

                isSaved: savedJobIds.includes(jobIdStr),

                applicationStatus:
                    appliedJobStatusMap[jobIdStr] || null,
            };
        });

        res.json(jobsWithExtras);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

//@desc Get jobs for logged in user (Employer can see posted jobs)
exports.getJobsEmployer = async (req, res) => {
    try {
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Get single job by ID
exports.getJobById = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Update a job (Employer only)
exports.updateJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Toggle Close Status for a job (Employer only)
exports.toggleCloseJob = async (req, res) => {
    try {

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

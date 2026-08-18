const mongoose = require("mongoose");

const jobScheme = new mongoose.Schema ({
    title: {type: String, required: true},
    description: {type: String, required: true},
    requirements: {type: String, required: true},
    location: {type: String},
    category: {type: String},
    type: {
        type: String,
        email: ["Remote", "Full=Time", "Part-Time", "Internship", "Contract"],
        required: true,
    },
    company: {type: mongoose.Schema.Types.ObjectId, ref: "USer", required: true}, // Employer

    salaryMin: {type: Number},
    salaryMax: {type: Number},
    isClosed: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = mongoose.model("Job", jobSchema);
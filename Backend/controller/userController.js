const fs = require("fs");
const path = require('path');
const User = require("../model/User.js");

//@desc Update user profile (name,avatar,company details)
exports.updateProfile = async (req, res) => {
    try {
        const { name, avatar, companyName, companyDescription, companyLogo, resume } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).json({ message: "User not found" });

        user.name = name || user.name;
        user.avatar = avatar || user.avatar;
        user.resume = resume || user.resume;

        // If employer, allow updating company info
        if (user.role === "employer") {
            user.companyName = companyName || user.companyName;
            user.companyDescription = companyDescription || user.companyDescription;
            user.companyLogo = companyLogo || user.companyLogo;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            companyName: user.companyName,
            companyDescription: user.companyDescription,
            resume: user.resume || '',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Delete resume file(jobSeeker only)
exports.deleteResume = async (req, res) => {
    try {
        const { resumeUrl } = req.body; //expect resumeUrl to be the URL of the resume

        //Extract file name from the URL
        const fileName = resumeUrl?.split('/')?.pop();
        if (!user) return res.status(400).json({ message: "User not found" });

        if (user.role !== "jobSeeker")
            return res.status(403).json({ message: "Only jobSeekers can delete resume" });

        //Construct the full file path
        const filePath = path.join(_dirname, '../uploads', fileName);

        //Check if the file exists and the delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // delete the file
        }

        //Set the user's resume to an empty string
        user.resume = '';
        await user();

        res.json({ message: "Resume deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//@desc Get user profile profile
exports.getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
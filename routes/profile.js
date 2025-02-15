const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Profile Picture Upload Route
router.post("/upload-profile", upload.single("profilePicture"), async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    const user = await User.findById(req.session.user._id);
    user.profilePicture = req.file.filename;
    await user.save();

    req.session.user.profilePicture = user.profilePicture; // Update session data
    res.redirect("/profile");
});

module.exports = router;

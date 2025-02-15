const express = require("express");
const router = express.Router();

// Dashboard Route (Only accessible to logged-in users)
router.get("/dashboard", (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    res.render("dashboard", { user: req.session.user });
});

// Show Profile Page
router.get("/profile", (req, res) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    res.render("profile", { user: req.session.user });
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("../models/User");

const router = express.Router();

// Initialize Session Middleware
router.use(session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Show Register Page (GET)
router.get("/register", (req, res) => {
    res.render("register");
});

// Handle User Registration (POST)
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send("All fields are required!");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send("Email already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.redirect("/login");
});

// Show Login Page (GET)
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle Login (POST)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials!");
    }

    req.session.user = user;
    res.redirect("/dashboard");
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;

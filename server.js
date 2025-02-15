require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth"); // Include auth routes
const dashboardRoutes = require("./routes/dashboard"); 
const profileRoutes = require("./routes/profile");


const app = express();
connectDB();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", profileRoutes); // Use the profile routes

app.get("/", (req, res) => {
    res.render("index", { user: req.session ? req.session.user : null });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

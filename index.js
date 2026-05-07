const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// // Routes
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const projectRoutes = require("./routes/projectRoute");
const taskRoutes = require("./routes/taskRoute");


connectDB();

// Middlewares
app.use(cors({
    // origin: "http://localhost:5173",
    origin :"https://task-management-frontend-aovq.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req, res) => {
    res.send("event management system");
});


app.listen(process.env.PORT || 8080, () => {
    console.log("Server running on port 8080");
});
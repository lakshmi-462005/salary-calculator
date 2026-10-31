const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Salary = require("./models/Salary");

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Salary Calculator Backend is Running!");
});

// Save salary calculation
app.post("/api/salary", async (req, res) => {
    try {
        const {
            city,
            payCommission,
            basicPay,
            finalSalary
        } = req.body;

        const salary = new Salary({
            city,
            payCommission,
            basicPay,
            finalSalary
        });

        await salary.save();

        res.status(201).json({
            message: "Salary saved successfully",
            data: salary
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to save salary"
        });
    }
});

// Connect to MongoDB Atlas using Render Environment Variable
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Backend Server Running on port ${PORT}`);
});
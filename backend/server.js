const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Salary = require("./models/Salary");

const app = express();

const PORT = 5000;

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


// MongoDB connection
mongoose
    .connect("mongodb://127.0.0.1:27017/salary_calculator")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// Start server
app.listen(PORT, () => {
    console.log(`Backend Server Running on http://localhost:${PORT}`);
});
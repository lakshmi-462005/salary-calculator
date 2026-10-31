const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({

    city: {
        type: String,
        required: true
    },

    payCommission: {
        type: String,
        required: true
    },

    basicPay: {
        type: Number,
        required: true
    },

    finalSalary: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Salary", salarySchema);
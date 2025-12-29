const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema({
  month: { type: String, required: true },

 employees: [
  {
    _id: String,
    name: String,
    location: String,

    salaryType: String,     // ⭐ REQUIRED
    basicSalary: Number,    // ⭐ REQUIRED
    dailyWage: Number,      // ⭐ REQUIRED
    otRate: Number,         // ⭐ REQUIRED

    workingDays: Number,
    leaveDeducted: Number,
    casualLeave: Number,
    taDa: Number,
    overtime: Number,
    otAmount: Number,
    festivalAllowance: Number,
    otherAllowance: Number,
    advanceSalary: Number,
    note: String,

    balanceSalary: Number,
  }
],


  totalPayrollAmount: Number
});

module.exports = mongoose.model("Payroll", PayrollSchema);

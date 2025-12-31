const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    // ✅ MANUAL + EDITABLE EMPLOYEE ID
    employeeId: {
      type: String,
      unique: true,
      required: true, // must be entered in form
      trim: true,
      uppercase: true,
    },

    // BASIC DETAILS
    name: { type: String, required: true },
    department: { type: String },
    location: { type: String, default: "Office" },

    // SALARY TYPE
    salaryType: {
      type: String,
      enum: ["monthly", "daily", "hourly", "weekly"],
      default: "monthly",
    },

    // SALARY VALUES
    basicSalary: { type: Number, default: 0 },
    dailyWage: { type: Number, default: 0 },

    // CURRENT PENDING INCREMENT
    salaryIncrement: { type: Number, default: 0 },
    salaryIncrementFrom: { type: String, default: null }, // YYYY-MM

    // ✅ INCREMENT HISTORY
    salaryIncrementHistory: [
      {
        amount: { type: Number, required: true },
        fromMonth: { type: String, required: true },
        applied: { type: Boolean, default: false },
        appliedOn: { type: Date },
      },
    ],

    // OT
    otRate: { type: Number, default: 0 },

    // PAYMENT
    paymentMethod: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash"],
      default: "Cash",
    },

    // ACCOUNTING
    gstType: {
      type: String,
      enum: ["GST", "No GST"],
      default: "No GST",
    },
  },
  { timestamps: true }
);

/**
 * ❌ REMOVED AUTO-GENERATION HOOK
 * Employee ID is now fully manual & editable
 */

module.exports =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

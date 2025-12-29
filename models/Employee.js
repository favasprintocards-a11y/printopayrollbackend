const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },

    name: { type: String, required: true },
    department: { type: String },
    location: { type: String, default: "Office" },

    salaryType: {
      type: String,
      enum: ["monthly", "daily", "hourly", "weekly"],
      default: "monthly",
    },

    basicSalary: { type: Number, default: 0 },
    dailyWage: { type: Number, default: 0 },

    salaryIncrement: { type: Number, default: 0 },
    salaryIncrementFrom: { type: String, default: null },

    // ✅ FIXED: MUST BE INSIDE SCHEMA
    salaryIncrementHistory: [
      {
        amount: Number,
        fromMonth: String,
        applied: { type: Boolean, default: false },
        appliedOn: Date,
      },
    ],

    otRate: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash"],
      default: "Cash",
    },

    gstType: {
      type: String,
      enum: ["GST", "No GST"],
      default: "No GST",
    },
  },
  { timestamps: true }
);

// ================= AUTO EMPLOYEE ID =================
EmployeeSchema.pre("save", async function () {
  if (this.employeeId) return;

  const last = await this.constructor
    .findOne({ employeeId: { $exists: true } })
    .sort({ createdAt: -1 });

  let nextId = "EMP001";

  if (last?.employeeId) {
    const num = parseInt(last.employeeId.replace("EMP", ""), 10) + 1;
    nextId = "EMP" + String(num).padStart(3, "0");
  }

  this.employeeId = nextId;
});

module.exports = mongoose.model("Employee", EmployeeSchema);

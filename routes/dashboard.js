const router = require("express").Router();
const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll"); // Only if payroll exists

// TOTAL EMPLOYEES
router.get("/stats", async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const officeEmployees = await Employee.countDocuments({ location: "Office" });
    const unitEmployees = await Employee.countDocuments({ location: "Unit" });

    const monthlyPayroll = await Payroll.aggregate([
      { $group: { _id: null, total: { $sum: "$totalSalary" } } }
    ]);

    res.json({
      totalEmployees,
      officeEmployees,
      unitEmployees,
      monthlyPayroll: monthlyPayroll[0]?.total || 0,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard stats error" });
  }
});

module.exports = router;

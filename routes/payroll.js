const router = require("express").Router();
const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");

// ======================
// GET PAYROLL BY ID
// ======================
router.get("/id/:id", async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payroll", err });
  }
});

// ======================
// GET ALL PAYROLLS
// ======================
router.get("/", async (req, res) => {
  try {
    const list = await Payroll.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payroll list" });
  }
});

// ======================
// CREATE PAYROLL (FINAL SNAPSHOT + INCREMENT APPLY)
// ======================
router.post("/", async (req, res) => {
  try {
    const { month, workingDays, employees } = req.body;

    const payrollEmployees = [];

    for (const emp of employees) {

      const incrementApplicable =
        emp.salaryIncrement > 0 &&
        emp.salaryIncrementFrom &&
        month >= emp.salaryIncrementFrom;

      const incrementAmount = incrementApplicable
        ? Number(emp.salaryIncrement)
        : 0;

      // ===============================
      // FINAL SALARY FOR PAYROLL SNAPSHOT
      // ===============================
      const finalBasicSalary =
        emp.salaryType === "monthly"
          ? Number(emp.basicSalary) + incrementAmount
          : Number(emp.basicSalary || 0);

      const finalDailyWage =
        emp.salaryType === "daily"
          ? Number(emp.dailyWage) + incrementAmount
          : Number(emp.dailyWage || 0);

      // ===============================
      // SAVE PAYROLL SNAPSHOT
      // ===============================
      payrollEmployees.push({
        ...emp,
        workingDays,
        basicSalary: finalBasicSalary,
        dailyWage: finalDailyWage,
        salaryIncrement: incrementAmount,     // ✅ visible in payroll
        incrementApplied: incrementApplicable // ✅ explicit flag
      });

      // ===============================
      // APPLY INCREMENT TO EMPLOYEE (ONCE)
      // ===============================
      if (incrementApplicable) {
        await Employee.findByIdAndUpdate(emp._id, {
          $push: {
            salaryIncrementHistory: {
              amount: emp.salaryIncrement,
              fromMonth: emp.salaryIncrementFrom,
              applied: true,
              appliedOn: new Date(),
            },
          },
          ...(emp.salaryType === "monthly"
            ? { basicSalary: finalBasicSalary }
            : { dailyWage: finalDailyWage }),
          salaryIncrement: 0,
          salaryIncrementFrom: null,
        });
      }
    }

    // ===============================
    // TOTAL PAYROLL AMOUNT
    // ===============================
    const total = payrollEmployees.reduce(
      (sum, e) => sum + Number(e.balanceSalary || 0),
      0
    );

    // ===============================
    // SAVE PAYROLL
    // ===============================
    const saved = await Payroll.create({
      month,
      workingDays,
      employees: payrollEmployees,
      totalPayrollAmount: total,
    });

    res.json(saved);
  } catch (err) {
    console.error("Payroll save error:", err);
    res.status(500).json({ message: "Error saving payroll", err });
  }
});

// ======================
// UPDATE PAYROLL
// ======================
router.put("/:id", async (req, res) => {
  try {
    const { month, workingDays, employees } = req.body;

    const total = employees.reduce(
      (sum, emp) => sum + Number(emp.balanceSalary || 0),
      0
    );

    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { month, workingDays, employees, totalPayrollAmount: total },
      { new: true }
    );

    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: "Error updating payroll", err });
  }
});

// ======================
// DELETE PAYROLL
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.json({ message: "Payroll deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting payroll" });
  }
});

// ======================
// PAYROLL HISTORY FOR EMPLOYEE
// ======================
router.get("/employee/:id", async (req, res) => {
  try {
    const payrolls = await Payroll.find({
      "employees._id": req.params.id,
    }).sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee payroll history" });
  }
});

module.exports = router;

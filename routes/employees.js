const router = require("express").Router();
const Employee = require("../models/Employee");

// =====================
// GET ALL EMPLOYEES
// =====================
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// ===============================
// ✅ GET SALARY INCREMENT HISTORY
// ⚠️ MUST BE ABOVE /:id
// ===============================
router.get("/:id/increment-history", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);

    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(emp.salaryIncrementHistory || []);
  } catch (err) {
    console.error("Increment history error:", err);
    res.status(500).json({ message: "Failed to fetch increment history" });
  }
});

// =====================
// GET EMPLOYEE BY ID
// =====================
router.get("/:id", async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee" });
  }
});

// =====================
// CREATE EMPLOYEE
// =====================
router.post("/", async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.json(emp);
  } catch (err) {
    console.error("Employee save error:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

// =====================
// UPDATE EMPLOYEE
// =====================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Employee not found" });

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating employee" });
  }
});

// =====================
// DELETE EMPLOYEE
// =====================
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting employee" });
  }
});

// =====================
// FILTER EMPLOYEES BY LOCATION
// =====================
router.get("/filter/:type", async (req, res) => {
  const type = req.params.type;

  let filter = {};
  if (type === "office") filter = { location: "Office" };
  if (type === "unit") filter = { location: "Unit" };

  const employees = await Employee.find(filter);
  res.json(employees);
});

module.exports = router;

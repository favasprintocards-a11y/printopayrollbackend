require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- DATABASE CONNECTION ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// ---------- ROUTES ----------
// ---------- ROUTES ----------
app.use("/api/auth", require("./routes/auth"));

app.use("/api/employees", require("./routes/employees"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/payroll", require("./routes/payroll"));
app.use("/api/dashboard", require("./routes/dashboard"));

// ----------- USER + BCRYPT -----------
const User = require("./models/User");
const bcrypt = require("bcryptjs");

// ---------- AUTO ADMIN CREATION ----------
async function createAdminUser() {
  try {
    const exists = await User.findOne({ email: "admin@printocards.com" });

    if (exists) {
      console.log("Admin already exists");
      return;
    }

    const hashed = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Admin",
      email: "admin@printocards.com",
      password: hashed,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email: admin@printocards.com");
    console.log("Password: Admin@123");
  } catch (err) {
    console.log("Error creating admin:", err);
  }
}

app.get("/", (req, res) => {
  res.send("Printo Payroll Backend is running 🚀");
});

createAdminUser();

// ---------- START SERVER ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

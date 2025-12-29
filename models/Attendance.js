const mongoose = require('mongoose');
const AttendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref:'Employee' },
  date: Date,
  checkIn: String, // ISO time or timestamp
  checkOut: String,
  hoursWorked: Number,
  status: { type: String, enum:['present','absent','leave','halfday'], default:'present' },
  note: String
});
module.exports = mongoose.model('Attendance', AttendanceSchema);

// compute salary from employee, attendanceSummary
function calculateMonthlySalary(employee, attendanceSummary, config = {}) {
  const basic = employee.basicSalary || 0;
  // attendanceSummary: { totalWorkingDays, presentDays, overtimeHours, lopDays }
  const dailyRate = basic / attendanceSummary.totalWorkingDays;
  const payableForAttendance = dailyRate * attendanceSummary.presentDays;
  const overtimePay = (employee.overtimeRate || (dailyRate/8)) * attendanceSummary.overtimeHours;
  const allowancesTotal = (employee.allowances || []).reduce((s,a)=> s+a.amount,0);
  const deductionsTotal = (employee.deductions || []).reduce((s,d)=> s+d.amount,0);
  const lopDeduction = dailyRate * (attendanceSummary.lopDays || 0);
  const gross = payableForAttendance + overtimePay + allowancesTotal;
  const totalDeductions = deductionsTotal + lopDeduction;
  const net = Math.max(0, gross - totalDeductions);
  return { basic, gross, totalDeductions, net, breakdown: { payableForAttendance, overtimePay, allowancesTotal, deductionsTotal, lopDeduction } };
}
module.exports = { calculateMonthlySalary };

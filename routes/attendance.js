const router = require('express').Router();
const Attendance = require('../models/Attendance');

// add attendance
router.post('/', async (req, res) => {
    const record = await Attendance.create(req.body);
    res.json(record);
});

// get attendance for month
router.get('/', async (req, res) => {
    const { employeeId, month, year } = req.query;

    const records = await Attendance.find({
        employee: employeeId,
        date: {
            $gte: new Date(year, month - 1, 1),
            $lte: new Date(year, month, 0)
        }
    });

    res.json(records);
});

module.exports = router;

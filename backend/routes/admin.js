const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const total = await Vote.countDocuments();
        const yes = await Vote.countDocuments({ choice: 'yes' });
        const no = await Vote.countDocuments({ choice: 'no' });

        res.json({ 
            token, 
            results: { yes, no, total }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'خطأ داخلي' });
    }
});

router.get('/verify', auth, async (req, res) => {
    try {
        const total = await Vote.countDocuments();
        const yes = await Vote.countDocuments({ choice: 'yes' });
        const no = await Vote.countDocuments({ choice: 'no' });
        res.json({ results: { yes, no, total } });
    } catch (error) {
        res.status(500).json({ message: 'خطأ داخلي' });
    }
});

router.get('/export', auth, async (req, res) => {
    try {
        const votes = await Vote.find().select('choice userId timestamp -_id');
        
        const { Parser } = require('json2csv');
        const fields = ['choice', 'userId', 'timestamp'];
        const parser = new Parser({ fields });
        const csv = parser.parse(votes);

        res.header('Content-Type', 'text/csv');
        res.attachment('votes.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'فشل تصدير البيانات' });
    }
});

module.exports = router;
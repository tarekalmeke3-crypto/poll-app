const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const rateLimit = require('express-rate-limit');

//const limiter = rateLimit({
    //windowMs: 15 * 60 * 1000,
    //max: 5,
    //message: { message: 'طلبات كثيرة جداً، الرجاء المحاولة لاحقاً' }
//});

router.get('/results', async (req, res) => {
    try {
        const total = await Vote.countDocuments();
        const yes = await Vote.countDocuments({ choice: 'yes' });
        const no = await Vote.countDocuments({ choice: 'no' });
        res.json({ yes, no, total });
    } catch (error) {
        res.status(500).json({ message: 'خطأ داخلي' });
    }
});

router.post('/vote', limiter, async (req, res) => {
    try {
        const { vote, userId } = req.body;

        if (!vote || !['yes', 'no'].includes(vote)) {
            return res.status(400).json({ message: 'اختيار غير صالح' });
        }
        if (!userId) {
            return res.status(400).json({ message: 'معرف المستخدم مطلوب' });
        }

        const existingVote = await Vote.findOne({ userId });
        if (existingVote) {
            return res.status(409).json({ message: 'لقد قمت بالتصويت مسبقاً' });
        }

        const newVote = new Vote({ choice: vote, userId });
        await newVote.save();

        const { broadcastResults } = require('../socket')(req.app.get('io'));
        await broadcastResults();

        res.status(201).json({ message: 'تم التصويت بنجاح' });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'خطأ داخلي في الخادم' });
    }
});

module.exports = router;
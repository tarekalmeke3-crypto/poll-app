const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const voteRoutes = require('./routes/vote');
const adminRoutes = require('./routes/admin');
const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// إنشاء حساب مشرف افتراضي (مرة واحدة)
async function initAdmin() {
    try {
        const Admin = require('./models/Admin');
        const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
        
        if (!adminExists && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
            const admin = new Admin({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            });
            await admin.save();
            console.log('✅ Admin user created');
        }
    } catch (error) {
        console.error('❌ Admin error:', error.message);
    }
}
initAdmin().catch(console.error);

// المسارات
app.use('/api', voteRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io
const { broadcastResults } = socketHandler(io);
app.set('broadcastResults', broadcastResults);

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
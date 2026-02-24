const Vote = require('../models/Vote');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    const broadcastResults = async () => {
        const total = await Vote.countDocuments();
        const yes = await Vote.countDocuments({ choice: 'yes' });
        const no = await Vote.countDocuments({ choice: 'no' });
        
        io.emit('results-update', { yes, no, total });
    };

    return { broadcastResults };
};
// Socket.IO event handling for real-time updates
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

module.exports = function (io) {
  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { user } = socket;
    console.log(`⚡ Socket connected: ${user.name} (${user.role})`);

    // Join user-specific room
    socket.join(`user:${user.id}`);

    // Join role-based rooms
    socket.join(`role:${user.role}`);

    // Staff and management join the staff room for shared updates
    if (['reservation_staff', 'kitchen_staff', 'management'].includes(user.role)) {
      socket.join('staff');
    }

    // Kitchen and management join kitchen room
    if (['kitchen_staff', 'management'].includes(user.role)) {
      socket.join('kitchen');
    }

    socket.on('disconnect', () => {
      console.log(`⚡ Socket disconnected: ${user.name}`);
    });
  });
};

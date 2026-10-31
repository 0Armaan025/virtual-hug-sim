const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });

  io.on('connection', (socket) => {
    console.log('Client:', socket.id);
    socket.on('join-room', (room) => { socket.join(room); console.log(socket.id, 'joined', room); });
    socket.on('leave-room', (room) => { socket.leave(room); console.log(socket.id, 'left', room); });
    socket.on('send-hug', (data) => {
      io.to(data.to).emit('receive-hug', { from: socket.id, hugType: data.hugType, message: data.message });
    });
    socket.on('disconnect', () => console.log('Disconnected:', socket.id));
  });

  httpServer.listen(3000, () => console.log('Local server: http://localhost:3000'));
});

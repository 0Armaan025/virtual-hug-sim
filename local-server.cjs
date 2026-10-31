const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      });
      res.end();
      return;
    }
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['*'] },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
  });

  // roomId -> { socketId: { id, name, character, x, y } }
  const rooms = {};

  io.on('connection', (socket) => {
    console.log('Client:', socket.id);

    socket.on('join-room', ({ room, player }) => {
      socket.join(room);
      if (!rooms[room]) rooms[room] = {};
      rooms[room][socket.id] = { id: socket.id, name: player.name, character: player.character, x: 50, y: 55 };
      console.log(socket.id, 'joined', room);
      io.to(room).emit('players-update', rooms[room]);
    });

    socket.on('move', ({ room, x, y, character }) => {
      if (!rooms[room] || !rooms[room][socket.id]) return;
      const p = rooms[room][socket.id];
      p.x = x; p.y = y;
      if (character) { p.character = character; p.name = character.name || p.name; }
      socket.to(room).emit('player-moved', { id: socket.id, x, y, character });
    });

    socket.on('send-hug', ({ room, to, variant, message, fromName }) => {
      io.to(to).emit('receive-hug', { from: socket.id, variant, message, fromName });
    });

    socket.on('disconnect', () => {
      for (const room of Object.keys(rooms)) {
        if (rooms[room][socket.id]) {
          delete rooms[room][socket.id];
          io.to(room).emit('player-left', socket.id);
          io.to(room).emit('players-update', rooms[room]);
        }
      }
      console.log('Disconnected:', socket.id);
    });
  });

  httpServer.listen(3000, () => console.log('Local server: http://localhost:3000'));
});

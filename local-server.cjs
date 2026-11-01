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

  // roomId -> { userId: { id, userId, name, character, x, y } }
  const rooms = {};
  // socket.id -> { room, userId } for quick cleanup
  const socketMeta = {};

  io.on('connection', (socket) => {
    console.log('Client:', socket.id);

    socket.on('join-room', ({ room, player }) => {
      // leave any previous room for this socket
      const meta = socketMeta[socket.id];
      if (meta && rooms[meta.room]) {
        delete rooms[meta.room][meta.userId];
        io.to(meta.room).emit('players-update', rooms[meta.room]);
        delete socketMeta[socket.id];
      }

      socket.join(room);
      if (!rooms[room]) rooms[room] = {};
      // dedupe by userId: replace any existing entry for this user in this room
      const existingUserId = Object.keys(rooms[room]).find(
        (uid) => rooms[room][uid].id === socket.id || (player.userId && rooms[room][uid].userId === player.userId)
      );
      if (existingUserId) delete rooms[room][existingUserId];

      const entry = {
        id: socket.id,
        userId: player.userId || socket.id,
        name: player.name,
        character: player.character,
        x: 50, y: 60,
      };
      rooms[room][entry.userId] = entry;
      socketMeta[socket.id] = { room, userId: entry.userId };
      console.log(socket.id, 'joined', room, entry.userId);
      io.to(room).emit('players-update', rooms[room]);
    });

    socket.on('move', ({ room, x, y, character, userId }) => {
      if (!rooms[room] || !rooms[room][userId]) return;
      const p = rooms[room][userId];
      p.x = x; p.y = y;
      if (character) { p.character = character; if (character.name) p.name = character.name; }
      socket.to(room).emit('player-moved', { userId: p.userId, x: p.x, y: p.y, character: p.character, name: p.name });
    });

    socket.on('send-hug', ({ room, to, variant, message, fromName }) => {
      // to is userId
      const targetSocketId = rooms[room] && rooms[room][to] ? rooms[room][to].id : null;
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive-hug', { from: socket.id, variant, message, fromName });
      }
    });

    socket.on('disconnect', () => {
      const meta = socketMeta[socket.id];
      if (meta && rooms[meta.room]) {
        delete rooms[meta.room][meta.userId];
        io.to(meta.room).emit('players-update', rooms[meta.room]);
      }
      delete socketMeta[socket.id];
      console.log('Disconnected:', socket.id);
    });
  });

  httpServer.listen(3000, () => console.log('Local server: http://localhost:3000'));
});

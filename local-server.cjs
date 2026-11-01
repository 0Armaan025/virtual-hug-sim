const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const origin = req.headers.origin || '*';
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      });
      res.end();
      return;
    }
    const origWriteHead = res.writeHead;
    res.writeHead = function(code, headers) {
      headers = headers || {};
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
      return origWriteHead.call(res, code, headers);
    };
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: (o, cb) => cb(null, o || '*'),
      methods: ['GET', 'POST'],
      allowedHeaders: ['*'],
      credentials: true,
    },
    transports: ['polling', 'websocket'],
    allowEIO3: true,
  });

  const rooms = {};
  const socketMeta = {};

  function roomsInfo() {
    const info = {};
    for (const [room] of Object.entries(rooms)) {
      const players = Object.values(rooms[room]);
      info[room] = {
        id: room,
        playerCount: players.length,
        onlineCount: players.filter(p => p.character).length,
      };
    }
    return info;
  }

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    io.emit('rooms-list', roomsInfo());

    socket.on('join-room', ({ room, player }) => {
      // Leave previous room
      const meta = socketMeta[socket.id];
      if (meta && rooms[meta.room]) {
        delete rooms[meta.room][meta.userId];
        if (Object.keys(rooms[meta.room]).length === 0) delete rooms[meta.room];
        io.to(meta.room).emit('players-update', rooms[meta.room] || {});
        io.emit('rooms-list', roomsInfo());
        delete socketMeta[socket.id];
      }

      socket.join(room);
      if (!rooms[room]) rooms[room] = {};
      // Deduplicate by userId
      const existingUserId = Object.keys(rooms[room]).find(
        (uid) => rooms[room][uid].id === socket.id || (player.userId && rooms[room][uid].userId === player.userId)
      );
      if (existingUserId) delete rooms[room][existingUserId];

      const entry = {
        id: socket.id,
        userId: player.userId || socket.id,
        name: player.name,
        gender: player.character?.gender || 'nonbinary',
        character: player.character,
        x: 50, y: 60,
      };
      rooms[room][entry.userId] = entry;
      socketMeta[socket.id] = { room, userId: entry.userId };
      console.log(socket.id, 'joined', room, entry.userId);
      io.to(room).emit('players-update', rooms[room]);
      io.emit('rooms-list', roomsInfo());
    });

    socket.on('move', ({ room, x, y }) => {
      const meta = socketMeta[socket.id];
      if (!meta) return;
      if (!rooms[meta.room] || !rooms[meta.room][meta.userId]) return;
      rooms[meta.room][meta.userId].x = x;
      rooms[meta.room][meta.userId].y = y;
      socket.to(meta.room).emit('player-moved', { userId: meta.userId, x: x, y: y });
    });

    socket.on('send-hug', ({ room, to, variant, message, fromName }) => {
      const meta = socketMeta[socket.id];
      const targetRoom = meta ? meta.room : room;
      const targetUserId = to;
      const targetSocketId = rooms[targetRoom] && rooms[targetRoom][targetUserId] ? rooms[targetRoom][targetUserId].id : null;
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive-hug', { from: socket.id, variant, message, fromName });
      }
    });

    socket.on('get-rooms', () => {
      socket.emit('rooms-list', roomsInfo());
    });

    socket.on('disconnect', () => {
      const meta = socketMeta[socket.id];
      if (meta && rooms[meta.room]) {
        delete rooms[meta.room][meta.userId];
        if (Object.keys(rooms[meta.room]).length === 0) delete rooms[meta.room];
        io.to(meta.room).emit('players-update', rooms[meta.room] || {});
        io.emit('rooms-list', roomsInfo());
      }
      delete socketMeta[socket.id];
      console.log('Disconnected:', socket.id);
    });
  });

  httpServer.listen(3000, () => console.log('Local server: http://localhost:3000'));
});

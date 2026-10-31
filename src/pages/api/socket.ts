import { Server } from 'socket.io';
import type { NextApiRequest } from 'next';
import { createSocketServer } from '@/lib/socket-server';

export default function handler(req: NextApiRequest, res: any) {
  // @ts-ignore
  if (res.socket && !res.socket.server.io) {
    console.log('Starting Socket.io server...');
    // @ts-ignore
    res.socket.server.io = createSocketServer(res.socket.server);
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

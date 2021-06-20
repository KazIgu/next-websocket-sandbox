import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    // eslint-disable-next-line no-console
    console.log('New Socket.io server...');

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket',
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default handler;

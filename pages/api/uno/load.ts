import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'GET') {
    if (io) {
      await io?.of('/uno').in(req.query.room).emit('load-request');
    }
    res.status(200);
  }

  if (req.method === 'POST') {
    const { body } = req;
    io?.of('/uno')?.in(body.room).emit('initial-state', body);

    // return othello
    res.status(201).json(body);
  }
};

export default handler;

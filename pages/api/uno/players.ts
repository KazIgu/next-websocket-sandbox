import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'POST') {
    const { body } = req;
    io?.of('/uno')?.in(body.room).emit('player-join', {
      players: body.players,
    });

    // return othello
    res.status(201).json(body);
  }
};

export default handler;

import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'POST') {
    // get othello
    const othello = req.body;

    // dispatch to channel "othello"
    io?.of('/othello')?.emit('othello', othello);

    // return othello
    res.status(201).json(othello);
  }
};

export default handler;

import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    // get othello
    const othello = req.body;

    // dispatch to channel "othello"
    res?.socket?.server?.io?.emit('othello', othello);

    // return othello
    res.status(201).json(othello);
  }
};

export default handler;

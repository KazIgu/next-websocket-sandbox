import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'POST') {
    const { body } = req;
    await io?.of('/uno').in(body.room).emit('discard', body);

    await res.status(200).json(body);
  }
};

export default handler;

import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'GET') {
    const ids = await io?.of('/uno').in(req.query.room).allSockets();

    await io?.of('/uno').in(req.query.room).emit('viewer-join', {
      viewers: Array.from(ids?.values()),
    });

    await res.status(200).json({ viewers: Array.from(ids?.values()) });
  }
};

export default handler;

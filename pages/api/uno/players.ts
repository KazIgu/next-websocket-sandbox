import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'GET') {
    const ids = await io?.of('/uno')?.allSockets();

    await io?.of('/uno').emit('join', {
      players: Array.from(ids?.values()),
    });

    await res.status(200).json({ players: Array.from(ids?.values()) });
  }
};

export default handler;

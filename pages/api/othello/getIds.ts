import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'GET') {
    const ids = await io?.of('/othello')?.allSockets();

    await io?.of('/othello').emit('joinMember', {
      ids: Array.from(ids?.values()),
    });

    await res.status(200).json({ ids: Array.from(ids?.values()) });
  }
};

export default handler;

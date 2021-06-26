import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'GET') {
    if (io) {
      await io?.of('/uno').emit('status', true);
    }
    await res.status(200).json({ message: '' });
  }
};

export default handler;

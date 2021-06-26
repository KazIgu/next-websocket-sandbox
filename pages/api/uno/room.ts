import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

const handler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const io = res?.socket?.server?.io;

  if (req.method === 'POST') {
    const { room, id } = req.body;

    if (io) {
      await io?.of('/uno').sockets.get(id)?.join(room);
      await io?.of('/uno').in(room).emit('room', true);
    }
    await res.status(200).json({ room });
  }
};

export default handler;

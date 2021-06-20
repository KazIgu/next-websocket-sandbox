import { NextPage } from 'next';
import Head from 'next/head';
import { Board } from '@/components/atoms/Board';
import { PieceType, Point, Pieces } from '@/types';
import { getPutablePlace, setInitialPieces, putPiece } from '@/utils/piece';
import { pieceTypes } from '@/constants';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import styles from '../styles/Home.module.css';

type Props = {

}

export const Home: NextPage<Props> = () => {
  const [turn, setTurn] = useState<PieceType>(pieceTypes.BLACK);
  const [pieces, setPieces] = useState(setInitialPieces());
  const [putableMap, setPutableMap] = useState(getPutablePlace(pieces, turn));
  const [myturn, setMyturn] = useState<PieceType>(pieceTypes.BLACK);

  const [connected, setConnected] = useState<boolean>(false);

  // eslint-disable-next-line consistent-return
  useEffect((): any => {
    const socket = io('/', {
      path: '/api/socket',
    });

    socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('SOCKET CONNECTED!', socket.id);
      setConnected(true);
    });

    socket.on('othello', (othello) => {
      setPieces(othello.nextPieces);
      setPutableMap(othello.nextPutableMap);
      setTurn(othello.nextTurn);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(connected);
  }, [connected]);

  const reverse = (reversiblePieces: Point[]): Pieces => {
    const currentPieces: Pieces = [...pieces];
    reversiblePieces.map((piece) => {
      currentPieces[piece[0]][piece[1]] = turn;
      setPieces(currentPieces);
      return piece;
    });
    return currentPieces;
  };

  const handleClick = async (row: number, col: number) => {
    if (turn !== myturn) return;
    const currentPieces = [...pieces];
    currentPieces[row][col] = turn;
    const reversiblePieces = putPiece(pieces, turn, [row, col]);
    const nextPieces = reverse(reversiblePieces);
    const nextTurn = turn === pieceTypes.BLACK ? pieceTypes.WHITE : pieceTypes.BLACK;
    const nextPutableMap = getPutablePlace(currentPieces, nextTurn);
    setPutableMap(nextPutableMap);
    setTurn(nextTurn);

    await fetch('/api/othello', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nextTurn,
        nextPutableMap,
        nextPieces,
      }),
    });
  };

  const toggleMyturn = () => {
    setMyturn(myturn === pieceTypes.BLACK ? pieceTypes.WHITE : pieceTypes.BLACK);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {turn === myturn && 'あなたのターン'}
          {turn}
          {'　'}
          <button type="button" onClick={toggleMyturn}>自分の色変更</button>
        </div>
        <Board pieces={pieces} putableMap={putableMap} handleClick={handleClick} />
      </main>
    </div>
  );
};

export default Home;

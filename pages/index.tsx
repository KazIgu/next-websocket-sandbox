import { NextPage } from 'next';
import Head from 'next/head';
import { Board } from '@/components/atoms/Board';
import { PieceType, Point } from '@/types';
import { getPutablePlace, setInitialPieces, putPiece } from '@/utils/piece';
import { pieceTypes } from '@/constants';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

type Props = {

}

export const Home: NextPage<Props> = () => {
  const [turn, setTurn] = useState<PieceType>(pieceTypes.BLACK);
  const [pieces, setPieces] = useState(setInitialPieces());
  const [putableMap, setPutableMap] = useState(getPutablePlace(pieces, turn));

  const reverse = async (reversiblePieces: Point[]) => {
    const currentPieces = [...pieces];
    reversiblePieces.map((piece) => {
      currentPieces[piece[0]][piece[1]] = turn;
      setPieces(currentPieces);
      return piece;
    });
  };

  const handleClick = async (row: number, col: number) => {
    const currentPieces = [...pieces];
    currentPieces[row][col] = turn;
    const reversiblePieces = putPiece(pieces, turn, [row, col]);
    await reverse(reversiblePieces);
    const nextTurn = turn === pieceTypes.BLACK ? pieceTypes.WHITE : pieceTypes.BLACK;
    setPutableMap(getPutablePlace(currentPieces, nextTurn));
    setTurn(nextTurn);
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
          {turn}
        </div>
        <Board pieces={pieces} putableMap={putableMap} handleClick={handleClick} />
      </main>
    </div>
  );
};

export default Home;

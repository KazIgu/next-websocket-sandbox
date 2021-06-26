import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { createAllCards, detectMyTurn, pick } from '@/utils/uno';
import { initialPickCount, statusTypes } from '@/constants/uno';
import { Card, StatusType } from '@/types/uno';
import { UnoCardList } from '@/components/molecules/UnoCardList';
import { UnoCard } from '@/components/atoms/UnoCard';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'; // TODO:
import { Debug } from '@/components/_debugs/Uno';

export const Uno: NextPage = () => {
  const [status, setStatus] = useState<StatusType>(statusTypes.PREPARATION);
  // player TODO: 今は全員player扱いだから選べるようにしなきゃ
  const [players, setPlayers] = useState<string[]>([]);
  // 自分のsocket id
  const [me, setMe] = useState<string>('');
  // ゲーム上のターン
  const [turn, setTurn] = useState<number>(0);
  // 自分のターンか
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  // socket
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  // 山札
  const [deck, setDeck] = useState<Card[]>(createAllCards());
  // 手札
  const [hand, setHand] = useState<Card[]>([]);
  // 場札
  const [layout, setLayout] = useState<Card[]>([]);
  // 選択した手札のカードのindex(重複カードがあるからindex)
  const [selectedCardIndexes, setSelectedCardIndexes] = useState<number[]>([]);

  useEffect((): any => {
    if (!socket) {
      setSocket(io('/uno', {
        path: '/api/socket',
      }));
    }
    return () => socket?.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', async () => {
      // eslint-disable-next-line no-console
      console.log('SOCKET CONNECTED!', socket.id);
      const playersResponse = await axios.get('/api/uno/players');
      setMe(socket.id);
      if (status !== statusTypes.PLAYING) {
        setPlayers(playersResponse.data.players);
      }
    });

    // join member
    socket.on('join', (data) => {
      // eslint-disable-next-line no-console
      console.log('join -----');
      if (status !== statusTypes.PLAYING) {
        setPlayers(data.players);
      }
    });

    socket.on('prepare', (data) => {
      // eslint-disable-next-line no-console
      console.log('prepare -----');
      setStatus(statusTypes.PREPARE);
      setDeck(data.deck);
      setPlayers(data.players);
      if (detectMyTurn(data.players, data.turn, me)) {
        const [handCards, deckCards] = pick(data.deck, initialPickCount);
        setHand(handCards);
        setDeck(deckCards);
        axios.post('/api/uno/prepare', {
          deck: deckCards,
          players: data.players,
          turn: data.turn + 1,
        });
        if (data.turn === data.players.length - 1) {
          // start
          const [layoutCards, _deckCards] = pick(deckCards, 1);
          axios.post('/api/uno/start', {
            layout: layoutCards,
            deck: _deckCards,
          });
        }
      }
    });

    // start
    socket.on('start', (data: {
        layout: Card[], deck: Card[]
      }) => {
      // eslint-disable-next-line no-console
      console.log('start -----');
      setStatus(statusTypes.PLAYING);
      setDeck(data.deck);
      setLayout(data.layout);
    });

    // draw
    socket.on('draw', (data) => {
      // eslint-disable-next-line no-console
      console.log('draw -----');
      setDeck(data.deck);
    });

    // next turn
    socket.on('nextTurn', (data) => {
      // eslint-disable-next-line no-console
      console.log('nextTurn -----');
      setTurn(data.turn);
    });

    // discard
    socket.on('discard', (data) => {
      // eslint-disable-next-line no-console
      console.log('discard -----');
      setLayout([...layout, ...data.layout]);
      // setTurn(data.turn);
    });
  }, [socket, me, status, layout]);

  useEffect(() => {
    setIsMyTurn(detectMyTurn(players, turn, me));
  }, [players, turn, me]);

  const start = () => {
    setIsMyTurn(detectMyTurn(players, turn, me));
    axios.post('/api/uno/prepare', {
      deck: createAllCards(),
      players,
      turn: 0,
    });
  };

  const draw = () => {
    if (!isMyTurn) return;
    const [handCards, deckCards] = pick(deck, 1);
    setHand([...hand, ...handCards]);
    axios.post('/api/uno/draw', {
      deck: deckCards,
    });
  };

  const selectCard = (index: number) => {
    const indexes = selectedCardIndexes.some((i) => i === index)
      ? selectedCardIndexes.filter((i) => i !== index)
      : [...selectedCardIndexes, index];
    setSelectedCardIndexes(indexes);
  };

  const discard = () => {
    if (!isMyTurn) return;
    if (selectedCardIndexes.length < 1) return;
    const cards = hand.filter((card, i) => !selectedCardIndexes.some((j) => j === i));
    // const discardedCards = hand.filter((card, i) => selectedCardIndexes.some((j) => j === i));
    const discardedCards = selectedCardIndexes.map((i) => hand[i]);
    setSelectedCardIndexes([]);
    setHand(cards);
    axios.post('/api/uno/discard', {
      layout: [...layout, ...discardedCards],
    });
  };

  const turnEnd = () => {
    if (!isMyTurn) return;
    axios.post('/api/uno/nextTurn', {
      turn: turn === players.length - 1 ? 0 : turn + 1,
    });
  };

  return (
    <>
      <Head>
        <title>UNO</title>
        <meta httpEquiv="Content-Security-Policy" content="default-src data: gap://* file://* https://ssl.gstatic.com *; img-src 'self' * data:; style-src 'self' 'unsafe-inline' *; script-src 'self' 'unsafe-eval' 'unsafe-inline' *; connect-src 'self' * ws://* wss://*;" />
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Debug
          status={status}
          players={players}
          playersLength={players.length}
          turn={turn}
          isMyTurn={isMyTurn}
          deck={deck.length}
          layout={layout.length}
          hand={hand.length}
        />
        <div>
          {deck[0] && <UnoCard card={deck[0]} reverse onClick={draw} />}
        </div>
        <div className="layout">
          {layout.length && <UnoCard card={layout[layout.length - 1]} />}
        </div>
        <UnoCardList
          cards={hand}
          selectCard={selectCard}
          selectedCardIndexes={selectedCardIndexes}
        />
        <div>
          <button type="button" onClick={discard}>選択した手札を出す</button>
          <button type="button" onClick={turnEnd}>ターン終了</button>
        </div>
        {players[turn] === me && (<div style={{ fontSize: 30 }}>my turn</div>) }
        {status === statusTypes.PREPARATION && (
          <button type="button" onClick={start}>スタート</button>
        )}
      </main>
    </>
  );
};

export default Uno;

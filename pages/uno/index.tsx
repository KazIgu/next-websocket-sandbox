import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import {
  createAllCards, detectMyTurn, detectDiscardable, pick, getNumberOfDraw, getNextTurn,
} from '@/utils/uno';
import {
  cardColors, cardTypes, initialPickCount, statusTypes,
} from '@/constants/uno';
import { Card, CardColor, StatusType } from '@/types/uno';
import { UnoCardList } from '@/components/molecules/UnoCardList';
import { UnoLayoutCards } from '@/components/molecules/UnoLayoutCards';
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
  // Draw
  const [numberOfDraw, setNumberOfDraw] = useState<number>(0);
  // Reverse
  const [modeReverse, setModeReverse] = useState<boolean>(false);

  useEffect((): any => {
    if (!socket) {
      setSocket(io('/uno', {
        path: '/api/socket',
      }));
    }
    return () => socket?.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConnect = useCallback(async () => {
    if (!socket) return;
    // eslint-disable-next-line no-console
    console.log('SOCKET CONNECTED!', socket.id);
    const playersResponse = await axios.get('/api/uno/players');
    setMe(socket.id);
    if (status !== statusTypes.PLAYING) {
      setPlayers(playersResponse.data.players);
    }
  }, [socket, status]);

  const onJoin = (data: {
    players: string[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('join -----');
    if (status !== statusTypes.PLAYING) {
      setPlayers(data.players);
    }
  };

  const onPrepare = (data: {
    deck: Card[],
    turn: number,
    players: string[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('prepare -----');
    setStatus(statusTypes.PREPARE);
    setDeck(data.deck);
    setPlayers(data.players);
    if (detectMyTurn(data.players, data.turn, me)) {
      const [handCards, deckCards] = pick(data.deck, initialPickCount);
      setHand(handCards);
      setDeck(deckCards);
      if (data.turn === data.players.length - 1) {
        // start
        const [layoutCards, _deckCards] = pick(deckCards, 1);
        axios.post('/api/uno/start', {
          layout: layoutCards,
          deck: _deckCards,
          players: data.players,
          turn: 0,
        });
      } else {
        axios.post('/api/uno/prepare', {
          deck: deckCards,
          players: data.players,
          turn: data.turn + 1,
        });
      }
    }
  };

  const onStart = (data: {
    layout: Card[], deck: Card[], turn: number, players: string[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('start -----');
    setStatus(statusTypes.PLAYING);
    setDeck(data.deck);
    setLayout(data.layout);
    setTurn(data.turn);
    setPlayers(data.players);
  };

  const onDiscard = (data: {
    layout: Card[]
    numberOfDraw: number
    modeReverse: boolean
  }) => {
    // eslint-disable-next-line no-console
    console.log('discard -----');
    setLayout(data.layout);
    setNumberOfDraw(data.numberOfDraw);
    setModeReverse(data.modeReverse);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', async () => {
      onConnect();
    });
    if (!me) return;

    // join member
    socket.on('join', (data) => {
      onJoin(data);
    });

    socket.on('prepare', (data) => {
      onPrepare(data);
    });

    // start
    socket.on('start', (data: {
        layout: Card[], deck: Card[], turn: number, players: string[]
      }) => {
      onStart(data);
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
      onDiscard(data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, me]);

  const start = () => {
    setIsMyTurn(detectMyTurn(players, turn, me));
    axios.post('/api/uno/prepare', {
      deck: createAllCards(),
      players,
      turn: 0,
    });
  };

  const turnEnd = (skip = false, toggleReverse = false) => {
    if (!isMyTurn) return;
    if (numberOfDraw > 0) return;
    axios.post('/api/uno/nextTurn', {
      turn: getNextTurn({
        turn,
        players,
        reverse: toggleReverse ? !modeReverse : modeReverse,
        skip,
      }),
    });
  };

  const discard = (index: number) => {
    if (!isMyTurn) return;
    if (numberOfDraw > 0) {
      // eslint-disable-next-line no-alert
      alert(`山札から${numberOfDraw}枚引いてください`);
      return;
    }
    const discardCard = hand[index];
    if (!detectDiscardable(layout, discardCard)) return;
    if (discardCard.type === cardTypes.WILD || discardCard.type === cardTypes.WILD_DRAW_FOUR) {
      // eslint-disable-next-line no-alert
      const color = prompt(`カラーを[${cardColors.BLUE}, ${cardColors.GREEN}, ${cardColors.RED}, ${cardColors.YELLOW}]から選択してください`);
      discardCard.color = `${color}` as CardColor;
    }
    const remainingCard = hand.filter((card, i) => i !== index);
    setHand(remainingCard);
    axios.post('/api/uno/discard', {
      layout: [...layout, discardCard],
      numberOfDraw: getNumberOfDraw(discardCard),
      modeReverse: discardCard.type === cardTypes.REVERSE ? !modeReverse : modeReverse,
    });
    turnEnd(discardCard.type === cardTypes.SKIP, discardCard.type === cardTypes.REVERSE);
  };

  const draw = () => {
    if (!isMyTurn) return;
    if (numberOfDraw > 0) {
      setNumberOfDraw(numberOfDraw - 1);
    }
    const [handCards, deckCards] = pick(deck, 1);
    setHand([...handCards, ...hand]);
    setDeck(deckCards);
    axios.post('/api/uno/draw', {
      deck: deckCards,
    });
  };

  useEffect(() => {
    const myTurn = detectMyTurn(players, turn, me);
    setIsMyTurn(myTurn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, turn, me]);

  const onClickTurnEnd = () => {
    turnEnd();
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
        {status === statusTypes.PLAYING && (
          <>
            <div>
              {deck[0] && <UnoCard card={deck[0]} reverse onClick={draw} />}
            </div>
            <UnoLayoutCards
              cards={layout}
            />
            <UnoCardList
              cards={hand}
              discard={discard}
            />
            <div>
              <button type="button" onClick={onClickTurnEnd}>ターン終了</button>
            </div>
            {players[turn] === me && (<div style={{ fontSize: 30 }}>my turn</div>) }
          </>
        )}

        {status === statusTypes.PREPARATION && (
          <button type="button" onClick={start}>スタート</button>
        )}

        {process.env.NODE_ENV === 'development' && (
          <Debug
            modeReverse={modeReverse}
            numberOfDraw={numberOfDraw}
            status={status}
            players={players}
            playersLength={players.length}
            turn={turn}
            isMyTurn={isMyTurn}
            deck={deck.length}
            layout={layout.length}
            hand={hand.length}
          />
        )}
      </main>
    </>
  );
};

export default Uno;

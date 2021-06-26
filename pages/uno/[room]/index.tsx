import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import {
  createAllCards, detectMyTurn, detectDiscardable, pick, getNumberOfDraw, getNextTurn,
} from '@/utils/uno';
import {
  cardColors, cardTypes, initialPickCount, statusTypes,
} from '@/constants/uno';
import {
  Card, CardColor, Player, StatusType,
} from '@/types/uno';
import { UnoCardList } from '@/components/molecules/UnoCardList';
import { UnoLayoutCards } from '@/components/molecules/UnoLayoutCards';
import { UnoCard } from '@/components/atoms/UnoCard';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'; // TODO:
import { Debug } from '@/components/_debugs/Uno';

export const Uno: NextPage = () => {
  const [status, setStatus] = useState<StatusType>(statusTypes.PREPARATION);
  // 閲覧者(player含む)
  const [viewers, setViewers] = useState<string[]>([]);
  // player
  const [players, setPlayers] = useState<Player[]>([]);
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

  const [hasPrepared, setHasPrepared] = useState<boolean>(false);
  const router = useRouter();
  const { room } = router.query;
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
    if (!socket || !room) return;
    // eslint-disable-next-line no-console
    console.log('SOCKET CONNECTED!', socket.id);

    await axios.post('/api/uno/room', {
      room,
      id: socket.id,
    });
    setMe(socket.id);

    const playersResponse = await axios.get('/api/uno/viewer', {
      params: {
        room,
      },
    });
    if (status !== statusTypes.PLAYING) {
      setViewers(playersResponse.data.viewers);
      await axios.post('/api/uno/players', {
        players: [
          ...players, {
            id: socket.id,
            name: 'ゲスト',
          }],
        room,
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, room, players, players.length]);

  const onViewerJoin = useCallback(async (data: {
    viewers: string[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('viewer join -----');
    setViewers(data.viewers);
    // TODO: playersの共有処理が雑
    axios.post('/api/uno/players', {
      players,
      room,
    });
  }, [players, room]);

  const onPlayerJoin = useCallback((data: {
    players: Player[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('player join -----');
    if (status !== statusTypes.PLAYING) {
      const signiningPlayer = [...players, ...data.players]
        .filter((p) => viewers.some((v) => v === p.id));
      const uniquePlayer = signiningPlayer
        .filter((item, index, array) => array.findIndex((item2) => item.id === item2.id) === index);
      setPlayers(uniquePlayer);
    }
  }, [players, status, viewers]);

  const onPrepare = useCallback((data: {
    deck: Card[],
    turn: number,
    players: Player[]
  }) => {
    // eslint-disable-next-line no-console
    console.log('prepare -----');
    setStatus(statusTypes.PREPARE);
    setDeck(data.deck);
    setPlayers(data.players);
    if (detectMyTurn(data.players, data.turn, me)) {
      if (hasPrepared) return;
      setHasPrepared(true);
      const [handCards, deckCards] = pick(data.deck, initialPickCount);
      setHand(handCards);
      setDeck(deckCards);
      setTurn(data.turn);
      if (data.turn === data.players.length - 1) {
        // start
        const [layoutCards, _deckCards] = pick(deckCards, 1);
        axios.post('/api/uno/start', {
          layout: layoutCards,
          deck: _deckCards,
          players: data.players,
          turn: 0,
          room,
        });
      } else {
        axios.post('/api/uno/prepare', {
          deck: deckCards,
          players: data.players,
          turn: data.turn + 1,
          room,
        });
      }
    }
  }, [hasPrepared, me, room]);

  const onStart = (data: {
    layout: Card[], deck: Card[], turn: number, players: Player[]
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
    if (!socket || !room) return;
    socket.on('connect', async () => {
      onConnect();
    });
    if (!me) return;

    /**
     * sockets
     * TODO: 散らかりすぎてるからuseSateをやめてuseReducerにしたい
     * できればsocketを別ファイルにしたい
     */

    // join viewer
    socket.off('viewer-join');
    socket.on('viewer-join', (data) => {
      onViewerJoin(data);
    });

    // join player
    socket.off('player-join');
    socket.on('player-join', (data) => {
      onPlayerJoin(data);
    });

    // prepare
    socket.off('prepare');
    socket.on('prepare', (data) => {
      onPrepare(data);
    });

    // start
    socket.off('start');
    socket.on('start', (data: {
      layout: Card[], deck: Card[], turn: number, players: Player[]
    }) => {
      onStart(data);
    });

    // draw
    socket.off('draw');
    socket.on('draw', (data) => {
      // eslint-disable-next-line no-console
      console.log('draw -----');
      setDeck(data.deck);
    });

    // next turn
    socket.off('nextTurn');
    socket.on('nextTurn', (data) => {
      // eslint-disable-next-line no-console
      console.log('nextTurn -----');
      setTurn(data.turn);
    });

    // discard
    socket.off('discard');
    socket.on('discard', (data) => {
      onDiscard(data);
    });
  }, [socket, me, room, onConnect, onViewerJoin, onPlayerJoin, onPrepare]);

  const start = () => {
    setIsMyTurn(detectMyTurn(players, turn, me));
    axios.post('/api/uno/prepare', {
      deck: createAllCards(),
      players,
      turn: 0,
      room,
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
      room,
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
      room,
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
      room,
    });
  };

  useEffect(() => {
    if (status !== statusTypes.PLAYING) return;
    const myTurn = detectMyTurn(players, turn, me);
    setIsMyTurn(myTurn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, turn, me, status]);

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
      {/* <button type="button" onClick={test}>test</button> */}
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
            {players[turn].id === me && (<div style={{ fontSize: 30 }}>my turn</div>) }
          </>
        )}

        {status === statusTypes.PREPARATION && (
          <>
            <div>
              {players.length}
              人参加
            </div>
            <button type="button" onClick={start}>スタート</button>
          </>
        )}

        {process.env.NODE_ENV === 'development' && (
          <Debug
            viewersLength={viewers.length}
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

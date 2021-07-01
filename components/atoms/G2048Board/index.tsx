import { Block } from '@/types/2048';
import {
  FC, useEffect, useRef, useState,
} from 'react';
import { useSwipeable } from 'react-swipeable';
import { G2048Block } from '@/components/atoms/G2048Block';
import { Wrapper, Container, Item } from './styles';

type Props = {
  blocks: Block[]
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  onSwipeDown: () => void
}
const area :any[][] = [...Array(4)].map(() => [...Array(4)].map(() => ''));
export const G2048Board: FC<Props> = ({
  blocks,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    onSwipedUp: onSwipeUp,
    onSwipedDown: onSwipeDown,
    delta: 10,
    preventDefaultTouchmoveEvent: false,
  });
  const [size, setSize] = useState<number>(0);

  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(itemRef.current?.clientWidth || 0);
  }, []);

  return (
    <Wrapper
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...handlers}
    >
      <Container>
        {area.map((rows, row) => (
          rows.map((block, col) => (
            <Item
            // eslint-disable-next-line react/no-array-index-key
              key={`area-${row}${col}`}
              ref={row === 0 && col === 0 ? itemRef : null}
            />
          ))
        ))}
      </Container>
      {blocks.map((block) => (
        <G2048Block
          key={block.id}
          block={block}
          size={size}
        />
      ))}
    </Wrapper>
  );
};

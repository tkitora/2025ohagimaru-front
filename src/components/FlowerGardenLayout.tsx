// src/components/FlowerGardenLayout.tsx
import type { FlowerList } from '../types';
import type { FlowerData } from '../hooks/useFlowers';
import { FLOWER_POSITIONS } from '../constants/flowerPositions';

// 画像を一括でインポート
const images = import.meta.glob('../assets/flowers/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const getImageSrc = (type: string): string | undefined => {
  const match = Object.entries(images).find(([path]) => path.includes(`${type}.png`));
  return match?.[1];
};

interface FlowerGardenLayoutProps {
  flowers: FlowerData[];
  onFlowerClick: (flower: FlowerList) => void;
}

// 花の数に応じた画像サイズを計算
const getImageSize = (count: number) => {
  if (count <= 5) return 'w-90 h-90';
  if (count <= 10) return 'w-72 h-72';
  if (count <= 20) return 'w-64 h-64';
  if (count <= 40) return 'w-42 h-42';
  if (count <= 60) return 'w-36 h-36';
  if (count <= 80) return 'w-32 h-32';
  return 'w-28 h-28';
};

const FlowerGardenLayout = ({ flowers, onFlowerClick }: FlowerGardenLayoutProps) => {
  const imageSize = getImageSize(flowers.length);

  return (
    <>
      {flowers.slice(0, FLOWER_POSITIONS.length).map((flower, index) => {
        const imgSrc = getImageSrc(flower.selected_flower);
        const position = FLOWER_POSITIONS[index];

        if (!imgSrc || !position) return null;

        return (
          <img
            key={flower.id}
            src={imgSrc}
            alt={flower.selected_flower}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${imageSize} transition-transform duration-500 hover:scale-110 cursor-pointer z-10`}
            style={{ top: position.top, left: position.left }}
            onClick={() => onFlowerClick({ flowertype: flower.selected_flower, name: '' })}
          />
        );
      })}
    </>
  );
};

export default FlowerGardenLayout;
// src/pages/FlowerGarden.tsx
import { useState } from 'react';
import backgroundImage from '../assets/Home/gardenBackground.png';
import RotatingSun from '../components/RotatingSun';
import FlowerPopup from '../components/FlowerDetail';
import FlowerGardenLayout from '../components/FlowerGardenLayout';
import { useFlowers } from '../hooks/useFlowers';
import { useLatestFlower } from '../hooks/useLatestFlower';
import type { FlowerList } from '../types';

function FlowerGardenPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerList | null>(null);
  
  const { flowers, error } = useFlowers();
  const { showLargeFlower, latestFlowerType } = useLatestFlower();

  const handleOpenPopup = (flower: FlowerList) => {
    setSelectedFlower(flower);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedFlower(null);
  };

  return (
    <div
      className="w-screen h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <RotatingSun />

      <a href="/visualdictionary" className="absolute top-5 right-5 z-20 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300">
        図鑑へ
      </a>

      {error && (
        <div className="absolute top-5 left-5 z-20 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      )}

      <div className="absolute inset-0">
        {showLargeFlower && latestFlowerType ? (
          <img
            src={getImageSrc(latestFlowerType)}
            alt={latestFlowerType}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 z-40"
          />
        ) : (
          <FlowerGardenLayout flowers={flowers} onFlowerClick={handleOpenPopup} />
        )}
      </div>

      {isPopupOpen && selectedFlower && (
        <FlowerPopup flower={selectedFlower} onClose={handleClosePopup} />
      )}
    </div>
  );
}

// `getImageSrc` は `FlowerGardenLayout.tsx` に移動しましたが、
// `latestFlowerType` の画像表示のためにここにも必要です。
const images = import.meta.glob('../assets/flowers/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const getImageSrc = (type: string): string | undefined => {
  const match = Object.entries(images).find(([path]) => path.includes(`${type}.png`));
  return match?.[1];
};

export default FlowerGardenPage;
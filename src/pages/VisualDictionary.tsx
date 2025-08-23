import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import backgroundImage from '../assets/VisualDictionary/VisualDictionaryBackGround.png';
import cardImage from '../assets/VisualDictionary/VisualDictionaryCard.png';
import FlowerPopup from '../components/FlowerDetail';
import type { FlowerList } from '../types';

// データの型を定義
interface FlowerData {
  flowertype: string;
  name: string;
}

// アセットフォルダ内の花画像をまとめてインポート
const images = import.meta.glob('../assets/flowers/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// ファイル名から画像ソースを取得するヘルパー関数
const getImageSrc = (type: string): string | undefined => {
  const match = Object.entries(images).find(([path]) =>
    path.endsWith(`/${type}.png`)
  );
  return match?.[1];
};

function VisualDictionary() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerList | null>(null);

  // ポップアップを開く関数
  const handleOpenPopup = (flower: FlowerList) => {
    setSelectedFlower(flower);
    setIsPopupOpen(true);
  };

  // ポップアップを閉じる関数
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedFlower(null);
  };

  useEffect(() => {
    const fetchFlowers = async () => {
      // Supabaseからflowertypeとnameを取得
      const { data, error: fetchError } = await supabase
        .from('flowerlist')
        .select('flowertype, name')
        .limit(13);

      if (fetchError) {
        setError(fetchError.message);
        console.error('データの読み取りエラー: ', fetchError.message);
        return;
      }
      setFlowers(data as FlowerData[]);
    };

    fetchFlowers();
  }, []);

  return (
    // ▼▼▼ overflow-hiddenに変更し、paddingを少し調整 ▼▼▼
    <div
      className="w-screen h-screen relative flex flex-col items-center justify-center overflow-hidden p-4"
      style={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* 背景画像 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* 右上の「花畑へ」ボタン */}
      <div className="absolute top-5 right-5 z-20">
        <a 
          href="/flowergarden" 
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-800 transition-colors duration-300"
        >
          花畑へ
        </a>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="absolute top-5 left-5 z-20 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* ▼▼▼ 3つの行を1つのコンテナに統合 ▼▼▼ */}
      <div className="relative z-10 flex flex-wrap justify-center items-center gap-2 md:gap-4 max-w-6xl">
        {flowers.map((flower, index) => {
          const imgSrc = getImageSrc(flower.flowertype);
          if (!imgSrc) {
            console.warn(`画像が見つかりません: ${flower.flowertype}.png`);
            return null;
          }
          
          const flowerDetailData: FlowerList = {
            flowertype: flower.flowertype,
            name: flower.name,
          };

          return (
            <div
              key={index}
              className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0 flex flex-col items-center justify-center p-2
              transition-transform duration-300 hover:scale-110 cursor-pointer"
              onClick={() => handleOpenPopup(flowerDetailData)}
            >
              <img
                src={cardImage}
                alt="Card Background"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <img
                src={imgSrc}
                alt={flower.flowertype}
                className="relative z-10 w-2/3 h-2/3 object-contain"
              />
              <span className="relative z-10 text-center font-bold text-base md:text-lg mt-1 text-amber-900">
                {flower.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ポップアップ表示 */}
      {isPopupOpen && selectedFlower && (
        <FlowerPopup flower={selectedFlower} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default VisualDictionary;
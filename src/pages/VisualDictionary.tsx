import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import backgroundImage from '../assets/VisualDictionary/VisualDictionaryBackGround.png';
import cardImage from '../assets/VisualDictionary/VisualDictionaryCard.png';
import FlowerPopup from '../components/FlowerDetail'; // Popupコンポーネントをインポート
import type { FlowerList } from '../types'; // 型定義をインポート

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
    // ファイル名が完全に一致するように修正
    path.endsWith(`/${type}.png`)
  );
  return match?.[1];
};

function VisualDictionary() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // ▼▼▼ ここから追加 ▼▼▼
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
  // ▲▲▲ ここまで追加 ▲▲▲

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

  // 花のデータを3つのグループに分割
  const row1Flowers = flowers.slice(0, 4);
  const row2Flowers = flowers.slice(4, 9);
  const row3Flowers = flowers.slice(9, 13);

  // 花のカードを描画する関数
  const renderFlowerCards = (flowers: FlowerData[]) => {
    return flowers.map((flower, index) => {
      const imgSrc = getImageSrc(flower.flowertype);

      if (!imgSrc) {
        console.warn(`画像が見つかりません: ${flower.flowertype}.png`);
        return null;
      }
      
      // FlowerDetailに渡すためのデータを作成
      const flowerDetailData: FlowerList = {
        flowertype: flower.flowertype,
        name: flower.name,
      };

      return (
        <div
          key={index}
          className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 flex flex-col items-center justify-center p-2
          transition-transform duration-300 hover:scale-110 cursor-pointer" // cursor-pointerを追加
          onClick={() => handleOpenPopup(flowerDetailData)} // ★★★ onClickイベントを追加 ★★★
        >
          {/* カードの背景画像 */}
          <img
            src={cardImage}
            alt="Card Background"
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* 花の画像 */}
          <img
            src={imgSrc}
            alt={flower.flowertype}
            className="relative z-10 w-2/3 h-2/3 object-contain"
          />
          {/* 花の名前 */}
          <span className="relative z-10 text-center font-bold text-lg md:text-xl mt-2 text-amber-900">
            {flower.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div
      className="w-screen h-screen relative flex flex-col items-center justify-center overflow-auto p-10"
      style={{
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* 背景画像をコンテナとして独立させる */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>

      {error && (
        <div className="absolute top-5 left-5 z-20 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* コンテンツをz-indexで前面に持ってくる */}
      <div className="relative z-10 flex flex-col items-center space-y-8 md:space-y-12">
        {/* 1行目: 4つの花 */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-8">
          {renderFlowerCards(row1Flowers)}
        </div>

        {/* 2行目: 5つの花 */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-8">
          {renderFlowerCards(row2Flowers)}
        </div>

        {/* 3行目: 4つの花 */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-8">
          {renderFlowerCards(row3Flowers)}
        </div>
      </div>

      {/* ▼▼▼ ポップアップの表示処理を追加 ▼▼▼ */}
      {isPopupOpen && selectedFlower && (
        <FlowerPopup flower={selectedFlower} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default VisualDictionary;
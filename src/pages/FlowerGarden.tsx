import { useEffect, useState, useRef } from 'react';
import backgroundImage from '../assets/Home/gardenBackground.png';
import RotatingSun from '../components/RotatingSun';
import { supabase } from '../lib/supabaseClient';
import FlowerPopup from '../components/FlowerDetail';
import type { FlowerList } from '../types';

// データの型を定義します。supabaseから取得するデータの構造に合わせます。
interface FlowerData {
  id: number;
  selected_flower: string;
  // created_at フィールドを追加
  created_at: string;
}

// アセットフォルダ内のすべての花画像をまとめてインポート
const images = import.meta.glob('../assets/flowers/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

// ファイル名から適切な画像ソースを取得するヘルパー関数
const getImageSrc = (type: string): string | undefined => {
  const match = Object.entries(images).find(([path]) =>
    path.includes(`${type}.png`)
  );
  return match?.[1];
};

// 画面上に花を配置するための座標リスト
const FLOWER_POSITIONS = [
    { top: '75%', left: '55%' }, { top: '75%', left: '35%' }, { top: '40%', left: '80%' }, { top: '55%', left: '15%' }, { top: '68%', left: '70%' },
    { top: '40%', left: '25%' }, { top: '71%', left: '90%' }, { top: '45%', left: '40%' }, { top: '82%', left: '25%' }, { top: '38%', left: '61%' },
    { top: '36%', left: '48%' }, { top: '80%', left: '47%' }, { top: '86%', left: '65%' }, { top: '78%', left: '77%' }, { top: '77%', left: '15%' },
    { top: '52%', left: '7%' }, { top: '30%', left: '32%' }, { top: '88%', left: '6%' }, { top: '30%', left: '70%' }, { top: '29%', left: '88%' },
    { top: '30%', left: '15%' }, { top: '80%', left: '10%' }, { top: '50%', left: '75%' }, { top: '55%', left: '60%' }, { top: '60%', left: '50%' },
    { top: '65%', left: '30%' }, { top: '40%', left: '54%' }, { top: '75%', left: '40%' }, { top: '90%', left: '35%' }, { top: '64%', left: '83%' },
    { top: '90%', left: '55%' }, { top: '45%', left: '65%' }, { top: '82%', left: '71%' }, { top: '75%', left: '85%' }, { top: '51%', left: '21%' },
    { top: '38%', left: '10%' }, { top: '50%', left: '93%' }, { top: '55%', left: '34%' }, { top: '50%', left: '45%' }, { top: '40%', left: '90%' },
    { top: '40%', left: '30%' }, { top: '70%', left: '80%' }, { top: '70%', left: '20%' }, { top: '65%', left: '5%' }, { top: '70%', left: '62%' },
    { top: '85%', left: '20%' }, { top: '29%', left: '75%' }, { top: '75%', left: '30%' }, { top: '43%', left: '69%' }, { top: '85%', left: '40%' },
    { top: '90%', left: '45%' }, { top: '85%', left: '58%' }, { top: '63%', left: '65%' }, { top: '90%', left: '75%' }, { top: '84%', left: '85%' },
    { top: '65%', left: '95%' }, { top: '90%', left: '90%' }, { top: '49%', left: '87%' }, { top: '50%', left: '80%' }, { top: '52%', left: '54%' },
    { top: '42%', left: '50%' }, { top: '25%', left: '43%' }, { top: '50%', left: '27%' }, { top: '25%', left: '20%' }, { top: '70%', left: '73%' },
    { top: '73%', left: '6%' }, { top: '67%', left: '12%' }, { top: '75%', left: '50%' }, { top: '69%', left: '57%' }, { top: '85%', left: '30%' },
    { top: '64%', left: '42%' }, { top: '40%', left: '5%' }, { top: '51%', left: '10%' }, { top: '42%', left: '17%' }, { top: '62%', left: '25%' },
    { top: '28%', left: '25%' }, { top: '25%', left: '83%' }, { top: '35%', left: '35%' }, { top: '29%', left: '40%' }, { top: '26%', left: '56%' },
    { top: '27%', left: '50%' }, { top: '40%', left: '95%' }, { top: '88%', left: '69%' }, { top: '50%', left: '69%' }, { top: '60%', left: '87%' },
    { top: '70%', left: '95%' }, { top: '56%', left: '73%' }, { top: '60%', left: '77%' }, { top: '55%', left: '60%' }, { top: '50%', left: '50%' },
    { top: '35%', left: '20%' }, { top: '47%', left: '31%' }, { top: '34%', left: '43%' }, { top: '25%', left: '78%' }, { top: '27%', left: '64%' },
    { top: '67%', left: '45%' }, { top: '59%', left: '20%' }, { top: '24%', left: '94%' }, { top: '65%', left: '36%' }, { top: '87%', left: '13%' },
];

function FlowerGardenPage() {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerList | null>(null);

  // 新しい状態変数を追加
  const [showLargeFlower, setShowLargeFlower] = useState(false);
  const [latestFlowerType, setLatestFlowerType] = useState<string | null>(null);

  // タイマーの状態を管理するためのref
  const timerId = useRef<NodeJS.Timeout | null>(null);

  // ポップアップを開く命令を出すだけのシンプルな関数
  const handleOpenPopup = (flower: FlowerList) => {
    setSelectedFlower(flower);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedFlower(null);
  };

  // 最初に一度だけ花畑のデータを取得する
  useEffect(() => {
    const fetchFlowers = async () => {
      // 既存の花データを取得
      const { data, error: fetchError } = await supabase
        .from('analysis_results')
        .select('id, selected_flower, created_at');
      
      if (fetchError) {
        setError(fetchError.message);
        console.error('データの読み取りエラー: ', fetchError.message);
        return;
      }
      setFlowers(data as FlowerData[]);

      // 最新のレコードのcreated_atを取得する
      const { data: latestData, error: latestError } = await supabase
        .from('analysis_results')
        .select('selected_flower, created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      if (latestError) {
        console.error('最新データの読み取りエラー: ', latestError.message);
        return;
      }

      if (latestData && latestData.length > 0) {
        const latestRecord = latestData?.[0];
        const createdAt = new Date(latestRecord.created_at);
        const now = new Date();
        const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;
        
        // 15秒以内かチェック
        if (diffInSeconds <= 15) {
          setShowLargeFlower(true);
          setLatestFlowerType(latestRecord.selected_flower);
          
          // 5秒後に大きな表示を戻すタイマーを設定
          timerId.current = setTimeout(() => {
            setShowLargeFlower(false);
            setLatestFlowerType(null);
          }, 8000);
        } else {
          setShowLargeFlower(false);
          setLatestFlowerType(null);
        }
      }
    };

    fetchFlowers();

    // コンポーネントがアンマウントされたときにタイマーをクリア
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  // 花の数に応じて画像のサイズを動的に変更
  const numFlowers = flowers.length;
  let imageSize;
  if (numFlowers <= 5) imageSize = 'w-90 h-90';
  else if (numFlowers <= 10) imageSize = 'w-72 h-72';
  else if (numFlowers <= 20) imageSize = 'w-64 h-64';
  else if (numFlowers <= 40) imageSize = 'w-42 h-42';
  else if (numFlowers <= 60) imageSize = 'w-36 h-36';
  else if (numFlowers <= 80) imageSize = 'w-32 h-32';
  else imageSize = 'w-28 h-28';

  return (
    <div
      className="w-screen h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <RotatingSun />

      <div className="absolute top-5 right-5 z-20">
        <a 
          href="/visualdictionary" 
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          図鑑へ
        </a>
      </div>


      {error && (
        <div className="absolute top-5 left-5 z-20 rounded-md bg-red-100 p-4 text-red-700">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
      )}

      <div className="absolute inset-0">
        {/* 最新の花が表示される場合は、他の花を非表示にする */}
        {showLargeFlower && latestFlowerType ? (
          <img
            src={getImageSrc(latestFlowerType)}
            alt={latestFlowerType}
            // ホバー効果とクリックイベントを削除
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-256 h-256 z-40`}
          />
        ) : (
          /* 最新の花が表示されていない場合は、通常の花をすべて表示 */
          flowers.slice(0, FLOWER_POSITIONS.length).map((flower, index) => {
            const imgSrc = getImageSrc(flower.selected_flower);
            const position = FLOWER_POSITIONS?.[index];

            if (!imgSrc || !position) return null;
            
            const flowerDetailData: FlowerList = {
              flowertype: flower.selected_flower,
              name: '',
            };

            return (
              <img
                key={flower.id}
                src={imgSrc}
                alt={flower.selected_flower}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${imageSize} transition-transform duration-500 hover:scale-110 cursor-pointer z-10`}
                style={{ top: position.top, left: position.left }}
                onClick={() => handleOpenPopup(flowerDetailData)}
              />
            );
          })
        )}
      </div>

      {isPopupOpen && selectedFlower && (
        <FlowerPopup flower={selectedFlower} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default FlowerGardenPage;
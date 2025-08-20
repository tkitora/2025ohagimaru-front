import React, { useEffect, useState } from 'react';
import backgroundImage from '../assets/Home/gardenBackground.png';
import RotatingSun from '../components/RotatingSun';
import { supabase } from '../lib/supabaseClient';
import type { FlowerList } from '../types';
import roseImage from '../assets/rose.png';

const images = import.meta.glob('../assets/*.png', {
  eager: true,
  import: 'default',
});

const getImageSrc = (type) => {
  const match = Object.entries(images).find(([path]) =>
    path.includes(`${type}.png`)
  );
  return match?.[1];
};

const FLOWER_POSITIONS = [
  // 最初の20個は比較的間隔を空けて配置
  { top: '75%', left: '55%' },
  { top: '75%', left: '35%' },
  { top: '40%', left: '80%' },
  { top: '55%', left: '15%' },
  { top: '68%', left: '70%' },
  { top: '40%', left: '25%' },
  { top: '71%', left: '90%' },
  { top: '45%', left: '40%' },
  { top: '82%', left: '25%' },
  { top: '38%', left: '61%' },
  { top: '36%', left: '48%' },
  { top: '80%', left: '47%' },
  { top: '86%', left: '65%' },
  { top: '78%', left: '77%' },
  { top: '77%', left: '15%' },
  { top: '52%', left: '7%' },
  { top: '30%', left: '32%' },
  { top: '88%', left: '6%' },
  { top: '30%', left: '70%' },
  { top: '29%', left: '88%' },
  
  // 21個目以降は、より広範囲に分散させて配置
  { top: '30%', left: '15%' },
  { top: '80%', left: '10%' },
  { top: '50%', left: '75%' },
  { top: '55%', left: '60%' },
  { top: '60%', left: '50%' },

  { top: '65%', left: '30%' },
  { top: '40%', left: '54%' },
  { top: '75%', left: '40%' },
  { top: '90%', left: '35%' },
  { top: '64%', left: '83%' },
//30
  { top: '90%', left: '55%' },
  { top: '45%', left: '65%' },
  { top: '82%', left: '71%' },
  { top: '75%', left: '85%' },
  { top: '51%', left: '21%' },
  
  { top: '38%', left: '10%' },
  { top: '50%', left: '93%' },
  { top: '55%', left: '34%' },
  { top: '50%', left: '45%' },
  { top: '40%', left: '90%' },
  //40
  { top: '40%', left: '30%' },
  { top: '70%', left: '80%' },
  { top: '70%', left: '20%' },
  { top: '65%', left: '5%' },
  { top: '70%', left: '62%' },
  
  { top: '85%', left: '20%' },
  { top: '29%', left: '75%' },
  { top: '75%', left: '30%' },
  { top: '43%', left: '69%' },
  { top: '85%', left: '40%' },
  //50
  { top: '90%', left: '45%' },
  { top: '85%', left: '58%' },
  { top: '63%', left: '65%' },
  { top: '90%', left: '75%' },
  { top: '84%', left: '85%' },
  
  { top: '65%', left: '95%' },
  { top: '90%', left: '90%' },
  { top: '49%', left: '87%' },
  { top: '50%', left: '80%' },
  { top: '52%', left: '54%' },
  //60
  { top: '42%', left: '50%' },
  { top: '25%', left: '43%' },
  { top: '50%', left: '27%' },
  { top: '25%', left: '20%' },
  { top: '70%', left: '73%' },
  
  { top: '73%', left: '6%' },
  { top: '67%', left: '12%' },
  { top: '75%', left: '50%' },
  { top: '69%', left: '57%' },
  { top: '85%', left: '30%' },
  //70
  { top: '64%', left: '42%' },
  { top: '40%', left: '5%' },
  { top: '51%', left: '10%' },
  { top: '42%', left: '17%' },
  { top: '62%', left: '25%' },
  
  { top: '22%', left: '25%' },
  { top: '25%', left: '83%' },
  { top: '35%', left: '35%' },
  { top: '29%', left: '40%' },
  { top: '23%', left: '56%' },
  //80
  { top: '19%', left: '50%' },
  { top: '40%', left: '95%' },
  { top: '88%', left: '69%' },
  { top: '50%', left: '69%' },
  { top: '60%', left: '87%' },
  
  { top: '70%', left: '95%' },
  { top: '65%', left: '80%' },
  { top: '60%', left: '70%' },
  { top: '55%', left: '60%' },
  { top: '50%', left: '50%' },
  //90
  { top: '35%', left: '20%' },
  { top: '47%', left: '31%' },
  { top: '34%', left: '43%' },
  { top: '25%', left: '78%' },
  { top: '27%', left: '64%' },
  
  { top: '67%', left: '45%' },
  { top: '65%', left: '20%' },
  { top: '24%', left: '94%' },
  { top: '65%', left: '36%' },
  { top: '87%', left: '13%' },
];

function HomePage() {
  const [flowers, setFlowers] = useState<FlowerList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [flowerCount, setFlowerCount] = useState(0);

  useEffect(() => {
    const fetchFlowers = async () => {
      let fetchedData = [];
      if (debugMode) {
        fetchedData = Array.from({ length: flowerCount }, (_, i) => ({
          id: i + 1,
          flowertype: 'rose',
          created_at: new Date().toISOString(),
        }));
      } else {
        const { data, error } = await supabase
          .from('flowerlist')
          .select('*');

        if (error) {
          setError(error.message);
          console.error('読み取りエラー: ', error.message);
          return;
        }
        fetchedData = data as FlowerList[];
      }
      setFlowers(fetchedData);
    };

    fetchFlowers();
  }, [debugMode, flowerCount]);

  const numFlowers = flowers.length;
  let imageSize;

  if (numFlowers <= 10) {
    imageSize = 'w-80 h-80';
  } else if (numFlowers <= 20) {
    imageSize = 'w-72 h-72';
  } else if (numFlowers <= 40) {
    imageSize = 'w-54 h-54';
  } else if (numFlowers <= 60) {
    imageSize = 'w-42 h-42';
  } else if (numFlowers <= 80) {
    imageSize = 'w-32 h-32';
  } else {
    imageSize = 'w-28 h-28';
  }

  const handleFlowerCountChange = (e) => {
    setFlowerCount(Number(e.target.value));
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

      <div className="absolute top-5 right-5 z-10 flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white">デバッグモード</label>
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="form-checkbox h-5 w-5 text-pink-600"
          />
        </div>
        {debugMode && (
          <div className="flex items-center space-x-2">
            <label className="text-white">花の数:</label>
            <input
              type="number"
              value={flowerCount}
              onChange={handleFlowerCountChange}
              className="w-20 px-2 py-1 rounded-md text-gray-800"
              min="0"
              max="100"
            />
          </div>
        )}
      </div>

      <div className="absolute inset-0">
        {flowers.slice(0, FLOWER_POSITIONS.length).map((flower, index) => {
          const imgSrc = debugMode ? roseImage : getImageSrc(flower.flowertype);
          const position = FLOWER_POSITIONS[index];

          if (!imgSrc || !position) return null;

          return (
            <img
              key={flower.id || index}
              src={imgSrc}
              alt={flower.flowertype}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${imageSize} transition-transform duration-500 hover:scale-110`}
              style={{
                top: position.top,
                left: position.left,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
import React from 'react';
import backgroundImage from '../assets/Home/background.png';
import RotatingSun from '../components/RotatingSun';//太陽のコンポーネントをインポート
import MovingClouds from '../components/MovingCloud';//雲のコンポーネントをインポート

// このコンポーネントは、提供されたコードを画面サイズにフィットするよう再構築します。
function HomePage() {
  return (
    // 画面全体を覆い、スクロールを無効にします。
    <div 
      className="w-screen h-screen relative overflow-hidden bg-cover bg-center" 
      style={{
        fontFamily: 'Inter, sans-serif',
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
     <RotatingSun /> {/*太陽のコンポーネントを配置 */}
      <MovingClouds /> {/*雲のコンポーネントを配置 */}
        
        {/* メインコンテンツ - 画面中央に固定 */}
        <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
            {/* 文字サイズをビューポートの幅に応じて調整します。 */}
            <h1 className="text-[20vw] md:text-[16vw] lg:text-[12vw] xl:text-[8vw] text-black font-normal leading-none mb-8 whitespace-nowrap">花看破</h1>
        </div>
    </div>
  );
}

export default HomePage;
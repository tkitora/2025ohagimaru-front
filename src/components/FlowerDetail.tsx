import type { FlowerList } from "../types";

//画像のパスとコンポーネントを管理
const images = import.meta.glob("../assets/flowers/*.png", {
    eager: true,
    import: "default",
}) as Record<string, string>;

//花の詳細ポップアップ
const FlowerPopup = ({ flower, onClose }: { flower: FlowerList, onClose: () => void }) => {
    // 画像パスを取得するロジックをポップアップ内に追加
    const imgSrc = Object.entries(images).find(([path]) =>
        path.includes(`${flower.flowertype}.png`)
    )?.[1];
    
    return (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
     <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        {/* 画像が表示されるようにする */}
        {imgSrc && <img src={imgSrc} alt={flower.flowertype} className="w-full h-auto mb-4" />}
        
        <h2 className="text-2xl font-bold mb-4">{flower.name}</h2>
        <p>花の名前: {flower.flowertype}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default FlowerPopup;
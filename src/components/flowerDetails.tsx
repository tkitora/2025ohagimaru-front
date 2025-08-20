import { useState } from "react";
import type { FlowerList } from "../types";

//画像のパスとコンポーネントを管理
const images = import.meta.glob("../assets/flowerImages/*.png", {
    eager: true,
    import: "default",
}) as Record<string, string>;

//花の詳細ポップアップ
const FlowerPopup = ({ flower, onClose }: { flower: FlowerList, onClose:() => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
     <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">{flower.name}</h2>
        <p>種類: {flower.flowertype}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          閉じる
        </button>
      </div>
    </div>
  );
};

// 花のカードコンポーネント
const FlowerCard = ({ flower }: { flower: FlowerList }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imgSrc = Object.entries(images).find(([path]) =>
    path.includes(`${flower.flowertype}.png`)
  )?.[1];

  return (
    <>
      <div className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsPopupOpen(true)}>
        {imgSrc && <img src={imgSrc} alt={flower.flowertype} className="w-full h-auto" />}
        <p className="mt-2 text-center">{flower.name}</p>
      </div>
      {isPopupOpen && <FlowerPopup flower={flower} onClose={() => setIsPopupOpen(false)} />}
    </>
  );
};

export default FlowerCard;
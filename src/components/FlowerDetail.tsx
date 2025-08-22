import { useEffect, useState } from 'react';
import type { FlowerList } from "../types";
import { supabase } from '../lib/supabaseClient';

//画像のパスとコンポーネントを管理
const images = import.meta.glob("../assets/flowers/*.png", {
    eager: true,
    import: "default",
}) as Record<string, string>;

interface FlowerDetailProps {
    flower: FlowerList;
    onClose: () => void;
}

interface FlowerData {
    name: string;
    atTime: string;
    count: number;
    flowerWord: string;
}

//花の詳細ポップアップ
const FlowerPopup = ({ flower, onClose }: FlowerDetailProps) => {
    const [flowerData, setFlowerData] = useState<FlowerData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlowerData = async () => {
            if (!flower) return;

            const { data, error } = await supabase
                .from('flowerlist')
                .select('name, atTime, count, flowerWord')
                .eq('flowertype', flower.flowertype)
                .single();

            if (error) {
                setError(error.message);
                console.error('Error fetching flower data:', error);
            } else {
                setFlowerData(data);
            }
        };

        fetchFlowerData();
    }, [flower]);

    // 画像パスを取得するロジックをポップアップ内に追加
    const imgSrc = Object.entries(images).find(([path]) =>
        path.includes(`${flower.flowertype}.png`)
    )?.[1];
    
    return (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : flowerData ? (
                    <>
                        {imgSrc && <img src={imgSrc} alt={flower.flowertype} className="w-full h-auto mb-4" />}
                        <h2 className="text-2xl font-bold mb-4">{flowerData.name}</h2>
                        <p>花言葉: {flowerData.flowerWord}</p>
                        <p>最後に見た日時: {new Date(flowerData.atTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
                        <p>花畑にある数: {flowerData.count}</p>
                    </>
                ) : (
                    <p>読み込み中...</p>
                )}
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default FlowerPopup;
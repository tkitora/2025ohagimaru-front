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

    // ▼▼▼ このuseEffectに処理をまとめる ▼▼▼
    useEffect(() => {
        const updateAndFetchFlowerData = async () => {
            if (!flower) return;

            try {
                // 1. analysis_resultsから最新のレコード時刻を取得
                const { data: latestFlower, error: latestFlowerError } = await supabase
                    .from('analysis_results')
                    .select('created_at')
                    .eq('selected_flower', flower.flowertype)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (latestFlowerError) throw latestFlowerError;

                // 2. analysis_resultsから同じ種類の花の数を取得
                const { count, error: countError } = await supabase
                    .from('analysis_results')
                    .select('*', { count: 'exact', head: true })
                    .eq('selected_flower', flower.flowertype);

                if (countError) throw countError;

                // 3. flowerlistテーブルを更新
                const { error: updateError } = await supabase
                    .from('flowerlist')
                    .update({ 
                        count: count ?? 0,
                        atTime: latestFlower.created_at
                    })
                    .eq('flowertype', flower.flowertype);

                if (updateError) throw updateError;
                
                // 4. 更新後の最新データをflowerlistから取得して表示
                const { data: finalData, error: finalError } = await supabase
                    .from('flowerlist')
                    .select('name, atTime, count, flowerWord')
                    .eq('flowertype', flower.flowertype)
                    .single();

                if (finalError) throw finalError;
                
                setFlowerData(finalData);

            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching flower data:', error);
            }
        };

        updateAndFetchFlowerData();
    }, [flower]); // flowerオブジェクトが渡された時に実行

    // 画像パスを取得するロジック
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
                        <p>見た回数: {flowerData.count}</p>
                    </>
                ) : (
                    <p>読み込み中...</p> /* データ取得中はこれが表示される */
                )}
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default FlowerPopup;
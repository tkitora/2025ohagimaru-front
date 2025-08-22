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
        const processFlowerData = async () => {
            if (!flower) return;

            try {
                // まず、花が花畑(analysis_results)に存在するか確認
                const { data: analysisData, error: analysisError } = await supabase
                    .from('analysis_results')
                    .select('created_at')
                    .eq('selected_flower', flower.flowertype)
                    .limit(1)
                    .single();

                // ★★★ ここからが修正箇所 ★★★

                // ケース1: 花がまだ花畑に登録されていない場合
                // (.single()はデータがないとエラーを返すので、そのエラーを検知)
                if (analysisError) {
                    // flowerlistから基本的な情報(名前と花言葉)だけを取得
                    const { data: listData, error: listError } = await supabase
                        .from('flowerlist')
                        .select('name, flowerWord')
                        .eq('flowertype', flower.flowertype)
                        .single();

                    if (listError) throw listError;

                    // 「未登録」状態として表示用データを作成
                    setFlowerData({
                        name: listData.name,
                        flowerWord: listData.flowerWord,
                        count: 0,
                        atTime: 'not-registered', // 未登録を示す特別な値
                    });
                
                // ケース2: 花が花畑に登録されている場合 (これまでの処理)
                } else {
                    const { count, error: countError } = await supabase
                        .from('analysis_results')
                        .select('*', { count: 'exact', head: true })
                        .eq('selected_flower', flower.flowertype);

                    if (countError) throw countError;

                    // flowerlistテーブルの情報を更新
                    await supabase
                        .from('flowerlist')
                        .update({ 
                            count: count ?? 0,
                            atTime: analysisData.created_at
                        })
                        .eq('flowertype', flower.flowertype);
                    
                    // 更新後の最新データを取得して表示
                    const { data: finalData, error: finalError } = await supabase
                        .from('flowerlist')
                        .select('name, atTime, count, flowerWord')
                        .eq('flowertype', flower.flowertype)
                        .single();

                    if (finalError) throw finalError;
                    
                    setFlowerData(finalData);
                }
                // ★★★ 修正箇所ここまで ★★★

            } catch (error: any) {
                setError(error.message);
                console.error('Error fetching flower data:', error);
            }
        };

        processFlowerData();
    }, [flower]);

    const imgSrc = Object.entries(images).find(([path]) =>
        path.includes(`${flower.flowertype}.png`)
    )?.[1];
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : flowerData ? (
                    <>
                        {imgSrc && <img src={imgSrc} alt={flower.flowertype} className="w-full h-auto mb-4" />}
                        <h2 className="text-2xl font-bold mb-4">{flowerData.name}</h2>
                        <p>花言葉: {flowerData.flowerWord}</p>

                        {/* ▼▼▼ atTimeの値に応じて表示を切り替える ▼▼▼ */}
                        {flowerData.atTime === 'not-registered' ? (
                            <p className="font-bold text-red-500 mt-2">まだ花畑に登録されていません！</p>
                        ) : (
                            <>
                                <p>最後に見た日時: {new Date(flowerData.atTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
                                <p>見た回数: {flowerData.count}</p>
                            </>
                        )}
                    </>
                ) : (
                    <p>読み込み中...</p>
                )}
                <button 
                    onClick={onClose} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default FlowerPopup;
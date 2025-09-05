import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// 花データの型定義
//ページが実行された際に一度だけ実行する処理
//花のデータをsupabaseから取得する処理

export interface FlowerData {
  id: number;
  selected_flower: string;
  created_at: string;
}

export const useFlowers = () => {
  const [flowers, setFlowers] = useState<FlowerData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //最初に現在の花をすべて取得する
    const fetchFlowers = async () => {
      const { data, error: fetchError } = await supabase
        .from('analysis_results')
        .select('id, selected_flower, created_at');

      if (fetchError) {
        setError(fetchError.message);
        console.error('データの読み取りエラー: ', fetchError.message);
      } else {
        setFlowers(data as FlowerData[]);
      }
    };

    fetchFlowers();

    //Supabaseからの通知を受け取るチャンネルを作成し、購読する
    const channel = supabase.channel('analysis_results_changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT',       // 「追加（INSERT）」イベントだけを監視
          schema: 'public',
          table: 'analysis_results' // 「analysis_results」テーブルを監視
        },
        (payload) => {
          //新しい花のデータが届いたら、現在の花のリストに追加する
          console.log('新しい花が追加されました！', payload.new);
          setFlowers((prevFlowers) => [...prevFlowers, payload.new as FlowerData]);
        }
      )
      .subscribe();

    //ページを離れるときに、チャンネル購読を解除する
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // この処理は最初に一度だけ実行される

  return { flowers, error };
};
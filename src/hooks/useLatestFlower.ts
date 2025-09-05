import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useLatestFlower = () => {
  const [showLargeFlower, setShowLargeFlower] = useState(false);
  const [latestFlowerType, setLatestFlowerType] = useState<string | null>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    //こちらも同様に通知を受け取るチャンネルを作成
    const channel = supabase.channel('latest_flower_display')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'analysis_results' 
        },
        (payload) => {
          //演出中に新しい花が来たら、前のタイマーを止める
          if (timerId.current) {
            clearTimeout(timerId.current);
          }

          const newFlower = payload.new as { selected_flower: string };

          //新しい花が届いたので、演出を開始する
          setShowLargeFlower(true);
          setLatestFlowerType(newFlower.selected_flower);

          //10秒後に演出を終了するタイマーをセット
          timerId.current = setTimeout(() => {
            setShowLargeFlower(false);
            setLatestFlowerType(null);
          }, 10000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  return { showLargeFlower, latestFlowerType };
};
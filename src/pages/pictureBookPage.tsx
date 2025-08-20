import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { FlowerList } from '../types';
import { useEffect, useState } from 'react';
import FlowerCard from '../components/flowerDetails';

function FlowersPage() {
    const [flowers, setFlowers] = useState<FlowerList[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlowers = async () => {
            const { data, error } = await supabase
                .from('flowerlist')
                .select('*');

            if (error) {
                setError(error.message);
                console.error('読み取りエラー: ', error.message);
            } else {
                setFlowers(data as FlowerList[]);
            }
        };

        fetchFlowers();
    }, []);

    return (
        <div className="p-4 overflow-y-scroll h-screen"> {/* スクロールできるように設定 */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">花の一覧</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/garden">Garden</Link></li>
                        <li><Link to="/mygarden">My Garden</Link></li>
                        <li><Link to="/picturebook">Picture Book</Link></li>
                    </ul>
                </nav>
            </div>
            {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {flowers.map((flower) => (
                    <FlowerCard key={flower.flowertype} flower={flower} />
                ))}
            </div>
        </div>
    );
}

export default FlowersPage;
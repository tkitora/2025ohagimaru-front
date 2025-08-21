import { Link } from 'react-router-dom';
import type { FlowerList } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react'; 

const images = import.meta.glob('../assets/flowers/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const getImageSrc = (type: string): string | undefined => {
  const match = Object.entries(images).find(([path]) =>
    path.includes(`${type}.png`)
  );
  return match?.[1];
};

function GardenPages() {
    const [flowers, setFlower] = useState<FlowerList[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlowers = async () => {
            const { data, error } = await supabase
                .from('flowerlist')
                .select('*');

            if (error) {
                setError(error.message);
                console.error('読み取りエラー: ', error.message);
            }
            else{
                setFlower(data as FlowerList[]);
            }
        };

        fetchFlowers();
    }, []);

    return (
        <>
            <div>
                <h1>Welcome to the Garden Page</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/garden">Garden</Link></li>
                        <li><Link to="/mygarden">My Garden</Link></li>
                    </ul>
                </nav>
            </div>
            <div>
                <h2>
                   登録された花一覧 
                </h2>
                {error && <p style = {{ color: 'red' }}>エラー: {error}</p>}
                <ul>
                    {flowers.map((flower, index) => {
                        const imgSrc = getImageSrc(flower.flowertype);
                        return(
                            <li key={index} className="mb-4">
                                {imgSrc && (
                                    <img src={imgSrc} alt={flower.flowertype} className="w-24 h-24" />
                                )}
                                <p>{flower.name}</p>
                            </li>
                        );
                    })};
                </ul>
            </div>
        </>
    );
}

export default GardenPages;
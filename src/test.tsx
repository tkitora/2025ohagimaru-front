import { useState } from 'react';
import FlowerPopup from './components/FlowerDetail'; 
import { dummyFlowers } from './testDate';

const PopupTest = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(true);

    const testFlowerData = dummyFlowers[0];

    return (
        <div className="w-full min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">ポップアップテストページ</h1>
            
            {isPopupOpen && (
                <FlowerPopup 
                    flower={testFlowerData}
                    onClose={() => setIsPopupOpen(false)}
                />
            )}
        </div>
    );
};

export default PopupTest;
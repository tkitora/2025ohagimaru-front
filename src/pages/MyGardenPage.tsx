import { Link } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';


function MyGardenPage() {
  const [status, setStatus] = useState('');
  const [flowertype, setFlowertype] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('準備中...');


    const { error } = await supabase
      .from('flowerlist')
      .insert([{ flowertype, name}]);
    if (error) {
      setStatus('エラー: ' + error.message);
    }
    else {
      setStatus('追加完了');
      setFlowertype('');
      setName('');
    }
  };
  return (
    <>
      <div>
        <h1>Welcome to My Garden Page</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><Link to="/garden">Garden</Link></li>
            <li><Link to="/mygarden">My Garden</Link></li>
          </ul>
        </nav>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>
            種類 (flowertype):
          </label>
          <input
          value={flowertype}
          onChange={(e) => setFlowertype(e.target.value)}
          className="border p-2 w-full"
          required
          >
          </input>
        </div>
        <div>
          <label>
            名前 (name):
          </label>
          <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
          >
          </input>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          追加
        </button>
        <p>
          {status}
        </p>
      </form>
    </>
  );
}

export default MyGardenPage;
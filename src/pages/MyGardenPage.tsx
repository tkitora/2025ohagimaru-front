import { Link } from 'react-router-dom';

function MyGardenPage() {
  return (
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
  );
}

export default MyGardenPage;
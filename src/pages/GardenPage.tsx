import { Link } from 'react-router-dom';

function GardenPages() {
    return (
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
    );
}

export default GardenPages;
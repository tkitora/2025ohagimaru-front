function Header () {
  return (
    <header className="flex items-center justify-between p-4 bg-blue-400 text-white">
      <h1 className="text-xl font-sans">はなかんぱ</h1>
      <nav>
        <ul className="flex space-x-4">
          {/* <li><a href="/">ホーム</a></li> */}
          <li>
            <a href="/visualdictionary" className="text-xl font-sans">ずかん</a>
          </li>
          <li>
            <a href="/flowergarden" className="text-xl font-sans">はなばたけ</a>
          </li>
          <li>
            <a href="/garden" className="text-xl font-sans">おにわ</a>
          </li>
          <li>
            <a href="/mygarden" className="text-xl font-sans">あなたのおにわ</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
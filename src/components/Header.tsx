function Header () {
  return (
    <header className="flex items-center justify-between p-4 bg-[#111827] text-white">
      <h1 className="text-xl">Ohagimaru Garden</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/">Home</a></li>
          <li><a href="/garden">Garden</a></li>
          <li><a href="/mygarden">My Garden</a></li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
// import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, GardenPage, MyGardenPage, Header, PicturfeBookPage} from './index'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/garden' element={<GardenPage />} />
          <Route path='/mygarden' element={<MyGardenPage />} />
          <Route path='/picturebook' element={<PicturfeBookPage />} />
        </Routes>
      </main>
      {/*<Footer />*/}
    </Router>
  )
}

export default App
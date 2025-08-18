// import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, GardenPage, MyGardenPage, Header, } from './index'

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/garden' element={<GardenPage />} />
          <Route path='/mygarden' element={<MyGardenPage />} />
        </Routes>
      </main>
      {/*<Footer />*/}
    </Router>
  )
}

export default App
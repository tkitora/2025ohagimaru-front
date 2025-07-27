// import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { HomePage, GardenPage, MyGardenPage } from './pages'

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/garden' element={<GardenPage />} />
        <Route path='/mygarden' element={<MyGardenPage />} />
      </Routes>
    </Router>
  )
}

export default App
// import { useState } from 'react'
import './styles/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, GardenPage, MyGardenPage, FlowerGardenPage,VisualDictionaryPage} from './index'

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/garden' element={<GardenPage />} />
          <Route path='/mygarden' element={<MyGardenPage />} />
          <Route path='flowergarden' element={<FlowerGardenPage />} />
          <Route path='visualdictionary' element={<VisualDictionaryPage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
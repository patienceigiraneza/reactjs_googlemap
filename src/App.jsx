import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import  Header from './componets/Header'
import Footer  from './componets/Footer'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import About from './pages/About'

function App() {

  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
      < Footer />
      </BrowserRouter>
    </>
  )
}

export default App

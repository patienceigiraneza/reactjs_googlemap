import { useState } from 'react'
import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import  Header from './componets/Header'
import Footer  from './componets/Footer'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'

function App() {

  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />

        </Routes>
      < Footer />
      </BrowserRouter>
    </>
  )
}

export default App

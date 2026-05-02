import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav.jsx'
import Cursor from './components/Cursor.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Nav />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router/Router'
import { StudentProvider } from './context/StudentContext'

function App() {
  return (
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
  )
}

export default App
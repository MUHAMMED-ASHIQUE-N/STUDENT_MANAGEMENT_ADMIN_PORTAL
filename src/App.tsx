import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router/Router'
import { DashProvider } from './context/DashContext'

function App() {
  return (
    <BrowserRouter>
    <DashProvider>
      <Router/>
    </DashProvider>
    </BrowserRouter>
  )
}

export default App
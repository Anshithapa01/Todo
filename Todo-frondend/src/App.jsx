import React from 'react'
import AppRoutes from './Components/routes/AppRoutes'
import {  BrowserRouter as Router } from 'react-router-dom'

const App = () => {
  return (
    <Router>
        <AppRoutes />
      </Router>
  )
}

export default App

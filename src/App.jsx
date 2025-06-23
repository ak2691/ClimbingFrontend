import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import StrengthForm from "./Components/StrengthForm"
import TempHome from "./Components/TempHome"

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<TempHome />} />
        <Route path="/calculator" element={<StrengthForm />} />
      </Routes>


    </>

  )
}

export default App

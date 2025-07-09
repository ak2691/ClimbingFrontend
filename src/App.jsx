import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import StrengthForm from "./Components/StrengthForm"
import TempHome from "./Components/TempHome"
import LoginForm from './Components/LoginForm'
import RegisterForm from './Components/RegisterForm'
import PageWithForm from "./Components/PageWithForm"
import Questionnaire from './Components/Questionnaire'
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<TempHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/calculator" element={<StrengthForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/tailwind" element={<PageWithForm />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>


    </>

  )
}

export default App

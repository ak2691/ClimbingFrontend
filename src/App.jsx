import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import StrengthForm from "./Components/StrengthForm"
import TempHome from "./Components/TempHome"
import LoginForm from './Components/LoginForm'
import RegisterForm from './Components/RegisterForm'
import PageWithForm from "./Components/PageWithForm"
import Questionnaire from './Components/Questionnaire'
import UserProfile from "./Components/UserProfile"
import Navbar from "./Components/Navbar"
import Exercises from './Components/Exercises'
import CoachBot from './Components/CoachBot'
import UserPending from './Components/UserPending'
import AdminPending from './Components/AdminPending'
function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TempHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/calculator" element={<StrengthForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/tailwind" element={<PageWithForm />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/chatbot" element={<CoachBot />} />
        <Route path="/pending" element={<UserPending />} />
        <Route path="/admin/pending" element={<AdminPending />} />
      </Routes>


    </>

  )
}

export default App

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import StrengthForm from "./Components/StrengthForm"
import Home from "./Components/Home"
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
import { AuthProvider } from "./Components/AuthContext"
import { PrivateRoute } from './Components/PrivateRoute'
import VerificationForm from './Components/VerificationForm'

function App() {


  return (
    <>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/calculator" element={<StrengthForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/tailwind" element={<PageWithForm />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/chatbot" element={<PrivateRoute><CoachBot /></PrivateRoute>} />
          <Route path="/pending" element={<UserPending />} />
          <Route path="/admin/pending" element={<PrivateRoute><AdminPending /></PrivateRoute>} />
          <Route path="/verify" element={<VerificationForm />} />
        </Routes>
      </AuthProvider>

    </>

  )
}

export default App

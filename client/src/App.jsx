import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landing from "./pages/Landing.jsx"
import SignUp from "./pages/SignUp.jsx"
import LogIn from "./pages/LogIn.jsx"
import ChatHome from "./pages/ChatHome.jsx"
import TaskHome from "./pages/TaskHome.jsx"

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/home" element={<ChatHome />} />
        <Route path="/tasks" element={<TaskHome />} />
      </Routes>
    </div>
  )
}

export default App
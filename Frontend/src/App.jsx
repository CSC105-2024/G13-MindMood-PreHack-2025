import { useState } from 'react'
import Navbar from '../src/components/UI/Navbar'
import { Outlet } from "react-router-dom";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthProvider>
        <div>
          <Navbar />
          <Outlet />
        </div>
      </AuthProvider>
    </>
  )
}

export default App

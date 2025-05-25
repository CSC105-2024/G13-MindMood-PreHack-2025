import { Outlet } from "react-router-dom";
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <div className="min-h-screen bg-amber-50">
          <Outlet />
        </div>
      </AuthProvider>
    </>
  )
}

export default App
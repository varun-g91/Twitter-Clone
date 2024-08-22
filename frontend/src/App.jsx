
import { Routes, Route } from "react-router-dom";
import './index.css';
import HomePage from './Pages/home/HomePage'
import SignupPage from './Pages/auth/signup/SignupPage'
import LoginPage from './Pages/auth/login/LoginPage'

function App() {
  return (
      <div>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </div>
  );
}

export default App

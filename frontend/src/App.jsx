
import { Routes, Route } from "react-router-dom";
import './index.css';
import SignupPage from './Pages/auth/signup/SignupPage'
import LoginPage from './Pages/auth/login/LoginPage'
import Footer from "./components/common/Footer";
import LandingPage from "./Pages/landing/LandingPage";

function App() {
  return (
      <div>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Footer />
      </div>
  );
}

export default App


import { Routes, Route } from "react-router-dom";
import './index.css';
import Footer from "./components/common/Footer";
import LandingPage from "./Pages/landing/LandingPage";

function App() {
  return (
      <div>
          <Routes>
              <Route path="/" element={<LandingPage />} />
          </Routes>
          <Footer />
      </div>
  );
}

export default App

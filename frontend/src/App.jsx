
import { Routes, Route } from "react-router-dom";
import './index.css';
import LandingPage from "./Pages/landing/LandingPage";

function App() {
  return (
      <div>
          <Routes>
              <Route path="/" element={<LandingPage />} />
          </Routes>
      </div>
  );
}

export default App

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { SignupProvider } from "./signup flow/SignupContext"; // Import your context provider

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SignupProvider>
            <Router>
                <App />
            </Router>
        </SignupProvider>
    </StrictMode>
);

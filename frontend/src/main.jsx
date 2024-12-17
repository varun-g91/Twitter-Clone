import App from "./App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { SignupProvider } from "./Pages/auth/signup/SignupContext.jsx"; // Import your context provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";   

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SignupProvider>
            <Router
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >       
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </Router>
        </SignupProvider>
    </StrictMode>
);

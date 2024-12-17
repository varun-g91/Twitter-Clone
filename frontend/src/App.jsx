import { Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import LandingPage from "./Pages/landing/LandingPage";
import HomePage from "./Pages/home/HomePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Spinner from "./components/svgs/Spinner";
import ProfilePage from "./Pages/profile/ProfilePage";
import NotificationPage from "./Pages/notification/NotificationPage";


function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const response = await axios.get("/api/auth/me");


                if (!response.data) {
                    throw new Error(
                        response?.data?.message || "Something went wrong"
                    );
                }
                console.log("authUser is here:", response.data);
                return response.data; // Fixed: return response.data instead of undefined 'data'
            } catch (error) {
                return null; // Return null if there's an error fetching user
            }
        },
        retry: false, // Prevent automatic retries
    });

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <Routes>
                {/* Landing page is only accessible if not authenticated */}
                <Route
                    path="/"
                    element={
                        !authUser ? <LandingPage /> : <Navigate to="/home" />
                    }
                />

                {/* Home page is only accessible if authenticated */}
                <Route
                    path="/home"
                    element={authUser ? <HomePage authUser={authUser} /> : <Navigate to="/" />}
                />

                <Route
                    path="/profile/:userName"
                    element={authUser ? <ProfilePage /> : <Navigate to="/" />}
                />

                <Route
                    path="/notifications"
                    element={authUser ? <NotificationPage /> : <Navigate to="/" />}  
                />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;

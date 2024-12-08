import { useContext } from "react";
import { SignupContext } from "../signup flow/SignupContext";

const clearAllData = () => {
    setStep(1);
    setIdentifier("");
    setUsername("");
    setErrorMessage("");
    setName("");
    setVerificationToken("");
    setIsLoading(false);
    localStorage.removeItem("signupStep");
};

export default clearAllData;
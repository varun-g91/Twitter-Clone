import { createContext, useState, useEffect } from "react";

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
    // Step State with Persistence
    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem("signupStep");
        return savedStep ? parseInt(savedStep, 10) : 1; // Default to step 1
    });

    // Save step to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("signupStep", step);
    }, [step]);

    const [identifier, setIdentifier] = useState("");
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");

    const toggleLoading = () => {
        setIsLoading((prev) => !prev);
    };

    const value = {
        step,
        setStep,
        identifier,
        setIdentifier,
        errorMessage,
        setErrorMessage,
        verificationToken,
        setVerificationToken,
        isLoading,
        setIsLoading,
        toggleLoading,
        name,
        setName,
        username,
        setUsername,
    };

    return (
        <SignupContext.Provider value={value}>
            {children}
        </SignupContext.Provider>
    );
};

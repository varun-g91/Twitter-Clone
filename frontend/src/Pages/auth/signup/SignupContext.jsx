import { createContext, useState, useEffect } from "react";

export const SignupContext = createContext();

export const SignupProvider = ({ children }) => {
    // Step State with Persistence
    // No localStorage - Step state resets every time the app reloads
    const [step, setStep] = useState(1); // Default to step 1

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

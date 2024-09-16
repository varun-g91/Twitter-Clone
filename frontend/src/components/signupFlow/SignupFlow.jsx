import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ModalBase from "./components/ModalBase.jsx";
import Step1Content from "./steps/Step1Content";
import Step2Content from "./steps/Step2Content";
import Step3Content from "./steps/Step3Content";


const SignupFlow = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [placeholder, setPlaceholder] = useState("Phone");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationToken, setVerificationToken] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [password, setPassword] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const nameInputRef = useRef(null);
    const verificationCodeInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    

    const togglePlaceholder = () => {
        setPlaceholder((prev) => (prev === "Phone" ? "Email" : "Phone"));
        setIdentifier("");
        setErrorMessage("");
    };

    // Validate identifier based on type (phone/email)
    const validateIdentifier = (value) => {
        if (placeholder === "Phone") {
            const phonePattern = /^\+?[1-9]\d{1,14}$/;
            if (!phonePattern.test(value)) {
                setErrorMessage("Please enter a valid phone number.");
            } else {
                setErrorMessage("");
            }
        } else if (placeholder === "Email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                setErrorMessage("Please enter a valid email address.");
            } else {
                setErrorMessage("");
            }
        }
    };

    // Handle input change for identifier
    const handleInputChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        validateIdentifier(value);
    };

    // Handle form submission for Step 1 (Signup)
    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        if (
            !name ||
            !identifier ||
            !selectedMonth ||
            !selectedDay ||
            !selectedYear
        ) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5005/api/auth/signup",
                {
                    fullName: name,
                    identifier, // Can be either phone or email
                    dateOfBirth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
                }
            );

            if (response.data.message.includes("successfully")) {
                setErrorMessage("");
                setVerificationToken(response.data.verificationToken);
                console.log(
                    "Verification token:",
                    response.data.verificationToken
                );
                setStep(2); // Move to Step 2 (Verification)
            } else {
                setErrorMessage(response.data.message || "Signup failed.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during signup."
            );
        }
    };

    // Handle verification code submission for Step 2
    const handleSubmitStep2 = async () => {
        if (verificationCode.length !== 6) {
            setErrorMessage("The verification code must be 6 digits.");
            return;
        }

        const token = verificationToken;

        try {
            setIsVerifying(true);
            const response = await axios.post(
                "http://localhost:5005/api/auth/verify",
                {
                    identifier,
                    verificationCode,
                    verificationToken: token,
                }
            );

            if (response.data.message.includes("successfully")) {
                setStep(3); // Close the modal upon successful verification
            } else {
                setErrorMessage(
                    response.data.message || "Verification failed."
                );
            }
        } catch (error) {
            console.error("Verification error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during verification."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    // Handle password submission for Step 3
    const handleSubmitStep3 = async () => {
        if (!password) {
            setErrorMessage("Please enter a password.");
            return;
        }

        try {
            if (password.length < 8) {
                setErrorMessage(
                    "Your password needs to be at least 8 characters. Please enter a longer one."
                );
                return;
            }

            const response = await axios.post(
                "http://localhost:5005/api/auth/set-password",
                { identifier, password }
            );

            console.log("Password set response:", response); // Log the full response

            if (response.data.message.includes("successfully")) {
                setStep(4); // Move to Step 4 (Profile Setup)
            } else if (response.data.message.includes("stronger password")) {
                setErrorMessage(
                    response.data.message || "Please choose a stronger password."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } catch (error) {
            console.error("Error in password submission:", error); // Log the full error
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during password submission."
            );
        }


    };

    useEffect(() => {
        if (isOpen) {
            const inputRef =
                step === 1
                    ? nameInputRef
                    : step === 2
                    ? verificationCodeInputRef
                    : null;
            if (inputRef && inputRef.current) {
                const timer = setTimeout(() => inputRef.current.focus(), 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, step]);

    const getSubmitStep = () => {
        switch (step) {
            case 1:
                return handleSubmitStep1;
            case 2:
                return handleSubmitStep2;
            case 3:
                return handleSubmitStep3;
            // case 4:
            //     return handleSubmitStep4;
            default:
                return undefined;
        }
    };

    const getButtonCondition = () => {
        switch (step) {
            case 1:
                return (
                    name &&
                    identifier &&
                    selectedMonth &&
                    selectedDay &&
                    selectedYear
                );
            case 2:
                return verificationCode.length === 6;
            case 3:
                return password.length >= 8;
            default:
                return false;
        }
    };

    const getButtonText = () => {
        switch (step) {
            case 1:
                return "Next";
            case 2:
                return "Next";
            case 3:
                return "Sign up";
            default:
                return "Next";
        }
    };

    const getTitle = () => {
        switch (step) {
            case 1:
                return "Create your account";
            case 2:
                return "We sent you a code";
            case 3:
                return "You'll need a password";
            case 4:
                return "Complete profile setup";
            default:
                return "Signup";
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Step1Content
                        name={name}
                        identifier={identifier}
                        placeholder={placeholder}
                        setErrorMessage={setErrorMessage}
                        errorMessage={errorMessage}
                        selectedMonth={selectedMonth}
                        selectedDay={selectedDay}
                        selectedYear={selectedYear}
                        handleInputChange={handleInputChange}
                        togglePlaceholder={togglePlaceholder}
                        handleSubmitStep1={handleSubmitStep1}
                        setName={setName}
                        setSelectedMonth={setSelectedMonth}
                        setSelectedDay={setSelectedDay}
                        setSelectedYear={setSelectedYear}
                        nameInputRef={nameInputRef}
                    />
                );
            case 2:
                return (
                    <Step2Content
                        identifier={identifier}
                        verificationCode={verificationCode}
                        errorMessage={errorMessage}
                        setErrorMessage={setErrorMessage}
                        handleInputChange={setVerificationCode}
                        handleSubmitStep2={handleSubmitStep2}
                        openDropdown={() => setDropdownOpen(true)}
                        closeDropdown={() => setDropdownOpen(false)}
                        dropdownOpen={dropdownOpen}
                        verificationCodeInputRef={verificationCodeInputRef}
                    />
                );
            case 3:
                return (
                    <Step3Content
                        password={password}
                        errorMessage={errorMessage}
                        handleInputChange={setPassword}
                        handleSubmitStep3={handleSubmitStep3}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        passwordInputRef={passwordInputRef}
                    />
                );
            case 4:
                return <Step4Content />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (isOpen && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            buttonCondition={getButtonCondition()}
            handleSubmitStepX={getSubmitStep()} 
            buttonText={getButtonText()}
        >
            {renderStepContent()}
        </ModalBase>
    );
};

export default SignupFlow;

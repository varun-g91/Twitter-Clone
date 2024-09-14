import React, { useState, useRef, useEffect } from "react";
import ModalBase from "./ModalBase";
import Step1Content from "./steps/Step1Content";
import Step2Content from "./steps/Step2Content";
import Step3Content from "./steps/Step3Content";
import { submitSignup, submitVerification, submitPassword } from "./utils/apiCalls.js";
import { handleApiError, handleSuccess } from "./utils/apiHelpers.js";
import Spinner from '../common'


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

    const togglePlaceholder = () => {
        setPlaceholder((prev) => (prev === "Phone" ? "Email" : "Phone"));
        setIdentifier("");
        setErrorMessage("");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        validateIdentifier(value);
    };

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
            const response = await submitSignup(
                name,
                identifier,
                selectedMonth,
                selectedDay,
                selectedYear
            );
            handleSuccess(response, setVerificationToken, setStep);
        } catch (error) {
            handleApiError(error, setErrorMessage);
        }
    };

    const handleSubmitStep2 = async () => {
        if (verificationCode.length !== 6) {
            setErrorMessage("The verification code must be 6 digits.");
            return;
        }

        try {
            setIsVerifying(true);
            const response = await submitVerification(
                identifier,
                verificationCode,
                verificationToken
            );
            handleSuccess(response, () => setStep(3));
        } catch (error) {
            handleApiError(error, setErrorMessage);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSubmitStep3 = async () => {
        if (!password || password.length < 8) {
            setErrorMessage(
                "Your password needs to be at least 8 characters long."
            );
            return;
        }

        try {
            const response = await submitPassword(identifier, password);
            handleSuccess(response, () => setStep(4));
        } catch (error) {
            handleApiError(error, setErrorMessage);
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
        <ModalBase isOpen={isOpen} onClose={onClose} title={getTitle()}>
            {renderStepContent()}
        </ModalBase>
    );
};

export default SignupFlow;

import { useContext, useEffect, useRef, useState } from "react";
import InputField from "../components/InputField";
import ResendDropdown from "../components/ResendDropdown";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import { SignupContext } from "../SignupContext";

const Step2Content = ({ isOpen }) => {
    const {
        identifier,
        setStep,
        verificationToken,
        errorMessage,
        setErrorMessage,
        isLoading,
        toggleLoading,
    } = useContext(SignupContext);
    const [verificationCode, setVerificationCode] = useState("");
    const verificationCodeInputRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);



    const isStep2Complete = verificationCode.length === 6;

    useEffect(() => {
        if (isOpen) {
            const inputRef = verificationCodeInputRef.current;
            if (inputRef && inputRef.current) {
                const timer = setTimeout(() => inputRef.current.focus(), 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen]);

    const handleInputChange = (value) => {
        setVerificationCode(value);
        setErrorMessage("");
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        toggleLoading();

        const payload = {
            identifier,
            verificationCode,
            verificationToken,
        };

        try {
            const response = await axios.post(
                "http://localhost:5005/api/auth/verify",
                payload
            );
            if (response.data.message.includes("successfully")) {
                setErrorMessage("");
                setStep(3); // Move to Step 3 (Password Setup)
            } else if (response.data.message.includes("Invalid")) {
                setErrorMessage(response.data.message || "Invalid code.");
            } else if (response.data.message.includes("E11000")) {
                setErrorMessage("Sign up failed");
            } else if (response.data.message.includes("expired")) {
                setErrorMessage("Expired code.");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(
                    error.response.data.message || "An error occurred."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } finally {
            toggleLoading();
        }
    };

    return (
        <div className="flex flex-col items-stretch justify-center w-full h-full max-w-[27.5rem] mx-auto">
            <div className="flex flex-col items-stretch justify-center">
                <div className="relative bottom-6">
                    <div className="text-[0.949rem] mt-4 relative bottom-[0.3rem] leading-5 text-[#71767B] ">
                        <span>Enter it below to verify&nbsp;</span>
                        <span>{identifier || "your email"}.</span>
                    </div>
                    <div className="py-3 w-full flex flex-col">
                        <InputField
                            id="verification-code"
                            type="text"
                            value={verificationCode}
                            onChange={(e) => {
                                handleInputChange(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="Verification code"
                            errorMessage={errorMessage}
                            inputRef={verificationCodeInputRef}
                            label="Verification Code"
                        />
                        <div className="ml-2 relative bottom-[0.6rem] font-thin font-custom2 text-[0.8rem] ">
                            <button
                                className="text-[#1d9bf0] hover:underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleDropdown();
                                }}
                                type="button"
                            >
                                {identifier.includes("@")
                                    ? "Didn't receive email?"
                                    : "Didn't receive SMS?"}
                            </button>
                            <br />
                            <span className="text-red-500 text-xs mt-2 mb-0">
                                {errorMessage || "\u00A0\u00A0"}
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <ResendDropdown
                        dropdownOpen={dropdownOpen}
                        identifier={identifier}
                        verificationCode={verificationCode}
                        closeDropdown={toggleDropdown}
                        setErrorMessage={setErrorMessage}
                        toggleLoading={toggleLoading}
                        verificationToken={verificationToken}
                    />
                </div>
            </div>

            {!isLoading ? (
                <div className="flex flex-col items-stretch justify-center mt-[16.3rem]">
                    <CustomButton
                        step={2}
                        buttonCondition={isStep2Complete}
                        handleSubmit={handleSubmit}
                        buttonText="Next"
                    />
                </div>
            ) : undefined}
        </div>
    );
};

export default Step2Content;

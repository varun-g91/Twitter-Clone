import { useContext, useEffect, useRef, useState } from "react";
import InputField from "../../../../components/common/InputField";
import ResendDropdown from "../components/ResendDropdown";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import CustomButton from "../../../../components/common/CustomButton";
import { SignupContext } from "../SignupContext";
import toast from "react-hot-toast";

const Step2Content = ({ isOpen }) => {
    const {
        identifier,
        setStep,
        verificationToken,
        errorMessage,
        setErrorMessage,
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
        setErrorMessage("");
    };
    // Handle verification process with React Query
    const { mutate: verifyCodeMutation, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                "http://localhost:5005/api/auth/verify",
                {
                    verificationToken,
                    verificationCode,
                }
            );

            if (
                !response.data ||
                !response.data.message.includes("successfully")
            ) {
                console.log(response?.data?.message);
                throw new Error(
                    response.data?.message || "Verification failed."
                );
            }

            return response.data;
        },
        onSuccess: () => {
            setErrorMessage("");
            setStep(3); // Move to Step 3 (Password Setup)
        },
        onError: (error) => {
            console.log(error);
            const message =
                error.response?.data?.message ||
                "An unexpected error occurred.";
            setErrorMessage(message);
            toast.error(message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isStep2Complete) {
            setErrorMessage("Please enter a 6-digit verification code.");
            return;
        }

        verifyCodeMutation();
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

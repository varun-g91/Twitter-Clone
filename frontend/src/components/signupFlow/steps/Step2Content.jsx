import React from "react";
import InputField from "../components/InputField";
import ResendDropdown from "../components/ResendDropdown";

const Step2Content = ({
    identifier,
    verificationCode,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSubmitStep2,
    openDropdown,
    closeDropdown,
    dropdownOpen,
    verificationCodeInputRef,
}) => {
    const isStep2Complete = verificationCode.length === 6;

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
                            onChange={(e) => handleInputChange(e.target.value)}
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
                                    openDropdown();
                                }}
                                type="button"
                            >
                                {identifier.includes("@")
                                    ? "Didn't receive email?"
                                    : "Didn't receive SMS?"}
                            </button>
                            <div className="text-red-500 text-xs mt-2 mb-[11rem]">
                                {verificationCode.length === 6 ? errorMessage : undefined}{" "}
                                {/* Keeps height consistent */}
                            </div>
                        </div>
                    </div>
                </div>
                <ResendDropdown
                    dropdownOpen={dropdownOpen}
                    identifier={identifier}
                    verificationCode={verificationCode}
                    closeDropdown={closeDropdown}
                    setErrorMessage={setErrorMessage}
                />
            </div>
        </div>
    );
};

export default Step2Content;

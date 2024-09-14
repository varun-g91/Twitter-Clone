import React from "react";
import InputField from "../InputField";
import ResendDropdown from "../ResendDropdown";

const Step2Content = ({
    identifier,
    verificationCode,
    errorMessage,
    handleInputChange,
    handleSubmitStep2,
    openDropdown,
    closeDropdown,
    dropdownOpen,
    verificationCodeInputRef,
}) => {
    return (
        <>
            <div className="flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative p-0 justify-center font-custom leading-[2.25rem] max-w-[27.5rem] text-[1.938rem] text m-w-0 w-full h-full max-h-[4.75rem]">
                <div className="my-5 flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative justify-center top-11">
                    <div className="font-custom2 font-extralight text-[0.94rem] text text-[#71767B] inline-block ">
                        <span>Enter it below to verify&nbsp;</span>
                        <span>{identifier || "your email"}.</span>
                    </div>
                    <div className="py-3 input-container font-custom2">
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
                        <button
                            className="text-[#1d9bf0] font-sans flex justify-start text-[0.8rem] relative bottom-5 text hover:underline"
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
                    </div>
                    <ResendDropdown
                        dropdownOpen={dropdownOpen}
                        identifier={identifier}
                        verificationCode={verificationCode}
                        closeDropdown={closeDropdown}
                        setErrorMessage={setErrorMessage}
                    />
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex flex-col items-stretch justify-center flex-shrink-0 box-border relative mt-20 top-[14.9rem] font-sans text-sm">
                        {verificationCode.length !== 6 ? (
                            <button className="bg-[#787a7a] h-[3.25rem] rounded-full">
                                <span className="text-[#0f1419] font-bold text whitespace-nowrap text-[1.063rem]">
                                    Next
                                </span>
                            </button>
                        ) : (
                            <button
                                className="bg-[#D7DBDC] h-[3.25rem] rounded-full"
                                onClick={handleSubmitStep2}
                            >
                                <span className="text-[#0f1419] font-bold text whitespace-nowrap text-[1.063rem]">
                                    Next
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2Content;

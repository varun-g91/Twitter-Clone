import React, { useContext, useEffect, useRef, useState } from "react";
import InputField from "../components/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../../custom.css";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import { SignupContext } from "../SignupContext";

const Step3Content = () => {
    const {
        errorMessage,
        setErrorMessage,
        identifier,
        setStep,
        toggleLoading,
        isLoading,
    } = useContext(SignupContext);


    const [password ,setPassword] = useState("");
    const [showPassword ,setShowPassword] = useState("");
    const passwordInputRef = useRef(null);
    // In SignupFlow component
    const handlePasswordChange = (password) => {
        setPassword(password);
        setErrorMessage("");
    };

    const handleSubmit = async () => {
        if (!password) {
            setErrorMessage("Please enter a password.");
            return;
        }

        try {
            toggleLoading();
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
                setErrorMessage("");
                setStep(4); // Move to Step 4 (Profile Setup)
            } else if (response.data.message.includes("stronger password")) {
                setErrorMessage(
                    response.data.message ||
                        "Please choose a stronger password."
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
        } finally {
            toggleLoading();
        }
    };

    return (
        <div className="flex flex-col items-stretch justify-center w-full mx-auto">
            {/* Heading */}
            <div className="text-start flex flex-row w-full items-stretch relative bottom-3">
                <p className="text-[#71767B] font-custom2 text-[0.938rem] font-thin">
                    Make sure it's 8 characters or more.
                </p>
            </div>

            {/* Password Input */}
            <div className="w-full mb-6">
                <div className="flex flex-col items-stretch justify-center">
                    <InputField
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            handlePasswordChange(e.target.value);
                            setErrorMessage("");
                        }}
                        placeholder="Password"
                        errorMessage={errorMessage}
                        label="Password"
                        inputRef={passwordInputRef}
                    />
                    <span
                        className="flex w-fit -inset-y-10 inset-x-[94%] relative text-xl font-compact"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <FiEyeOff className="text-[#e7e9ea] cursor-pointer" />
                        ) : (
                            <FiEye className="text-[#e7e9ea] cursor-pointer" />
                        )}
                    </span>
                    {/* Terms & Privacy Policy */}
                    <div className="text-[0.813rem] text-[#71767B] text-left font-custom2 font-thin leading-4 mb-44 bottom-4 relative ">
                        <p>
                            By signing up, you agree to the{" "}
                            <a
                                href="#"
                                className="text-[#139BF0] hover:underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-[#139BF0] hover:underline"
                            >
                                Privacy Policy
                            </a>
                            , including{" "}
                            <a
                                href="#"
                                className="text-[#139BF0] hover:underline"
                            >
                                Cookie Use
                            </a>
                            . X may use your contact information, including your
                            email address and phone number for purposes outlined
                            in our Privacy
                            <br /> Policy, like keeping your account secure and
                            personalizing our services, including ads.{" "}
                            <a
                                href="#"
                                className="text-[#139BF0] hover:underline"
                            >
                                Learn more
                            </a>
                            . Others will be able to find you by email or
                            <br /> phone number, when provided, unless you
                            choose otherwise{" "}
                            <a
                                href="#"
                                className="text-[#139BF0] hover:underline"
                            >
                                here
                            </a>
                            .
                        </p>
                    </div>
                </div>
                {/* Error Message */}
                <span className="text-red-500 text-xs mt-2 mb-0">
                    {errorMessage || "\u00A0"}
                </span>
            </div>

            {!isLoading ? (
                <div className="flex flex-col items-stretch justify-center w-full mt-0">
                    <CustomButton
                        step={3}
                        buttonCondition={true}
                        handleSubmit={handleSubmit}
                        buttonText="Next"
                    />
                </div>
            ) : undefined}
        </div>
    );
};

export default Step3Content;

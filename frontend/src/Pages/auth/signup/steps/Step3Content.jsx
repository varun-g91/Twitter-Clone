    import React, { useContext, useEffect, useRef, useState } from "react";
    import InputField from "../../../../components/common/InputField";
    import { FiEye, FiEyeOff } from "react-icons/fi";
    import "../../../../custom.css";
    import axios from "axios";
    import { SignupContext } from "../SignupContext";
    import CustomButton from "../../../../components/common/CustomButton";
import { useMutation } from "@tanstack/react-query";

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

        const { mutate: setPasswordMutation } = useMutation({
            mutationFn: async () => {
                try {
                    const response = await axios.post(
                        "/api/auth/set-password",
                        {
                            identifier,
                            password,
                        }
                    );
                    return response.data;
                } catch (error) {
                    // Extract error message from the backend response
                    throw new Error(
                        error.response?.data?.message ||
                            error.message ||
                            "Failed to set password"
                    );
                }
            },
            onSuccess: () => {
                setErrorMessage("");
                setStep(4); // Move to Step 4 (Profile Setup)
            },
            onError: (error) => {
                setErrorMessage(error.message);
            },
        });

        const handleSubmit = async () => {
            if (!password) {
                setErrorMessage("Please enter a password.");
                return;
            } else if (password.length < 8) {
                setErrorMessage("Password must be at least 8 characters long.");
                return;
            }

            setPasswordMutation();
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
                <div className="w-full mb-0">
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
                                <FiEyeOff className="text-[#e7e9ea] cursor-pointer z-50" />
                            ) : (
                                <FiEye className="text-[#e7e9ea] cursor-pointer z-50" />
                            )}
                        </span>

                        {/* Terms & Privacy Policy */}
                        <div className="text-[0.813rem] mt-2 text-[#71767B] flex flex-col space-y-6 text-left font-custom2 font-thin leading-4 mb-24  bottom-4 relative ">
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
                                . X may use your contact information, including
                                your email address and phone number for purposes
                                outlined in our Privacy
                                <br /> Policy, like keeping your account secure
                                and personalizing our services, including ads.{" "}
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
                            <span className="text-red-500 flex h-10 text-xs mt-0 break-words">
                                {errorMessage || "\u00A0"}
                            </span>
                        </div>
                    </div>
                </div>

                {!isLoading ? (
                    <div className="flex flex-col items-stretch justify-center w-full mt-[3.3rem] relative">
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

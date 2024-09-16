import React from "react";
import InputField from "../components/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";
import '../../../custom.css'

const Step3Content = ({
    password,
    errorMessage,
    handleInputChange,
    handleSubmitStep3,
    showPassword,
    setShowPassword,
    passwordInputRef,
}) => {
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
                        onChange={(e) => handleInputChange(e.target.value)}
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
                            <FiEyeOff className="text-[#e7e9ea]" />
                        ) : (
                            <FiEye className="text-[#e7e9ea]" />
                        )}
                    </span>
                </div>
            {/* Error Message */}
            <div className="text-red-500 text-xs">
                {errorMessage ? errorMessage : undefined}{" "}
                {/* Keeps height consistent */}
            </div>
            </div>

            {/* Terms & Privacy Policy */}
            <div className="text-[0.813rem] text-[#71767B] text-left font-custom2 font-thin leading-4 mt-28 relative top-14">
                <p>
                    By signing up, you agree to the{" "}
                    <a href="#" className="text-[#139BF0] hover:underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-[#139BF0] hover:underline">
                        Privacy Policy
                    </a>
                    , including{" "}
                    <a href="#" className="text-[#139BF0] hover:underline">
                        Cookie Use
                    </a>
                    . X may use your contact information, including your email
                    address and phone number for purposes outlined in our
                    Privacy<br /> Policy, like keeping your account secure and
                    personalizing our services, including ads.{" "}
                    <a href="#" className="text-[#139BF0] hover:underline">
                        Learn more
                    </a>
                    . Others will be able to find you by email or<br /> phone number,
                    when provided, unless you choose otherwise{" "}
                    <a href="#" className="text-[#139BF0] hover:underline">
                        here
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default Step3Content;

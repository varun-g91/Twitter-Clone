import React from "react";
import InputField from "../InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
        <div className="flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative p-0 justify-center font-custom leading-[2.25rem] max-w-[27.5rem] text-[1.938rem] text m-w-0 w-full max-h-fit">
            <div className="my-3 flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative justify-center">
                <div className="flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative justify-center max-h-[4rem]">
                    <div className="font-custom2 font-extralight text-[0.94rem] text text-[#71767B] inline-block relative bottom-8">
                        <span>Make sure it's 8 characters or more.</span>
                    </div>
                    <div className="py-3 input-container font-custom2 relative bottom-[1.8rem]">
                        <div className="relative w-full">
                            <InputField
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) =>
                                    handleInputChange(e.target.value)
                                }
                                placeholder="Password"
                                errorMessage={errorMessage}
                                label="Password"
                                inputRef={passwordInputRef}
                            />
                            <span
                                className="absolute inset-y-5 right-0 flex items-end pr-3 cursor-pointer text-xl"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FiEyeOff className="text-[#e7e9ea]" />
                                ) : (
                                    <FiEye className="text-[#e7e9ea]" />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-red-500 text-sm mt-2">
                        {errorMessage}
                    </div>
                )}
                <div className="flex flex-col items-stretch justify-center flex-shrink-0 max-w-[27.5rem] w-full box-border relative top-[12.5rem] font-sans text-sm">
                    <div className="flex flex-col max-h-fit items-stretch justify-center flex-shrink-0 box-border relative my-[0.74rem]">
                        <p className="text-[#71767b] font-thin font-custom2 leading-4 text-[0.813rem] text text-left">
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
                            in our Privacy &nbsp; Policy, like keeping your
                            account secure and personalizing our services,
                            including ads.{" "}
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
                    <div className="flex flex-col items-stretch justify-center flex-shrink-0 box-border relative my-3">
                        {password.length < 8 ? (
                            <button className="bg-[#787a7a] h-[3.25rem] rounded-full">
                                <span className="text-[#0f1419] font-bold font-custom2 text whitespace-nowrap text-[1.063rem]">
                                    Sign up
                                </span>
                            </button>
                        ) : (
                            <button
                                className="bg-[#D7DBDC] h-[3.25rem] rounded-full"
                                onClick={handleSubmitStep3}
                            >
                                <span className="text-[#0f1419] font-bold font-custom2 text whitespace-nowrap text-[1.063rem]">
                                    Sign up
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3Content;

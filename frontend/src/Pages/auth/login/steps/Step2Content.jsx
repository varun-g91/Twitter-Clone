    import { useState } from "react";
    import InputField from "../../../../components/common/InputField";
    import CustomButton from "../../../../components/common/CustomButton";
    import { FiEye, FiEyeOff } from "react-icons/fi";
    import axios from "axios";
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { useNavigate } from "react-router-dom";

    const ReadOnlyField = ({ label, value }) => {
        return (
            <div className="flex flex-col items-start space-y-2 h-[3.6rem] px-2 mt-1 rounded-[0.25rem] bg-[#101214] cursor-not-allowed">
                <label className="text-[#393B3E] text-xs mr-4 mt-[0.3rem]">
                    {label}:
                </label>
                <span className="text-[1rem] text-[#393B3E] font-custom2 relative bottom-1">
                    {value}
                </span>
            </div>
        );
    };

    const Step2Content = ({ identifier, handleSwitchToSignup, setStep }) => {
        const queryClient = useQueryClient();
        const navigate = useNavigate();

        const [password, setPassword] = useState("");
        const [showPassword, setShowPassword] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");

        const handlePasswordChange = (e) => {
            setPassword(e.target.value);
        };

        const { mutate: login, isLoading } = useMutation({
            mutationFn: async () => {
                const response = await axios.post("api/auth/login", {
                    identifier,
                    password,
                    step: 2,
                });

                // Check the response status code manually
                if (response.status !== 200) {
                    throw new Error(
                        response.data?.message ||
                            "Login failed. Please try again."
                    );
                }

                return response.data;
            },
            onSuccess: () => {
                setErrorMessage("");
                queryClient.invalidateQueries({ queryKey: ["authUser"] });
                navigate("/home");
            },
            onError: (error) => {
                // Log the error to see the details
                console.log("Full Error Object:", error);

                // Check if error is a known Axios error (with response)
                if (error.response) {
                    setErrorMessage(
                        error.response.data?.message ||
                            "An unexpected error occurred."
                    );
                } else {
                    setErrorMessage("Network error. Please try again.");
                }
            },
        });


        const handleSubmit = async () => {
            if (!password) {
                setErrorMessage("Please enter your password.");
                return;
            }

            login();
        };

        return (
            <div className="flex flex-col">
                <div className="space-y-3 mt-4 max-h-[10rem] h-full ">
                    <ReadOnlyField label="Username" value={identifier} />

                    <InputField
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        label="Password"
                        errorMessage={errorMessage}
                    />
                    <span
                        className="flex w-fit -inset-y-14 inset-x-[93.5%] relative text-xl font-compact"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <FiEyeOff className="text-[#e7e9ea] cursor-pointer z-50" />
                        ) : (
                            <FiEye className="text-[#e7e9ea] cursor-pointer z-50" />
                        )}
                    </span>
                    <span className="text-red-500 flex h-10 text-xs mt-0 break-words">
                        {errorMessage || "\u00A0"}
                    </span>
                </div>
                <div className="mt-0 relative bottom-4 left-2">
                    <span className="text-[13px] text-[#1D9BF0]">
                        <a href="#">Forgot password?</a>
                    </span>
                </div>

                <div className="flex flex-col items-stretch mt-[12.5rem]">
                    <CustomButton
                        step={2}
                        buttonCondition={password.length > 0}
                        handleSubmit={handleSubmit}
                        buttonText="Log in"
                        disabled={isLoading}
                    />
                    <div className="mt-5">
                        <p className="text-[#71767b] font-custom2 text-[15px]">
                            Don't have an account?{" "}
                            <span className="text-[#1d9bf0]">
                                <button onClick={handleSwitchToSignup}>
                                    Sign up
                                </button>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    export default Step2Content;

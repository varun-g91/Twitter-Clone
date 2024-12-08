import { useState, useRef, useContext } from "react";
import InputField from "../../../../components/common/InputField";
import DateSelector from "../components/DateSelector";
import CustomButton from "../../../../components/common/CustomButton";
import { SignupContext } from "../SignupContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const Step1Content = () => {
    const {
        setStep,
        setIdentifier,
        errorMessage,
        identifier,
        setVerificationToken,
        setErrorMessage,
        name,
        setIsLoading,
        setName,
    } = useContext(SignupContext);

    const [placeholder, setPlaceholder] = useState("Phone");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const nameInputRef = useRef(null);

    const togglePlaceholder = () => {
        setPlaceholder((prev) => (prev === "Phone" ? "Email" : "Phone"));
        setIdentifier("");
        setErrorMessage("");
    };

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

    const handleInputChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        validateIdentifier(value);
    };

    // UseMutation Hook
    const { mutate: signupMutation } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/auth/signup", {
                fullName: name,
                identifier,
                dateOfBirth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
            });

            if (!response.data) {
                console.log(response?.data?.message);
                throw new Error(response?.data?.message || "Failed to signup");
            }

            return response.data;
        },
        onMutate: () => {
            setIsLoading(true); // Set loading to true before mutation
        },
        onSuccess: (data) => {
            setVerificationToken(data.verificationToken);
            setStep((prev) => prev + 1); // Move to Step 2
            setErrorMessage("");
        },
        onError: (error) => {
            console.log(error.response?.data?.message || "Signup failed.");
            toast.error(error.response?.data?.message || "Signup failed.");
            setErrorMessage(error.response?.data?.message || "Signup failed.");
        },
        onSettled: () => {
            setIsLoading(false); // Set loading to false after mutation finishes
        },
    });


    const handleSubmit = (e) => {
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

        signupMutation();
    };

    return (
        <>
            <form
                className="flex flex-col items-stretch justify-center max-h-[22.8rem] h-full relative space-y-5"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col items-stretch justify-center">
                    <div className="flex flex-col">
                        <div className="">
                            <InputField
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setErrorMessage("");
                                    setName(e.target.value);
                                }}
                                placeholder="Name"
                                label="Name"
                                inputRef={nameInputRef}
                            />
                        </div>

                        <div className="">
                            <InputField
                                id={placeholder.toLowerCase()}
                                type="text"
                                value={identifier}
                                onChange={handleInputChange}
                                onBlur={(e) =>
                                    e.target.value.length > 0
                                        ? validateIdentifier(e.target.value) &&
                                          setErrorMessage("")
                                        : undefined
                                }
                                placeholder={placeholder}
                                label={placeholder}
                                errorMessage={errorMessage}
                                className="w-full p-3 border border-gray-500 rounded-md text-[1rem]"
                            />
                        </div>
                    </div>
                    <span className="text-red-500 text-xs mt-2 mb-0">
                        {errorMessage || "\u00A0"}
                    </span>

                    <div className="flex flex-col mt-2">
                        <button
                            className="text-[#1d9bf0] font-custom2 text-[0.938rem] leading-5 font-thin self-end hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                togglePlaceholder();
                            }}
                            type="button"
                        >
                            {placeholder === "Phone"
                                ? "Use email instead"
                                : "Use phone instead"}
                        </button>
                    </div>

                    <div className="flex flex-col mt-5 font-custom2 ">
                        <h2 className="text-[#E7E9EA] font-bold text-[0.938rem] leading-5 mb-2">
                            Date of birth
                        </h2>
                        <p className="text-[#71767B] text-[0.875rem] leading-5">
                            This will not be shown publicly. Confirm your own
                            age, even if this account is for a business, a pet,
                            or something else.
                        </p>
                        <DateSelector
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedDay={selectedDay}
                            setSelectedDay={setSelectedDay}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                        />
                    </div>
                </div>
            </form>

            {!signupMutation.isLoading ? (
                <div className="flex flex-col items-stretch justify-center mt-20">
                    <CustomButton
                        step={1}
                        buttonCondition={
                            name &&
                            identifier &&
                            selectedMonth &&
                            selectedDay &&
                            selectedYear
                        }
                        handleSubmit={handleSubmit}
                        buttonText="Next"
                    />
                </div>
            ) : undefined}
        </>
    );
};

export default Step1Content;
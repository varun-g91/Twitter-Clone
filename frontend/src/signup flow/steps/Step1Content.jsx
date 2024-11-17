import { useState, useEffect, useRef, useContext } from "react";
import InputField from "../components/InputField";
import DateSelector from "../components/DateSelector";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { SignupContext } from "../SignupContext";

const Step1Content = () => {
    const {
        setStep,
        setIdentifier,
        errorMessage,
        identifier,
        verificationToken,
        setVerificationToken,
        isLoading,
        setErrorMessage,
        toggleLoading,
        name,
        setName,
    } = useContext(SignupContext);

    // const [name, setName] = useState("");
    const [placeholder, setPlaceholder] = useState("Phone");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const nameInputRef = useRef(null);
    // const [verificationToken, setVerificationToken] = useState("");



    const isStep1Complete =
        name && identifier && selectedMonth && selectedDay && selectedYear;

    const togglePlaceholder = () => {
        setPlaceholder((prev) => (prev === "Phone" ? "Email" : "Phone"));
        setIdentifier("");
        setErrorMessage("");
    };

    

    const handleInputChange = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        validateIdentifier(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isStep1Complete) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            toggleLoading();
            const response = await axios.post(
                "http://localhost:5005/api/auth/signup",
                {
                    fullName: name,
                    identifier, // Can be either phone or email
                    dateOfBirth: `${selectedYear}-${selectedMonth}-${selectedDay}`,
                }
            );

            if (response.data.message.includes("successfully")) {
                setVerificationToken(response.data.verificationToken);
                console.log("Verification token:", verificationToken);
                setErrorMessage("");
                setStep((prev) => {
                    const newStep = prev + 1;
                    console.log("New Step: ", newStep); // Log to confirm step increment
                    return newStep;
                }); // Move to Step 2 (Verification)
            } else if (response.data.message.includes("EE11000")) {
                setErrorMessage("User already exists.");
            } else {
                setErrorMessage("Signup failed.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during signup."
            );
        } finally {
            toggleLoading();
        }
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

            {!isLoading ? (
                <div className="flex flex-col items-stretch justify-center mt-20">
                    <CustomButton
                        step={1}
                        buttonCondition={isStep1Complete}
                        handleSubmit={handleSubmit}
                        buttonText="Next"
                    />
                </div>
            ) : undefined}
        </>
    );
};

export default Step1Content;

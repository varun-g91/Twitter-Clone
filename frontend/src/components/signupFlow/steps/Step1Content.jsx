import React from "react";
import InputField from "../components/InputField";
import DateSelector from "../components/DateSelector";

const Step1Content = ({
    name,
    identifier,
    placeholder,
    setErrorMessage,
    errorMessage,
    selectedMonth,
    selectedDay,
    selectedYear,
    handleInputChange,
    togglePlaceholder,
    handleSubmitStep1,
    setName,
    setSelectedMonth,
    setSelectedDay,
    setSelectedYear,
    nameInputRef,
}) => {
    const isStep1Complete =
        name && identifier && selectedMonth && selectedDay && selectedYear;

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
        <form
            className="flex flex-col items-stretch justify-center max-h-[22.8rem] h-full relative space-y-5"
            onSubmit={handleSubmitStep1}
        >
            <div className="flex flex-col items-stretch justify-center">
                <div className="flex flex-col">
                    <div className="">
                        <InputField
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                                    ? validateIdentifier(e.target.value)
                                    : undefined
                            }
                            placeholder={placeholder}
                            label={placeholder}
                            errorMessage={errorMessage}
                            className="w-full p-3 border border-gray-500 rounded-md text-[1rem]"
                        />
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-red-500 text-sm mt-1">
                        {errorMessage}
                    </div>
                )}

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
                        This will not be shown publicly. Confirm your own age,
                        even if this account is for a business, a pet, or
                        something else.
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
    );
};

export default Step1Content;

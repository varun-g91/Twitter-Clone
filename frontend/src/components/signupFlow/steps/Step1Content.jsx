import React from "react";
import InputField from "../InputField";
import DateSelector from "../DateSelector";

const Step1Content = ({
    name,
    identifier,
    placeholder,
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
    return (
        <form
            className="flex mt-6 flex-col items-stretch justify-center max-h-[22.8rem] h-full relative"
            onSubmit={handleSubmitStep1}
        >
            <div>
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
            <div className="mt-[0.99rem]">
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
                />
            </div>
            {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
            )}
            <button
                className="text-[#1d9bf0] font-sans flex justify-end text hover:underline"
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
            <div className="mt-5">
                <div>
                    <h2 className="text-[#E7E9EA] font-custom2 font-bold text-[0.938rem] leading-5 mb-2">
                        Date of birth
                    </h2>
                    <p className="font-normal text-[#71767B] text-[0.875rem] leading-5 font-custom2">
                        This will not be shown publicly. Confirm your own age,
                        even if this account is for a business, a pet, or
                        something else.
                    </p>
                </div>
                <DateSelector
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                />
                <div className="flex flex-col items-stretch justify-center flex-shrink-0 box-border relative mt-20">
                    {name === "" ||
                    identifier === "" ||
                    selectedMonth === "" ||
                    selectedDay === "" ||
                    selectedYear === "" ? (
                        <button className="bg-[#787a7a] h-[3.25rem] rounded-full">
                            <span className="text-[#0f1419] font-bold text whitespace-nowrap text-[1.063rem]">
                                Next
                            </span>
                        </button>
                    ) : (
                        <button
                            className="bg-[#D7DBDC] h-[3.25rem] rounded-full"
                            type="submit"
                        >
                            <span className="text-[#0f1419] font-bold text whitespace-nowrap text-[1.063rem]">
                                Next
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Step1Content;

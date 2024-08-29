import React, { useState, useEffect, useRef } from "react";
import XSvg from "../svgs/X";
import { IoMdClose } from "react-icons/io";
import "../../custom.css";
import { MonthSelector, DaySelector, YearSelector } from "./CustomDropdown";
import Spinner from "../svgs/Spinner";

const SignupModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [placeholder, setPlaceholder] = useState("Phone");

    
    const [isLoading, setIsLoading] = useState(true);
    const nameInputRef = useRef(null);
    
    const toggleSelector = () => {
        setIsSelectorOpen(!isSelectorOpen);
    };

    const togglePlaceholder = () => {
        setPlaceholder('Email');
    };

    const emailToggle = () => {
        setIsUseEmailClicked(!isUseEmailClicked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, password, confirmPassword });
        onClose();
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    useEffect(() => {
        if (!isLoading && isOpen && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isLoading, isOpen]);

    useEffect(() => {
        // Simulate a loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Adjust duration as needed

        return () => clearTimeout(timer);
    }, []);


    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const years = Array.from({ length: 100 }, (_, i) => (1920 + i).toString());

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
            <div className="relative bg-black rounded-2xl flex flex-col items-stretch justify-start w-[37.5rem] h-1/2 max-h-[90vh] max-w-[80vw] min-h-[40.625rem]">
                {isLoading ? (
                    <div className="flex items-center justify-center relative h-full">
                        <Spinner />
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col min-w-0 max-w-fit w-full m-4 cursor-pointer z-10">
                            <IoMdClose
                                className="text-[1.38rem] cursor-pointer"
                                onClick={isOpen ? onClose : null}
                            />
                        </div>
                        <div className="flex flex-col items-center relative justify-start bottom-14">
                            <XSvg className="h-[3.313rem] fill-[#e7e9ea] scale-[0.6] relative inline-block overflow-hidden" />
                        </div>
                        <div className="flex flex-col items-stretch justify-start px-20 min-h-0 min-w-0 relative bottom-14">
                            <div className="flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative p-0 justify-center font-custom leading-[2.25rem] max-w-[27.5rem] text-[1.938rem] text m-w-0 w-full h-full max-h-[4.75rem]">
                                <div className="my-5 flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative justify-center">
                                    <h1>
                                        <span>Create your account</span>
                                    </h1>
                                </div>
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col items-stretch justify-center max-h-[22.8rem] h-full relative"
                            >
                                <div className="h-full w-full py-3 relative">
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        ref={nameInputRef}
                                        onChange={handleInputChange(setName)}
                                        onFocus={() => setIsNameFocused(true)}
                                        onBlur={() => setIsNameFocused(false)}
                                        className="w-full bg-inherit h-[3.6rem] px-2 pt-6 pb-2 mt-1 border border-[#333639] rounded-[0.25rem] focus:outline-none focus:ring-[2.5px] focus:ring-[#139BF0] placeholder-transparent peer"
                                        required
                                        placeholder="Name"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute left-3 top-[1.5rem] text-[#71767B] transition-all duration-300 transform scale-100 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[2rem] peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#139BF0] peer-focus:text-[1.063rem]"
                                    >
                                        Name
                                    </label>
                                    {isNameFocused && (
                                        <span className=" absolute top-[0.9rem] right-0 p-2 text-[#71767B] text-[0.85rem]">
                                            {name.length} / 50
                                        </span>
                                    )}
                                </div>
                                <div className="h-full w-full py-3 relative">
                                    <input
                                        id="phone"
                                        type="phone"
                                        value={email}
                                        onChange={handleInputChange(setEmail)}
                                        onFocus={() => setIsEmailFocused(true)}
                                        onBlur={() => setIsEmailFocused(false)}
                                        className="w-full px-2 pt-6 pb-2 bg-inherit mt-1 h-[3.6rem] border border-[#333639] rounded-[0.25rem] focus:outline-none focus:ring-[2.5px] focus:ring-[#139BF0] placeholder-transparent peer"
                                        required
                                        placeholder={placeholder}
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-3 top-[1.5rem] text-[#71767B] transition-all duration-300 transform scale-100 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[2rem] peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-[#139BF0] peer-focus:text-[1.063rem]"
                                    >
                                        Email
                                    </label>
                                    {isEmailFocused && (
                                        <span className="absolute top-[0.9rem] right-0 p-2 text-[#71767B] text-[0.85rem]">
                                            {email.length} / 50
                                        </span>
                                    )}
                                </div>
                                <button className="text-[#1d9bf0] flex justify-end text" onClick={togglePlaceholder}>
                                    Use email instead
                                </button>
                                <div className="mt-5 max-h-[9.6rem]" onClick={toggleSelector}>
                                    <div className="mb-1 font-custom text">
                                        Date of birth
                                    </div>
                                    <div className="max-w-[27.5rem] text text-[0.875rem] text-[#71767B] leading-[1rem]">
                                        This will not be shown publicly. Confirm
                                        your own age, even if this account is
                                        for a business, a pet, or something
                                        else.
                                    </div>
                                    <div className="flex flex-row w-full my-4 items-stretch box-border relative">
                                        <MonthSelector
                                            label="Month"
                                            options={months}
                                            onSelect={setSelectedMonth}
                                            selectedValue={selectedMonth}
                                            toggleSelector={toggleSelector}
                                        />
                                        <DaySelector
                                            label="Day"
                                            options={days}
                                            onSelect={setSelectedDay}
                                            selectedValue={selectedDay}
                                            toggleSelector={toggleSelector}
                                        />
                                        <YearSelector
                                            label="Year"
                                            options={years}
                                            onSelect={setSelectedYear}
                                            selectedValue={selectedYear}
                                            toggleSelector={toggleSelector}
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="flex flex-col items-stretch justify-center flex-shrink-0 box-border relative mt-20">
                                <button className="bg-[#787a7a] h-[3.25rem] rounded-full">
                                    <span className="text-[#0f1419] font-bold text whitespace-nowrap text-[1.063rem]">
                                        Next
                                    </span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SignupModal;

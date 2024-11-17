import React, { useState, useEffect, useRef } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import "../../custom.css";

const CustomDropdown = ({
    options,
    label,
    onSelect,
    selectedValue,
    width,
    isOpen,
    toggleVisibility,
}) => {
    const [isSelectorFocused, setIsSelectorFocused] = useState(false);
    const dropdownRef = useRef(null); // Ref to track the dropdown container

    useEffect(() => {
        setIsSelectorFocused(isOpen);
    }, [isOpen]);

    useEffect(() => {
        // Function to handle clicks outside the dropdown
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                if (isSelectorFocused) {
                    toggleVisibility(); // Close dropdown if clicked outside
                }
            }
        };

        // Add event listener for clicks outside
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSelectorFocused, toggleVisibility]);

    const handleOptionClick = (e) => {
        onSelect(e.target.value);
        toggleVisibility(); // Close dropdown after selection
    };

    return (
        <div
            ref={dropdownRef} // Attach ref to the dropdown container
            className={`relative inline-block mr-2 ${
                isSelectorFocused ? "border-[#139BF0]" : ""
            }`}
            style={{
                border: isSelectorFocused
                    ? "1px solid #139BF0"
                    : "1px solid #333630",
                borderRadius: "0.25rem",
            }}
            onClick={toggleVisibility}
        >
            <div className="custom-dropdown-container" style={{ width }}>
                <label
                    className={`${
                        isSelectorFocused ? "text-[#139BF0]" : "text-[#71767b]"
                    } pt-[1.4rem] pl-[0.5rem] text-[0.813rem] absolute top-0 left-0 transform -translate-y-[50%]`}
                >
                    {label}
                </label>
                <span className="custom-dropdown-value">{selectedValue}</span>
                <IoChevronDownSharp
                    className={`text-[1.8rem] pr-[0.5rem] absolute top-[50%] right-0 translate-y-[-50%] ${
                        isSelectorFocused ? "text-[#139BF0]" : "text-[#71767b]"
                    }`}
                />
            </div>
            {isSelectorFocused && (
                <div
                    className="custom-dropdown-options cursor-pointer absolute bg-white border border-[#333630] rounded-md mt-1 max-h-60 overflow-y-auto z-10"
                    style={{ width }}
                >
                    {options.map((option) => (
                        <div
                            key={option}
                            className="py-2 px-3 hover:bg-[#139BF0] hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOptionClick({
                                    target: { value: option },
                                });
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MonthSelector = (props) => <CustomDropdown {...props} width="12.3rem" />;
const DaySelector = (props) => <CustomDropdown {...props} width="4.9rem" />;
const YearSelector = (props) => <CustomDropdown {...props} width="6.6rem" />;

export { MonthSelector, DaySelector, YearSelector };

import React, { useState, useRef, useEffect,  } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import "../../custom.css";

const CustomDropdown = ({ options, label, onSelect, selectedValue, width, toggleSelector }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleToggleSelector = () => {
        toggleSelector = () => setIsOpen(!isOpen);
    }

    const handleSelect = (value) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <div
                className="custom-dropdown-container"
                onClick={handleToggle}
                ref={containerRef}
                style={{ width }}
            >
                <label className="custom-dropdown-label">{label}</label>
                <span className="custom-dropdown-value">{selectedValue}</span>
                <IoChevronDownSharp className="custom-dropdown-icon" />
            </div>
            {isOpen && (
                <ul className="custom-dropdown-options">
                    {options.map((option) => (
                        <li
                            key={option}
                            className="custom-dropdown-option"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const MonthSelector = (props) => <CustomDropdown {...props} width="13rem" />;
const DaySelector = (props) => <CustomDropdown {...props} width="5.7rem" />;
const YearSelector = (props) => <CustomDropdown {...props} width="7rem" />;

export { MonthSelector, DaySelector, YearSelector };

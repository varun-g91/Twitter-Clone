// BackButton.jsx
import React from "react";
import { IoMdArrowBack } from "react-icons/io";

const BackButton = ({ onBack, disabled }) => {
    return (
        <button
            onClick={onBack}
            disabled={disabled}
            className={`flex items-center text-[#e7e9ea] hover:underline text-lg font-custom2 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            <IoMdArrowBack className="mr-1" /> 
        </button>
    );
};

export default BackButton;

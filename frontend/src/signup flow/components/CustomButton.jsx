import React from "react";

const   CustomButton = ({ step, buttonCondition, handleSubmit, buttonText }) => {
    return (
        <button
            className={`h-[3.25rem] rounded-full ${
                step === 4
                    ? "bg-[#000000] border-[1px] border-[#536471] hover:bg-[#181919] text-[#FFFFFF]" // Styles for step 4
                    : buttonCondition
                    ? "bg-[#D7DBDC] text-[#0f1419]" // Active styles for other steps
                    : "bg-[#787a7a] text-[#5b5e5e]" // Disabled state
            }`}
            type="submit"
            onClick={buttonCondition ? handleSubmit : undefined}
        >
            <span className="font-bold text-[1.063rem]">{buttonText}</span>
        </button>
    );
};

export default CustomButton;

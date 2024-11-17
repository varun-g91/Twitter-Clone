import { useState, useEffect } from "react";

const InputField = ({
    id,
    type,
    value = "", // default to an empty string if undefined
    onChange,
    onBlur,
    placeholder,
    errorMessage,
    label,
    inputRef,
}) => {
    const [isTextPresent, setIsTextPresent] = useState(false);

    useEffect(() => {
        if (value && value.length > 0) {
            setIsTextPresent(true);
        } else {
            setIsTextPresent(false);
        }
    }, [value]);

    return (
        <>
            <div className="h-full w-full py-3 relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full bg-inherit h-[3.6rem] px-2 pt-6 pb-2 mt-1 border-[1.59px] border-[#333639] rounded-[0.25rem] text-[1rem] focus:bg-inherit focus:outline-none focus:ring-[2.5px] ${
                        errorMessage
                            ? "focus:ring-[#DB0C11]"
                            : "focus:ring-[#139bF0]"
                    } placeholder-transparent peer`}
                    required
                    ref={inputRef}
                    placeholder={placeholder}
                />
                <label
                    htmlFor={id}
                    className={`absolute left-3 top-[1.3rem] text-[#71767B] transition-all duration-300 transform scale-100 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:top-[1.8rem] ${
                        isTextPresent
                            ? "scale-75 peer-focus:text-[#139BF0]"
                            : "peer-focus:scale-75 text-[#139BF0]"
                    } ${errorMessage ? "peer-focus:text-[#DB0C11]" : ""}`}
                >
                    {label}
                </label>
            </div>
        </>
    );
};

export default InputField;

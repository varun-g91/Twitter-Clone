import React from "react";
import { IoMdClose } from "react-icons/io";
import XSvg from "../../components/svgs/X";
import BackButton from "./BackButton"; // Import the BackButton component
import CustomButton from "./CustomButton";
import Spinner from "../../components/svgs/Spinner";

const ModalBase = ({
    isOpen,
    onClose,
    children,
    title,
    handleSubmit,
    step,
    onBack, // Callback for the back button
    buttonText,
    isLoading,
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
            <div className="relative bg-black rounded-2xl w-[37.5rem] max-h-[90vh] max-w-[80vw] min-h-[40.625rem] flex flex-col">
                {/* Header with Conditional Back or Close Button */}
                <div className="px-4 flex flex-row justify-between items-center mt-[0.68rem]">
                    {step > 1 ? (
                        // Display BackButton on steps greater than 1
                        <BackButton onBack={onBack} />
                    ) : (
                        // Display Close (X) Button on step 1
                        <IoMdClose
                            className="text-[1.35rem] font-custom2 leading-5 cursor-pointer"
                            onClick={onClose}
                        />
                    )}
                    {!isLoading ? (
                        <div className="flex flex-col justify-center items-center max-w-fit">
                            <XSvg className="h-8 fill-[#e7e9ea]" />
                        </div>
                    ) : undefined}
                    <div className=""></div>
                </div>

                {/* Title and Content */}
                <div className="flex flex-col justify-center px-20 items-stretch">
                    {!isLoading ? (
                        <div className="mt-[2rem] pl-3">
                            <h1 className="text-[#E7E9EA] font-custom2 font-bold font-stretched1 text-[1.938rem]">
                                {title}
                            </h1>
                        </div>
                    ) : undefined}

                    {isLoading ? (
                        <div className="flex absolute inset-0 justify-center items-center">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="pt-5">{children}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalBase;

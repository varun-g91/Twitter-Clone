import React from "react";
import { IoMdClose } from "react-icons/io";
import XSvg from "../../svgs/X";
import '../../../custom.css'

const ModalBase = ({ isOpen, onClose, children, title, buttonCondition, handleSubmitStepX, buttonText }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
            <div className="relative bg-black rounded-2xl w-[37.5rem] max-h-[90vh] max-w-[80vw] min-h-[40.625rem] flex flex-col ">
                <div className="px-4 flex flex-row justify-between items-center mt-[0.68rem]    ">
                    <div className="">
                        <IoMdClose
                            className="text-[1.35rem] font-custom2 leading-5 cursor-pointer"
                            onClick={onClose}
                        />
                    </div>
                    <div className="flex flex-col justify-center items-center max-w-fit">
                        <XSvg className="h-8 fill-[#e7e9ea]" />
                    </div>
                    <div className="pr-5"></div>
                </div>
                <div className="flex flex-col justify-center px-20 items-stretch">
                    <div className="mt-[2rem] pl-3">
                        <h1 className="text-[#E7E9EA] font-custom2 font-bold font-stretched1 text-[1.938rem]">
                            {title}
                        </h1>
                    </div>
                    <div className="pt-5">{children}</div>

                    <div className="flex justify-center flex-col items-stretch w-full mt-[5rem]">
                        <button
                            className={`h-[3.25rem] rounded-full ${
                                buttonCondition
                                    ? "bg-[#D7DBDC]"
                                    : "bg-[#787a7a]"
                            }`}
                            type="submit"
                            onClick={
                                buttonCondition ? handleSubmitStepX : undefined
                            }
                        >
                            <span className="text-[#0f1419] font-bold text-[1.063rem]">
                                {buttonText}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalBase;



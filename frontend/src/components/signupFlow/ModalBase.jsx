import React from "react";
import { IoMdClose } from "react-icons/io";
import XSvg from "../svgs/X";

const ModalBase = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
            <div className="relative bg-black rounded-2xl flex flex-col items-stretch justify-start w-[37.5rem] h-1/2 max-h-[90vh] max-w-[80vw] min-h-[40.625rem]">
                <div className="flex flex-col min-w-0 max-w-fit w-full m-4 cursor-pointer z-10">
                    <IoMdClose
                        className="text-[1.38rem] cursor-pointer"
                        onClick={onClose}
                    />
                </div>
                <div className="flex flex-col items-center relative justify-start bottom-14">
                    <XSvg className="h-[3.313rem] fill-[#e7e9ea] scale-[0.6] relative inline-block overflow-hidden" />
                </div>
                <div className="flex flex-col items-stretch justify-start px-20 min-h-0 min-w-0 relative bottom-14">
                    <h1 className="my-5 flex flex-col basis-auto items-stretch flex-shrink-0 box-border relative justify-start font-custom leading-[2.25rem] max-w-[27.5rem] text-[1.938rem] text m-w-0 w-full h-full max-h-[4.75rem]">
                        {title}
                    </h1>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalBase;

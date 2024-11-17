import React, { useState } from "react";
import XSvg from "../../components/svgs/X";
import Buttons from "../../components/landingPage/Buttons";
import HeaderText from "../../components/landingPage/HeaderText";
import "../../custom.css";
import Footer from "../../components/landingPage/Footer";
import SignupFlow from "../../signup flow/SignupFlow";

const LandingPage = () => {
    const [isModalOpen, setIsOpenModal] = useState(false);

    const openModal = () => {
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
    };

    return (
        <div className="container max-w-screen-2xl md:justify-center flex flex-row-reverse h-screen flex-grow-[1] flex-shrink-[1] basis-auto items-stretch box-border m-0 p-0 min-w-0 relative overflow-hidden">
            <div className="min-w-[45vw] flex flex-col flex-grow-[1] flex-shrink-[1] basis-auto box-border items-stretch justify-center min-h-0 p-4 relative">
                <div
                    id="text-and-buttons"
                    className="min-w-[27.313rem] max-w-[47.5rem] w-[100%] right-elements p-5 flex flex-col flex-grow-[1] flex-shrink-[1] basis-auto box-border items-stretch relative"
                >
                    <XSvg className="w-24 lg:hidden fill-white" />
                    <HeaderText />
                    <Buttons openModal={openModal} />
                </div>
            </div>

            <div className="min-h-[45vh] overflow-x-hidden lg:min-w-[40.811rem] overflow-y-hidden lg:flex hidden flex-col box-border items-stretch justify-center flex-grow-[1] flex-shrink-[1] basis-[0%] relative">
                <div className="logo-class relative min-h-0 min-w-0 flex flex-col flex-shrink-[1] flex-grow-[1] basis-auto items-stretch justify-center ">
                    <XSvg className="max-h-[27.725rem] scale-[1.1] max-w-[100%] p-8 relative inline-block overflow-hidden justify-center h-1/2 fill-[#e7e9ea]" />
                </div>
            </div>

            {isModalOpen && (
                <SignupFlow isOpen={isModalOpen} onClose={closeModal} />
            )}

            <Footer />
        </div>
    );
};

export default LandingPage;

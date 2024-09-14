import React from "react";
import { Link } from "react-router-dom";
import AppleIcon from "../svgs/AppleIcon";
import GoogleIcon from "../svgs/GoogleIcon";

const GoogleButton = () => {
    return (
        <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0">
            <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full">
                <GoogleIcon className="text-[0.938rem]" />
                <p className="text-black font-normal ml-2">
                    Sign up with Google
                </p>
            </button>
        </div>
    );
};

const AppleButton = () => {
    return (
        <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0">
            <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full">
                <AppleIcon className="text-[0.938rem]" />
                <p className="text-black font-semibold ml-2">
                    Sign up with Apple
                </p>
            </button>
        </div>
    );
};

const OrDivider = () => {
    return (
        <div className="max-w-[18.75rem] my-1 items-stretch flex flex-row basis-auto flex-shrink-0 relative">
            <div className="min-w-0 basis-0 justify-center mx-1 flex flex-col flex-grow-[1] flex-shrink-[1] items-stretch min-h-0 relative">
                <div className="bg-[#2F3336] h-[1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative"></div>
            </div>
            <span className="mx-4 text-[#e7e9ea]">or</span>
            <div className="min-w-0 basis-0 justify-center mx-1 flex flex-col flex-grow-[1] flex-shrink-[1] items-stretch min-h-0 relative">
                <div className="bg-[#2F3336] h-[1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative"></div>
            </div>
        </div>
    );
};

const CreateAccount = ({ openModal }) => {
    return (
        <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0">
            <button
                className="flex items-center justify-center w-full px-4 py-2 bg-[#139BF0] rounded-full"
                onClick={openModal}
            >
                <p className="text-white font-semibold ml-2">Create account</p>
            </button>
        </div>
    );
};

const TermsOfService = () => {
    return (
        <div className="text-[#71767B] max-w-[23.75rem] text min-w-0 leading-[0.75rem] text-[0.688rem] mb-5 flex-grow-[1] flex-shrink-[1] basis-0 box-border inline relative whitespace-pre-wrap">
            By signing up, you agree to the&nbsp;
            <a href="#" className="text-[#1D9BF0]">
                Terms of Service
            </a>
            &nbsp;and&nbsp;
            <a href="#" className="text-[#1D9BF0]">
                Privacy policy
            </a>
            ,&nbsp;including&nbsp;
            <a href="#" className="text-[#1D9BF0]">
                Cookie Use.
            </a>
        </div>
    );
};

const SignInPrompt = () => {
    return (
        <div className="mt-[2.5rem] w-full flex flex-col items-stretch">
            <div className="text-[1.063rem] font-bold text-[#e7e9ea] mb-5">
                Already have an account?
            </div>
            <div className="button-container w-full max-w-[18.75rem]">
                <button className="flex items-center justify-center w-full px-4 py-2 border-2 border-[#536471] rounded-full">
                    <Link to="/signin" className="text-[#1D9BF0]">
                        Sign in.
                    </Link>
                </button>
            </div>
        </div>
    );
};

const Buttons = ({ openModal }) => {
    return (
        <div className="box-border flex flex-col basis-auto right-[8%] flex-grow-0 flex-shrink-0 items-stretch justify-center relative min-h-0 min-w-0 p-0 m-0">
            <GoogleButton />
            <AppleButton />
            <OrDivider />
            <CreateAccount openModal={openModal} />
            <TermsOfService />
            <SignInPrompt />
        </div>
    );
};

export default Buttons;

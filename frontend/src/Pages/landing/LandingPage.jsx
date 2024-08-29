import React, { useState } from 'react'
import XSvg from '../../components/svgs/X';
import GoogleIcon from '../../components/svgs/GoogleIcon';
import AppleIcon from '../../components/svgs/AppleIcon';
import { Link } from 'react-router-dom';
import SignupModal from '../../components/common/SignupModal';
import '../../custom.css'

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
                  <div className="font-stretched1 leading-[5.25rem] tracking-[-0.075rem] text-[4.1rem] text font-custom font-bold min-w-0 my-[3rem] box-border inline relative whitespace-pre-wrap">
                      <span className="text min-w-0 box-border relative inline">
                          Happening now
                      </span>
                  </div>

                  <div className="font-stretched2 mb-8 leading-[2.25rem] text font-custom min-w-0 font-bold text-[1.938rem] box-border inline relative whitespace-pre-wrap ">
                      <span className="text min-w-0 box-border inline relative whitespace-pre-wrap">
                          Join today.
                      </span>
                  </div>

                  <div className="box-border flex flex-col basis-auto right-[8%] flex-grow-0 flex-shrink-0 items-stretch justify-center relative min-h-0 min-w-0 p-0 m-0 ">
                      <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0 ">
                          <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full">
                              <GoogleIcon className="text-[0.938rem]" />
                              <p className="text-black font-normal ml-2">
                                  Sign up with Google
                              </p>
                          </button>
                      </div>
                      <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0 ">
                          <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full">
                              <AppleIcon className="text-[0.938rem]" />
                              <p className="text-black font-semibold ml-2">
                                  Sign up with Apple
                              </p>
                          </button>
                      </div>

                      <div className="max-w-[18.75rem] my-1 items-stretch flex flex-row     basis-auto flex-shrink-0 relative ">
                          <div className="min-w-0 basis-0 justify-center mx-1 flex flex-col flex-grow-[1] flex-shrink-[1] items-stretch min-h-0 relative ">
                              <div className="bg-[#2F3336] h-[1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative "></div>
                          </div>
                          <span className="mx-4 text-[#e7e9ea]">or</span>
                          <div className="min-w-0 basis-0 justify-center mx-1 flex flex-col flex-grow-[1] flex-shrink-[1] items-stretch min-h-0 relative ">
                              <div className="bg-[#2F3336] h-[1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative "></div>
                          </div>
                      </div>

                      <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0 ">
                          <button
                              className="flex items-center justify-center w-full px-4 py-2 bg-[#139BF0] rounded-full"
                              onClick={openModal}
                          >
                              <p className="text-white font-semibold ml-2">
                                  Create account
                              </p>
                          </button>
                      </div>

                      <div className="text-[#71767B] max-w-[23.75rem] text min-w-0 leading-[0.75rem] text-[0.688rem] mb-5 flex-grow-[1] flex-shrink-[1] basis-0 box-border inline relative whitespace-pre-wrap ">
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
                  </div>
              </div>
          </div>

          <div className="min-h-[45vh] overflow-x-hidden lg:min-w-[40.811rem]  overflow-y-hidden lg:flex hidden flex-col box-border items-stretch justify-center flex-grow-[1] flex-shrink-[1] basis-[0%] relative">
              <div className="logo-class relative min-h-0 min-w-0 flex flex-col flex-shrink-[1] flex-grow-[1] basis-auto items-stretch justify-center ">
                  <XSvg className="max-h-[27.725rem] scale-[1.1] max-w-[100%] p-8 relative inline-block overflow-hidden justify-center h-1/2 fill-[#e7e9ea]" />
              </div>
          </div>

          {isModalOpen && <SignupModal isOpen={isModalOpen} onClose={closeModal} />}
      </div>
  );
}

export default LandingPage
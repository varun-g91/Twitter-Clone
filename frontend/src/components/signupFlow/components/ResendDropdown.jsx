import React from 'react';
import axios from 'axios';

const ResendDropdown = ({dropdownOpen, identifier, verificationCode, closeDropdown, setIsVerifying, setErrorMessage}) => {

    const resendCode = () => {
        try {
            const response = axios.post(
                "http://localhost:5005/api/auth/resend-verification-code",
                {
                    identifier,
                    verificationCode,
                }
            );
        } catch (error) {
            console.error("Resend code error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred while resending code."
            );
        } finally {
            setIsVerifying(false);
        }
    };

  return (
      <>
          {dropdownOpen && (
              <div
                  className="fixed flex flex-col bottom-[72.3%] left-[59.9%] justify-around bg-inherit border border-gray-600 rounded-2xl py-3 text-sm max-w-[10.923rem] w-full max-h-[8.75rem] h-full"
                  style={{
                      boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)", // Add a faint glow effect
                      transition: "box-shadow 0.3s ease-in-out", // Smooth transition when opening
                  }}
              >
                  <div className="max-h-[3rem] max-w-[10.923] w-full flex px-0 py-1 flex-row items-stretch justify-center">
                      <p className="text-white font-normal font-sans ml-3 w-full">
                          Didn’t receive email?
                      </p>
                  </div>
                  <div className="max-h-[3rem] max-w-[10.923] w-full py-3 px-0 flex flex-row items-stretch justify-start hover:bg-[#e7e9ea]/[0.1] ">
                      <button
                          className="flex font-custom w-full text-left mt-2 text-[#E7E9EA] justify- ml-3 "
                          onClick={() => {
                              // Resend code
                            //   resendCode();  
                              console.log("Resend Code clicked");
                              closeDropdown();
                          }}
                      >
                          Resend Code
                      </button>
                  </div>
                  <div className="max-h-[3.15rem] h-full mb-0 max-w-[10.923] w-full py-3 px-0 flex flex-row items-stretch justify-start hover:bg-[#e7e9ea]/[0.1] rounded-b-2xl">
                      <button
                          className="flex justify-start w-full font-custom text-left mt-2 ml-3 text-[#E7E9EA]"
                          onClick={() => {
                              // Use phone instead
                              
                              console.log("Use phone clicked");
                          }}
                      >
                          Use phone instead
                      </button>
                  </div>
              </div>
          )}
      </>
  );
}

export default ResendDropdown
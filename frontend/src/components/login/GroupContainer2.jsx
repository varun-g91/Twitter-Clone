import InputField from "../common/InputField";
import AppleIcon from "../svgs/AppleIcon";
import GoogleIcon from "../svgs/GoogleIcon";

const GoogleButton = () => {
    return (
        <div className="mb-2 max-w-[23.75rem] w-[18.75rem] h-[2.5rem] basis-auto flex flex-col items-stretch min-h-0 min-w-0">
            <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full">
                <GoogleIcon className="text-[0.938rem]" />
                <p className="text-black text-[14px] ml-2 font-custom2">
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
                <p className="text-black text-[14px] font-semibold font-custom2 ml-2">
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
                <div className="bg-[#2F3336] h-[2.1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative"></div>
            </div>
            <span className="mx-4 text-[#e7e9ea]">or</span>
            <div className="min-w-0 basis-0 justify-center mx-1 flex flex-col flex-grow-[1] flex-shrink-[1] items-stretch min-h-0 relative">
                <div className="bg-[#2F3336] h-[2.1px] flex flex-col basis-auto flex-grow-0 flex-shrink-0 items-stretch min-h-0 min-w-0 relative"></div>
            </div>
        </div>
    );
};

const NextButton = ({ handleSubmit }) => {
    return (
        <div className="basis-auto flex flex-col items-stretch min-h-0 min-w-0 max-h-[2.25rem] max-w-[18.75rem]">
            <button className="flex items-center justify-center w-full px-4 py-2 bg-white rounded-full max-w-[18.75rem] max-h-[2.25rem]" onClick={handleSubmit}>
                <p className="text-black font-semibold">Next</p>
            </button>
        </div>
    );
}

const ForgotPasswordButton = () => {
    return (
        <div className="mb-2 basis-auto flex flex-col items-stretch min-h-0 min-w-0 max-h-[2.25rem] max-w-[18.75rem]">
            <button className="flex items-center justify-center w-full px-4 py-2 border-2 border-[#536471] rounded-full max-w-[18.75rem] max-h-[2.25rem]">
                <p className="text-white font-semibold ml-2">
                    Forgot password?
                </p>
            </button>
        </div>
    );
}

const GroupContainer2 = ({
    identifier,
    errorMessage,
    handleInputChange,
    handleSubmit,
    handleSwitchToSignup,
}) => {
    return (
        <div className="flex flex-col items-stretch justify-center space-y-4 ">
            <GoogleButton />
            <AppleButton />
            <OrDivider />
            <div className="w-[88%] relative bottom-4">
                <InputField
                    id="identifier"
                    type="text"
                    placeholder="Phone, email or username"
                    label="Phone, email or username"
                    onChange={handleInputChange}
                    value={identifier}
                    errorMessage={errorMessage}
                />
            </div>
            <div className="">
                <div className="relative bottom-4 space-y-6">
                    <NextButton handleSubmit={handleSubmit} />
                    <ForgotPasswordButton />
                </div>

                <div className="mt-[40px]">
                    <p className="text-[#71767b] font-custom2 text-[15px]">
                        Don't have an account?{" "}
                        <span className="text-[#1d9bf0]">
                            <button onClick={handleSwitchToSignup}>
                                Sign up
                            </button>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GroupContainer2;

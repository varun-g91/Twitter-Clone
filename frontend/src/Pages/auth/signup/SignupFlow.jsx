    import { useContext } from "react";
    import ModalBase from "../../../components/common/ModalBase";
    import Step1Content from "./steps/Step1Content";
    import Step2Content from "./steps/Step2Content";
    import Step3Content from "./steps/Step3Content";
    import Step4Content from "./steps/Step4Content";
    import Step5Content from "./steps/Step5Content";
    import { SignupContext } from "./SignupContext";

    const SignupFlow = ({ isOpen, onClose }) => {
        const {
            step,
            setStep,
            setIdentifier,
            setUsername,
            setErrorMessage,
            setName,
            isLoading,
            setVerificationToken,
            setIsLoading,
        } = useContext(SignupContext);

        const clearSignupState = () => {
            setStep(1);
            setIdentifier("");
            setUsername("");
            setErrorMessage("");
            setName("");
            setVerificationToken("");
            setIsLoading(false);
            localStorage.removeItem("signupStep");
        };

        const handleClose = () => {
            clearSignupState(); // Reset state on close
            onClose();
        };

        const handleBack = () => {
            if (step > 1) {
                setStep(step - 1);
                setErrorMessage("");
            }
        };

        return (
            <ModalBase
                isOpen={isOpen}
                onClose={handleClose}
                title={
                    step === 1
                        ? "Create your account"
                        : step === 2
                        ? "We sent you a code"
                        : step === 3
                        ? "You'll need a password"
                        : step === 4
                        ? "Pick a profile picture"
                        : "Set your username"
                }
                step={step}
                onBack={handleBack}
                isLoading={isLoading}
            >
                {step === 1 && <Step1Content />}
                {step === 2 && <Step2Content />}
                {step === 3 && <Step3Content />}
                {step === 4 && <Step4Content />}
                {step === 5 && <Step5Content />}
            </ModalBase>
        );
    };

    export default SignupFlow;

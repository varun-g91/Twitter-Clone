import { useContext } from "react";
import ModalBase from "./components/ModalBase";
import Step1Content from "./steps/Step1Content";
import Step2Content from "./steps/Step2Content";
import Step3Content from "./steps/Step3Content";
import Step4Content from "./steps/Step4Content";
import Step5Content from "./steps/Step5Content";
import { SignupContext } from "./SignupContext";

const SignupFlow = ({ isOpen, onClose }) => {
    const { step, setStep, isLoading } = useContext(SignupContext);

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const getTitle = () => {
        switch (step) {
            case 1:
                return "Create your account";
            case 2:
                return "We sent you a code";
            case 3:
                return "You'll need a password";
            case 4:
                return "Pick a profile picture";
            case 5:
                return "Set your username";
            default:
                return "Signup";
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <Step1Content />;
            case 2:
                return <Step2Content />;
            case 3:
                return <Step3Content />;
            case 4:
                return <Step4Content />;
            case 5:
                return <Step5Content />;
            default:
                return null;
        }
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={getTitle()}
            step={step}
            isLoading={isLoading}
            onBack={handleBack}
        >
            {renderStepContent()}
        </ModalBase>
    );
};

export default SignupFlow;

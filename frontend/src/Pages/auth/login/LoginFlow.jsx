import React, { useState } from 'react'
import ModalBase from '../../../components/common/ModalBase'
import Step1Content from './steps/Step1Content';
import Step2Content from './steps/Step2Content';

const LoginFlow = ({ isOpen, onClose, switchToSignup }) => {
    const [identifier, setIdentifier] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const resetLoginFlow = () => {
        setIdentifier("");
        setStep(1);
        setIsLoading(false);
    };

    const handleSwitchToSignup = () => {
        resetLoginFlow(); // Clear login state
        switchToSignup(); // Trigger parent function to switch modals
    };

    return (
        <ModalBase
            isOpen={isOpen}
            onClose={onClose}
            title={step === 1 ? "" : "Enter your password"}
            step={step}
            onBack={() => step > 1 && setStep(step - 1)}
            buttonText="Login"
            isLoading={isLoading}
        >
            {step === 1 ? (
                <Step1Content
                    setStep={setStep}
                    setIsLoading={setIsLoading}
                    identifier={identifier}
                    setIdentifier={setIdentifier}
                    handleSwitchToSignup={handleSwitchToSignup}
                />
            ) : (
                <Step2Content identifier={identifier} handleSwitchToSignup={handleSwitchToSignup} setStep={setStep}/>
            )}
        </ModalBase>
    );
};

export default LoginFlow;

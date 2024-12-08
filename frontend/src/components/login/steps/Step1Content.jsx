import { useState } from "react";
import GroupContainer2 from "../GroupContainer2";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Step1Content = ({
    setStep,
    identifier,
    setIdentifier,
    handleSwitchToSignup,
}) => {
    const [errorMessage, setErrorMessage] = useState("");

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                "api/auth/login",
                { identifier, step: 1 }
            );

            if (!response.data) {
                throw new Error(response?.data?.message || "Failed to signup");
            }

            return response.data;
        },
        onSuccess: () => {
            setStep((prev) => prev + 1); // Move to Step 2
            setErrorMessage("");
        },

        onError: (error) => {
            setErrorMessage(error.response?.data?.message || "Signup failed.");
        },
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifier) {
            setErrorMessage(
                "Please enter an email, phone number, or username."
            );
            return;
        }

        mutation.mutate();
    };

    const handleInputChange = (event) => {
        setIdentifier(event.target.value);
    };

    return (
        <div className="flex flex-col space-y-2 max-w-[77%] w-full ml-16 relative bottom-4">
            <div className="flex justify-start mb-5">
                <h1 className="text-[31px] font-custom font-bold leading-9">
                    Sign in to X
                </h1>
            </div>
            <GroupContainer2
                handleInputChange={handleInputChange}
                identifier={identifier}
                errorMessage={errorMessage}
                handleSubmit={handleSubmit}
                handleSwitchToSignup={handleSwitchToSignup} 
            />
        </div>
    );
};

export default Step1Content;

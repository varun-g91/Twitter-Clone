import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import CustomButton from "../../../../components/common/CustomButton";
import InputField from "../../../../components/common/InputField";
import { SignupContext } from "../SignupContext";
import { Link, Navigate, useNavigate } from "react-router-dom";



const Step5Content = () => {
    const {
        identifier,
        username,
        setUsername,
        errorMessage,
        setErrorMessage,
        toggleLoading,
        setStep,
        isLoading,
        name,
    } = useContext(SignupContext);

    const navigate = useNavigate();
    
    useEffect(() => {
        console.log("identifier and name:", identifier, name);
    }, [name, identifier]);
    // Simplified suggestions fetching
    const fetchSuggestions = async () => {
        try {
            console.log("Fetching suggestions with:", { identifier, name });
            const { data } = await axios.post("/api/users/generate-username", {
                identifier,
                name,
            });

            console.log("Full API Response:", data);

            if (!data || !data.suggestions || data.suggestions.length === 0) {
                console.warn("No suggestions found");
                return [];
            }

            return data.suggestions.slice(0, 3);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
    };

    // Use useQuery to fetch and manage suggestions
    const { data: suggestions = [], isLoading: isSuggestionLoading } = useQuery(
        {
            queryKey: ["usernameSuggestions", name, identifier],
            queryFn: fetchSuggestions,
            enabled: !!name && !!identifier,
            staleTime: 5000, // Cache suggestions for 5 seconds
        }
    );

    // Mutation for setting the username
    const { mutate: setUsernameMutation } = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post(
                "http://localhost:5005/api/users/set-username",
                { identifier, userName: username }
            );
            return data;
        },

        onMutate: toggleLoading, // Start loading
        onSuccess: (data) => {
            toggleLoading();
            if (data.message.includes("successfully")) {
                setErrorMessage("");
                navigate('/home');
            } else if (data.message.includes("unavailable")) {
                setErrorMessage(
                    "This username is unavailable. Please choose another."
                );
            }
        },
        onError: (error) => {
            toggleLoading();
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during username submission."
            );
        },
    });

    const handleSubmit = () => {
        if (!username) {
            setErrorMessage("Please choose a username.");
        } else {
            setUsernameMutation();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setUsername(suggestion);
        setErrorMessage("");
    };

    return (
        <div className="flex flex-col items-stretch justify-center w-full mx-auto">
            {/* Title */}
            <div className="text-start flex flex-row w-full items-stretch relative bottom-3">
                <p className="text-[#71767B] font-custom2 text-[0.938rem] font-thin">
                    Choose a username.
                </p>
            </div>

            {/* Username Input */}
            <div className="w-full mb-6">
                <InputField
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMessage("");
                    }}
                    placeholder="Username"
                    errorMessage={errorMessage}
                    label="Username"
                />

                {/* Suggestions */}
                {suggestions.length > 0 ? (
                    <div className="suggestions mt-0 flex flex-col">
                        <ul className="flex flex-row space-x-4">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="flex cursor-pointer text-[#139BF0] font-custom2 text-sm"
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                >
                                    {`@${suggestion}`}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    !isSuggestionLoading && <p>No suggestions available</p>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-stretch justify-center mt-[18rem]">
                <CustomButton
                    buttonText="Next"
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    buttonCondition={username.length > 0}
                    step={5}
                />
            </div>
        </div>
    );
};

export default Step5Content;

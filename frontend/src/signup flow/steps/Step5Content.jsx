import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import InputField from "../components/InputField";
import { SignupContext } from "../SignupContext";

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
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // Function to generate username suggestions based on identifier
    const generateUsernameSuggestions = async () => {
        if (!name) return;

        try {
            setIsLoadingSuggestions(true);
            const response = await axios.post(
                "http://localhost:5005/api/users/generate-username",
                { name }
            );
            console.log("Suggestions: ", response.data.suggestions);
            setSuggestions(response.data.suggestions);
        } catch (error) {
            console.error("Failed to fetch username suggestions:", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Fetch suggestions when component mounts or name changes
    useEffect(() => {
        generateUsernameSuggestions();
    }, [name]); // Only re-run when name changes

    const handleSubmit = async () => {
        if (!username) {
            setErrorMessage("Please choose a username.");
            return;
        }

        try {
            toggleLoading();
            const response = await axios.post(
                "http://localhost:5005/api/users/set-username",
                { identifier, username }
            );

            if (response.data.message.includes("successfully")) {
                setErrorMessage("");
                setStep(6);
            } else if (response.data.message.includes("unavailable")) {
                setErrorMessage(
                    "This username is unavailable. Please choose another."
                );
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                    "An error occurred during username submission."
            );
        } finally {
            toggleLoading();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setUsername(suggestion);
        setErrorMessage("");
    };

    return (
        <div className="flex flex-col items-stretch justify-center w-full mx-auto">
            <div className="text-start flex flex-row w-full items-stretch relative bottom-3">
                <p className="text-[#71767B] font-custom2 text-[0.938rem] font-thin">
                    Choose a username.
                </p>
            </div>

            <div className="w-full mb-6">
                <div className="flex flex-col items-stretch justify-center">
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

                    {/* Display Suggestions */}
                    {!isLoadingSuggestions && suggestions.length > 0 && (
                        <div className="suggestions mt-2 flex flex-col  ">
                            <p className="text-[#71767B] font-custom2 text-sm mb-2">
                                Suggestions:
                            </p>
                            <ul className="space-y-1">
                                {suggestions
                                    .slice(0, 3)
                                    .map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="flex cursor-pointer text-[#139BF0] font-custom2 text-sm"
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    suggestion
                                                )
                                            }
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                    {isLoadingSuggestions && (
                        <p className="text-[#71767B] font-custom2 text-sm mt-2">
                            Loading suggestions...
                        </p>
                    )}
                </div>
                {/* Error Message */}
                <span className="text-red-500 text-xs mt-2 mb-0">
                    {errorMessage || "\u00A0"}
                </span>
            </div>

            <div className="flex flex-col items-stretch justify-centre mt-48">
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

export const handleApiError = (error, setErrorMessage) => {
    if (error.response) {
        setErrorMessage(error.response.data.message || "An error occurred. Please try again.");
    } else {
        setErrorMessage("Network error. Please check your connection.");
    }
};

export const handleSuccess = (response, onSuccess, setStep) => {
    if (response.data.success) {
        onSuccess(response.data);
        if (setStep) {
            setStep((prevStep) => prevStep + 1);
        }
    } else {
        throw new Error(response.data.message);
    }
};

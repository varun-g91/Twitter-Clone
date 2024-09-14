import axios from "axios";

export const submitSignup = async (name, identifier, month, day, year) => {
    return await axios.post("http://localhost:5005/api/auth/signup", {
        fullName: name,
        identifier,
        dateOfBirth: `${year}-${month}-${day}`,
    });
};

export const submitVerification = async (identifier, verificationCode, verificationToken) => {
    return await axios.post("http://localhost:5005/api/auth/verify", {
        identifier,
        verificationCode,
        verificationToken,
    });
};

export const submitPassword = async (identifier, password) => {
    return await axios.post("http://localhost:5005/api/auth/set-password", {
        identifier,
        password,
    });
};

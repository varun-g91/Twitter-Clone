import AppError from "../utils/AppError.js";

export const validateFullName = (fullName) => {
    if (!fullName || fullName.trim().length < 2) {
        throw new AppError('Full name must be at least 2 characters long');
    }
};

export const validateDateOfBirth = (dob) => {
    const date = dob;
    if (isNaN(date.getTime())) {
        throw new AppError('Invalid date of birth');
    }
    const ageDifMs = Date.now() - date.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 13) {
        throw new AppError('You must be at least 13 years old to sign up');
    }
};

export const validateEmailOrPhone = (identifier) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;

    if (!emailPattern.test(identifier) && !phonePattern.test(identifier)) {
        throw new AppError('Invalid email or phone number.');
    }
};

export function validateLogin(identifier, password) {
    if (!identifier || !password) {
        throw new AppError('Please provide both identifier and password');
    }

    if (typeof identifier !== 'string' || typeof password !== 'string') {
        throw new AppError('Invalid input type');
    }
}

export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasNumber) {
        throw new AppError('Password must be at least 8 characters long and contain at least one uppercase letter and one number', 400);
    }
};

export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
    if (!usernameRegex.test(username)) {
        throw new AppError('Invalid username');
    }
};

export function validateVerificationCode(storedCode, providedCode, expirationDate) {
    const expiryDate = new Date(expirationDate);

    if (Date.now() > expiryDate.getTime()) {
        throw new AppError('Verification code has expired.', 400);
    }

    if (storedCode !== providedCode) {
        throw new AppError('Invalid verification code.', 400);
    }

    return true;
}
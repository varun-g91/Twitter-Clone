// Email validation rules
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email');
    }
}

export function validateLogin(identifier, password) {
    if (!identifier || !password) {
        throw new Error('Please provide both identifier and password');
    }

    // Additional validation can be added here, such as checking the format of the email, etc.
    if (typeof identifier !== 'string' || typeof password !== 'string') {
        throw new Error('Invalid input type');
    }
}


export const validatePassword = (password) => {
    const minLength = 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        throw new Error('Please choose a stonger password');
    }

}

export const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
    if (!usernameRegex.test(username)) {
        throw new Error('Invalid username');
    }
}
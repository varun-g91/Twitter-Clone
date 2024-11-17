import User from '../models/user.model.js'; // Import your User model

// Function to generate meaningful usernames
const generateUsernameSuggestions = async (name) => {
    // Add validation
    if (!name || typeof name !== 'string') {
        throw new Error('Invalid name provided');
    }

    // Check if it's an email and handle appropriately
    const baseUsername = name;

    const suggestions = [
        baseUsername,
        `${baseUsername}${Math.floor(Math.random() * 100)}`,
        `${baseUsername}_user`,
        `${baseUsername}_official`,
        `${baseUsername}${Math.floor(Math.random() * 1000)}`,
    ];

    // Filter out any suggestions that are too short
    const validSuggestions = suggestions.filter(suggestion => suggestion.length >= 3);

    // Check availability for all suggestions at once
    const availableSuggestions = [];

    for (let suggestion of validSuggestions) {
        const isTaken = await User.exists({ username: suggestion.toLowerCase() });
        if (!isTaken) {
            availableSuggestions.push(suggestion);
        }
    }

    if (availableSuggestions.length === 0) {
        // Generate additional suggestions if none are available
        for (let i = 0; i < 5; i++) {
            const newSuggestion = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
            const isTaken = await User.exists({ username: newSuggestion.toLowerCase() });
            if (!isTaken) {
                availableSuggestions.push(newSuggestion);
            }
        }
    }

    if (availableSuggestions.length === 0) {
        throw new Error("Could not generate available usernames. Please try a different input.");
    }

    return availableSuggestions;
};
export default generateUsernameSuggestions;

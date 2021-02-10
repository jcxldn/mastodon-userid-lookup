class UsernameValidationError extends Error {
    constructor() {
        const message = "Username not valid!";
        super(message);
    }
}

module.exports = UsernameValidationError;
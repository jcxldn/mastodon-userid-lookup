class UsernameLookupError extends Error {
    constructor(msg) {
        const message = `Username lookup could not complete: ${msg}`;
        super(message);
    }
}

module.exports = UsernameLookupError;
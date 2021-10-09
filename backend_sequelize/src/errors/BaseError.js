// extending Error and making customer errors
// ive always had this idea to do this but its a bit late now
// ill leave this in, perhaps to be picked up again in the future

// https://javascript.info/custom-errors
// https://stackoverflow.com/a/32750746

class BaseError extends Error {
    constructor(message = 'No message') {
        super(message);
        this.name = 'BaseError';
        this.generic = 'Error';
        this.code = 400;
    }

    toJSON() {
        let json = {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message
            }
        };
        return json;
    }
}

module.exports = { BaseError };

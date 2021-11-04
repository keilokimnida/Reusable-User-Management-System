// extending Error and making custom errors
// ive always had this idea to do this but its a bit late now
// ill leave this in, perhaps to be picked up again in the future

// https://javascript.info/custom-errors
// https://stackoverflow.com/a/32750746

class BaseError extends Error {
    constructor() {
        super();
        this.name = 'BaseError';
        this.message = 'Error'; // detailed error
        this.generic = 'Error'; // error summary
        this.code = 400; // status code
    }

    toJSON() {
        return {
            OK: false,
            status: this.code,
            message: this.generic,
            error: {
                name: this.name,
                message: this.message
            }
        };
    }
}

module.exports = { BaseError };

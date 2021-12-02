const validator = require('validator');

module.exports.validateText = (input) => {
    if (validator.isEmpty(input))
        throw new Error('Missing Field');
    if (validator.isAlpha(input))
        throw new Error('Input is not alphebetic');

    input = validator.escape(input);
    input = validator.trim(input);

    return input;
}
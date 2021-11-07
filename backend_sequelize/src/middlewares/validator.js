const validator = require('validator');

module.exports.validateText = (input) => {
    if (validators.isEmpty(text))
        throw new Error('Missing Field');
    if (validators.isAlpha(text))
        throw new Error('Input is not alphebetic');

    text = validator.escape(text);
    text = validator.trim(text);

    return text;
}
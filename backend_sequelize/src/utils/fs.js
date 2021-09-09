// file util is for working with the host to manage files

const fs = require("fs").promises;

module.exports.cleanup = (filePath) => fs.unlink(filePath);

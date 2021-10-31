const { ExclusiveContents } = require('../schemas/Schemas');

module.exports.findExclusiveContent = (accessLevel) => ExclusiveContents.findAll({
    where: { access_level: accessLevel }
});

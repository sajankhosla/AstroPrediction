const createApp = require('../server/app');
const app = createApp();

module.exports = (req, res) => app(req, res);



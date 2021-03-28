const monk = require('monk');

const url = 'localhost/auth-newb';
const db = monk(url);

module.exports = db;
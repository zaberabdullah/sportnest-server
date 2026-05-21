const { auth } = require("../lib/auth"); 


module.exports = (req, res) => {
    return auth.handler(req, res);
};
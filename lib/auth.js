var util = require('./util');
var token = require('./token');
var network = require('./network');
module.exports = {
    get: async (app, url, params) => {
        params = params || {};
        var stoken = await token.getToken(app);
        params.access_token = stoken.accessToken;
        url += '?' + util.toParam(params);
        return await network.get(url);
    },
    post: async (app, url, params) => {
        var stoken = await token.getToken(app);
        url += '?' + util.toParam({ access_token: stoken.accessToken });
        return await network.post(url, params);
    }
};

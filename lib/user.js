var auth = require('./auth');
var util = require('./util');
var network = require('./network');
module.exports = new (function () {
    //获取关注列表
    this.list = async (app, openid) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/get';
        return await auth.get(app, url, { next_openid: openid });
    };
    //获取用户信息
    this.info = async (app, openid) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/info';
        return await auth.get(app, url, { openid: openid });
    };
    //网页授权获取用户信息
    this.oauth2 = async (app, code) => {
        var r = await this.oauth2Token(app, code);
        if (!r.openid) return r;
        var u = await this.info(app, r.openid);
        if (u.nickname) return u;
        return await this.oauth2info(r.access_token, r.openid);
    };
    //根据code获取Access_Token
    this.oauth2Token = async (app, code) => {
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
        url += '?' + util.toParam({
            appid: app.id,
            secret: app.secret,
            grant_type: 'authorization_code',
            code: code
        });
        return await network.get(url);
    };
    //根据网页授权获取的Access_Token获取用户信息
    this.oauth2info = async (token, openid) => {
        var url = 'https://api.weixin.qq.com/sns/userinfo';
        url += '?' + util.toParam({
            access_token: token,
            openid: openid
        });
        return await network.get(url);
    };
})();
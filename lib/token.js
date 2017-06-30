var util = require('./util');
var network = require('./network');
module.exports = new (function () {
    var self = this;
    var wxtoken = {};
    //读取微信token
    this.get = function (id, key, cb) {
        console.warn('请注册token.get函数，用于存储微信token');
        return new Promise(function (res) {
            var c = wxtoken[id] || (wxtoken[id] = {});
            cb ? cb(c[key] || null) : res(c[key] || null);
        });
    };
    //保存微信token
    this.set = function (id, key, value, cb) {
        console.warn('请注册token.get函数，用于存储微信token');
        var c = wxtoken[id] || (wxtoken[id] = {});
        c[key] = value;
        cb && cb();
    };
    //获取新的微信token
    this.newToken = async (app) => {
        var params = {
            grant_type: 'client_credential',
            appid: app.id,
            secret: app.secret
        };
        var url = 'https://api.weixin.qq.com/cgi-bin/token?' + util.toParam(params);
        var r = await network.get(url);
        if (r.access_token) {
            var token = {
                time: new Date().getTime() + r.expires_in * 1000 - 100,
                accessToken: r.access_token
            };
            self.set(app.id, 'token', token);
            return token;
        } else {
            return null;
        }
    };
    //获取token
    this.getToken = async (app) => {
        var token = await self.get(app.id, 'token');
        if (!token || token.time < new Date().getTime()) {
            return await self.newToken(app);
        }
        return token;
    };
    //获取新的jsticket
    this.newJsticket = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
        var stoken = await this.getToken(app);
        url += '?' + util.toParam({ access_token: stoken.accessToken, type: 'jsapi' });
        var r = await network.get(url);
        if (r.ticket) {
            var token = {
                time: new Date().getTime() + r.expires_in * 1000 - 100,
                ticket: r.ticket
            };
            self.set(app.id, 'jsticket', token);
            return token;
        } else {
            console.log(r);
            return null;
        }

    };
    //获取jsticket
    this.getJsticket = async (app) => {
        var token = await self.get(app.id, 'jsticket');
        if (!token || token.time < new Date().getTime()) {
            return await self.newJsticket(app);
        }
        return token;
    };
    //微信端服务验证
    this.wxauth = function (token, data) {
        var crypto = require('crypto');
        var content = [token, data.timestamp, data.nonce].sort().join('');
        var shasum = crypto.createHash('sha1');
        shasum.update(content);
        return shasum.digest('hex').toLowerCase() === data.signature.toLowerCase();
    };
})();
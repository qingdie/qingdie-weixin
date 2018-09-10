var util = require('./util');
var network = require('./network');
module.exports = new(function() {
    var self = this;
    const redis = global.redis || require('qingdie-redis');
    var wxtoken = {};
    //读取微信token
    this.get = async (id, key) => {
        return await redis.get(id + key);
    }
    //保存微信token
    this.set = async (id, key, value, expires_in) => {
        await redis.set(id + key, value, expires_in);
    }
    this.reqToken = async (app, cb, times) => {
        var ret = await redis.locked(app.id + 'token');
        if (!ret) {
            setTimeout(function() {
                self.reqToken(app, cb, ++times);
            }, 1000);
        }
    }
    //获取新的微信token
    this.newToken = async (app, times, ispre) => {
        times = times || 1;
        if (times >= 4) throw { msg: '获取微信token失败,连续4次没有空闲！', app: app };
        var ret = await redis.locked(app.id + 'token');
        if (!ret) {
            if (ispre) return;
            await new Promise(function(cb) {
                setTimeout(cb, 1000 * times);
            });
            return this.getToken(app, ++times);
        }
        if (app.component && app.refreshtoken) {
            let caccess_token = await this.getComponentToken(app.component);
            var url = 'https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token?component_access_token=' + caccess_token.accessToken;
            var r = await network.post(url, {
                "component_appid": app.component.appid,
                "authorizer_appid": app.id,
                "authorizer_refresh_token": app.refreshtoken
            })
            if (r.authorizer_access_token) {
                var token = {
                    time: parseInt(Date.now() / 1000) + r.expires_in,
                    accessToken: r.authorizer_access_token
                };
                await self.set(app.id, 'token', token, r.expires_in);
                redis.unlock(app.id + 'token');
                return token;
            } else {
                redis.unlock(app.id + 'token');
                throw { msg: '获取微信token失败！', app: app, r: r };
            }
        } else {
            var params = {
                grant_type: 'client_credential',
                appid: app.id,
                secret: app.secret
            };
            var url = 'https://api.weixin.qq.com/cgi-bin/token?' + util.toParam(params);
            var r = await network.get(url);
            if (r.access_token) {
                var token = {
                    time: parseInt(Date.now() / 1000) + r.expires_in,
                    accessToken: r.access_token
                };
                await self.set(app.id, 'token', token, r.expires_in);
                redis.unlock(app.id + 'token');
                return token;
            } else {
                redis.unlock(app.id + 'token');
                throw { msg: '获取微信token失败！', app: app, r: r };
            }
        }
    }
    //获取token
    this.getToken = async (app, times) => {
        if (app.authToken) return app.authToken;
        var token = await self.get(app.id, 'token');
        if (token) {
            if (token.time - parseInt(Date.now() / 1000) > 200) {
                return token;
            }
            if (token.time - parseInt(Date.now() / 1000) > 0) {
                self.newToken(app, times, true);
                return token;
            }
            return await self.newToken(app, times);
        }
        return await self.newToken(app, times);
    }
    //获取新的jsticket
    this.newJsticket = async (app, times, ispre) => {
        times = times || 1;
        if (times >= 4) throw { msg: '获取微信Jsticket失败,连续4次没有空闲！', app: app };
        var ret = await redis.locked(app.id + 'jsticket');
        if (!ret) {
            if (ispre) return;
            await new Promise(function(cb) {
                setTimeout(cb, 1000 * times);
            });
            return this.getJsticket(app, ++times);
        }
        var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';
        var stoken = await this.getToken(app);
        url += '?' + util.toParam({ access_token: stoken.accessToken, type: 'jsapi' });
        var r = await network.get(url);
        if (r.ticket) {
            var token = {
                time: parseInt(Date.now() / 1000) + r.expires_in,
                ticket: r.ticket
            };
            await self.set(app.id, 'jsticket', token);
            redis.unlock(app.id + 'jsticket');
            return token;
        } else {
            redis.unlock(app.id + 'jsticket');
            throw { msg: '获取微信Jsticket失败！', app: app, r: r };
        }
    }
    //获取jsticket
    this.getJsticket = async (app, times) => {
        var token = await self.get(app.id, 'jsticket');
        if (token) {
            if (token.time - parseInt(Date.now() / 1000) > 200) {
                return token;
            }
            if (token.time - parseInt(Date.now() / 1000) > 0) {
                self.newJsticket(app, times, true);
                return token;
            }
            return await self.newJsticket(app, times);
        }
        return await self.newJsticket(app, times);
    }
    //微信端服务验证
    this.wxauth = function(token, data) {
        var crypto = require('crypto');
        var content = [token, data.timestamp, data.nonce].sort().join('');
        var shasum = crypto.createHash('sha1');
        shasum.update(content);
        return shasum.digest('hex').toLowerCase() === data.signature.toLowerCase();
    }
    //获取新的微信token
    this.newComponentToken = async (component, times, ispre) => {
        times = times || 1;
        if (times >= 4) throw { msg: '获取微信ComponentToken失败,连续4次没有空闲！', component: component };
        var ret = await redis.locked(component.appid + 'api_token');
        if (!ret) {
            if (ispre) return;
            await new Promise(function(cb) {
                setTimeout(cb, 1000 * times);
            });
            return this.getComponentToken(component, ++times);
        }
        var ticket = await redis.get(component.appid + 'verifyTicket');
        if (!ticket && !component.ticket) {
            throw { msg: '获取微信ComponentToken失败,没有verifyTicket' };
        }
        var url = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';
        var r = await network.post(url, {
            "component_appid": component.appid,
            "component_appsecret": component.appSecret,
            "component_verify_ticket": ticket
        });
        if (r.component_access_token) {
            var token = {
                time: parseInt(Date.now() / 1000) + r.expires_in,
                accessToken: r.component_access_token
            };
            await self.set(component.appid, 'api_token', token, r.expires_in);
            redis.unlock(component.appid + 'api_token');
            return token;
        } else {
            redis.unlock(component.appid + 'api_token');
            throw { msg: '获取微信token失败！', component: component, r: r };
        }
    }
    //获取ComponentToken
    this.getComponentToken = async (component, times) => {
        var token = await self.get(component.appid, 'api_token');
        if (token) {
            if (token.time - parseInt(Date.now() / 1000) > 200) {
                return token;
            }
            if (token.time - parseInt(Date.now() / 1000) > 0) {
                self.newComponentToken(component, times, true);
                return token;
            }
            return await self.newComponentToken(component, times);
        }
        return await self.newComponentToken(component, times);
    }
    this.apiQueryAuth = async (component, code) => {
        var token = await this.getComponentToken(component);
        var url = 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=' + token.accessToken;
        var ret = await network.post(url, {
            "component_appid": component.appid,
            "authorization_code": code
        });
        if (ret.authorization_info) {
            return ret.authorization_info;
        } else {
            throw { msg: '获取微信apiQueryAuth失败！', component: component, ret: ret };
        }
    }
})();
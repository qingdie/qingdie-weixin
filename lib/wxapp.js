var network = require('./network');
var auth = require('./auth');
var util = require('./util');
module.exports = new (function () {
    this.jscode2session = async (app, code) => {
        var url = 'https://api.weixin.qq.com/sns/jscode2session';
        url += '?' + util.toParam({
            appid: app.id,
            secret: app.secret,
            js_code: code,
            grant_type: 'authorization_code'
        });
        var r = await network.get(url);
        return r;
    };
    this.decryptData = async (app, sessionKey, encryptedData, iv) => {
        var crypto = require('crypto');
        sessionKey = new Buffer(sessionKey, 'base64');
        encryptedData = new Buffer(encryptedData, 'base64');
        iv = new Buffer(iv, 'base64');
        try {
            var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
            decipher.setAutoPadding(true);
            var decoded = decipher.update(encryptedData, 'binary', 'utf8');
            decoded += decipher.final('utf8');
            decoded = JSON.parse(decoded);
            if (decoded.watermark.appid !== app.id) {
                throw new Error('Illegal Buffer');
            }
            return decoded;
        } catch (err) {
            throw new Error('Illegal Buffer');
        }
    };
    this.getwxacode = async (app, data) => {
        var url = 'https://api.weixin.qq.com/wxa/getwxacode';
        var r = await auth.post(app, url, data);
        return r;
    };
    this.getwxacodeunlimit = async (app, data) => {
        var url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit';
        var r = await auth.post(app, url, data);
        return r;
    };
    this.createwxaqrcode = async (app, data) => {
        var url = 'https://api.weixin.qq.com/wxa/createwxaqrcode';
        var r = await auth.post(app, url, data);
        return r;
    };
})();
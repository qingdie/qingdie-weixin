module.exports = new (function () {
    var token = require('./token');
    var util = require('./util');
    //获取微信端授权url
    this.jsurl = function (app, url, scope) {
        return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + app.id + '&redirect_uri=' + encodeURIComponent(url) + '&response_type=code&scope=' + (scope || 'snsapi_base') + '&state=STATE#wechat_redirect';
    };
    this.jsconfig = async (app, url)=> {
        var ticket = await token.getJsticket(app);
        var config = {
            jsapi_ticket: ticket.ticket,
            noncestr: util.getNonce(),
            timestamp: (new Date().getTime() / 1000).toFixed(0) + '',
            url: url
        };
        config.signature = util.sign(config);
        return {
            appId: app.id,
            signature: config.signature,
            nonceStr: config.noncestr,
            timestamp: config.timestamp
        };
    };
})();
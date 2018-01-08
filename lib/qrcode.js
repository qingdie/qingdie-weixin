var auth = require('./auth');
module.exports = new (function () {
    this.create = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/qrcode/create';
        var r = await auth.post(app, url, data);
        return r;
    };
    this.imgurl = function (ticket) {
        return 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + encodeURI(ticket);
    };
})();
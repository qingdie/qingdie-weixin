var auth = require('./auth');
module.exports = new (function () {
    this.create = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/create';
        return await auth.post(app, url, data);
    };
    this.get = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/get';
        return await auth.get(app, url);
    };
    this.update = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/update';
        return await auth.post(app, url, data);
    };
    this.delete = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/delete';
        return await auth.post(app, url, data);
    };
    this.users = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/user/tag/get';
        return await auth.post(app, url, data);
    };
    this.batchtagging = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging';
        return await auth.post(app, url, data);
    };
    this.batchuntagging = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging';
        return await auth.post(app, url, data);
    };
    this.getidlist = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/tags/getidlist';
        return await auth.post(app, url, data);
    };
})();
var auth = require('./auth');
module.exports = new (function () {
    this.get = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/get';
        return await auth.get(app, url);
    };
    this.create = async (app, menu) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/create';
        return await auth.post(app, url, menu);
    };
    this.delete = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/delete';
        return await auth.get(app, url);
    };
    this.addconditional = async (app, menu) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/addconditional';
        return await auth.post(app, url, menu);
    };
    this.delconditional = async (app, menu) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/delconditional';
        return await auth.post(app, url, menu);
    };
    this.trymatch = async (app, menu) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/menu/trymatch';
        return await auth.post(app, url, menu);
    };
    this.getCurrentSelfmenuInfo = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/get_current_selfmenu_info';
        return await auth.get(app, url);
    };
})();
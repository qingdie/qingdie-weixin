var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () => {
       // await this.list();
       // await this.info();
        await this.oauth2();
    };
    this.list = async()=> {
        var r = await api.user.list(this.app);
        this.openid = r.data.openid[0];
        console.log(r);
    };
    this.info = async()=> {
        var r = await api.user.info(this.app, this.openid);
        console.log(r);
    };
    this.oauth2 = async()=> {
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx17da63753aecf9e7&redirect_uri=http%3A%2F%2Fweixin.tuina-hh.com%2Fhtml%2Fmain%2F&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect
        var r = await api.user.oauth2(this.app, '011J9hJB1xU0sh0ozUJB1m4nJB1J9hJH');
        console.log(r);
    };
})();
var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () =>{
         await this.jsconfig();
    };
    this.jsconfig = async ()=> {
        var r = await api.jssdk.jsconfig(this.app, 'http://wx.qingdie.net/?code=0131yo0w1wR2Lb0wmgYv1qcw0w11yo0i&state=STATE');
        console.log(r);
    };
})();
var api = require("qingdie-weixin");
var co = require("qingdie-co");
//微信配置文件说明：

//建议程序配置文件统一放在global.config下
//token是存放在redis下的，做了分布式锁处理，
global.config = {
    wxwebconfig: {
        app: { //公众号、小程序、app配置信息
            id: 'wx90d71a00b00000000', //
            secret: '68361a3ba1448c18353ede1823e3f175',
            token: 'ly34343ie8992',
            component: { //第三方授权信息，代公众号开发业务
                appid: "wx36890250000000",
                appSecret: "c0311afa9a2cae342000000000000",
                encodingAesKey: "1b30c5613f5849c99b73a8ee4767000000000000",
                token: "0000000",
                domain: "xxxxxxxxxx.com"
            }
        },
        merchant: { //商户信息
            id: '1326907509',
            key: '685e1a3ba1441835333ede1823e3f145'
        },
        certificate: { //证书信息
            pkcs12: '/apiclient_cert.p12',
            key: '1326907509'
        },
        wxnotifyUrl: 'http://wx.qingdie.net/api/weixin/notify'
    },
    redis: { //redis配置
        host: '118.190.149.345',
        password: '435454',
        port: 6379,
        db: 4,
        md5: true
    }
}
var wxapp = config.wxwebconfig.app;
(async function() {
    ////标签测试
    //var tags = require("./tags");
    //tags.app = wxapp;
    //yield tags.all();

    ////用户测试
    //var user = require("./user");
    //user.app = wxapp;
    //yield user.all();


    ////消息测试
    //var msg = require("./msg");
    //msg.app = wxapp;
    //yield msg.all();

    ////jssdk测试
    //var jssdk = require("./jssdk");
    //jssdk.app = wxapp;
    //yield jssdk.all();

    //// pay测试
    //var pay = require("./pay");
    //pay.app = wxapp;
    //pay.wxconfig = wxwebconfig;
    //yield pay.all();

    //// pay测试
    //var wxapp = require("./wxapp");
    //wxapp.app = wxsapp;
    //await wxapp.all();

    // 二维码测试
    var qrcode = require("./qrcode");
    qrcode.app = wxapp;
    await qrcode.all();

})().catch(err => {
    console.log(err);
});
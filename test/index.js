var api = require("qingdie-weixin");
var co = require("qingdie-co");
var wxapp = {
    id: 'wx17da63753aecf9e7',
    secret: '2bf125ebd596784321c8d775ecfad267',
    token: '2016bc51_A'
};
var wxsapp = {
    id: 'wxc23c6240c01eeedb',
    secret: '88dc98de63d7618b31c8058327108cc3'
};
var wxwebconfig = {
    app: {
        id: 'wx90d71a0b18c5fa45',
        secret: '685e1a3ba1448c18353ede1823e3f175',
        token: 'lyhunjie8991'
    },
    merchant: {
        id: '1326907501',
        key: '685e1a3ba1448c18353ede1823e3f145'
    },
    certificate: {
        pkcs12: './node_modules/qingdie-weixin/test/cert/apiclient_cert.p12',
        key: '1326907501'
    },
    wxnotifyUrl: 'http://wx.qingdie.net/api/weixin/notify'
};

(async function () {
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

    // pay测试
    var qrcode = require("./qrcode");
    qrcode.app = wxapp;
    await qrcode.all();

})().catch(err => {
    console.log(err);
});

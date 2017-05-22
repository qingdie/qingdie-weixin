var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () => {
        await this.receive();
    };
    this.receive = async () => {
        api.msg.receive.on(function (msg, cb) {
            console.log('接收到消息：\r\n');
            console.log(msg);
            cb({
                ToUserName: '',
                FromUserName: '',
                CreateTime: new Date().getTime(),
                MsgType: 'text',
                Content: '啦啦啦'
            });
        });
        api.msg.receive.on('subscribe', function (msg, cb) {
            console.log('被关注了：\r\n');
            console.log(msg);
            cb({
                ToUserName: '',
                FromUserName: '',
                CreateTime: new Date().getTime(),
                MsgType: 'text',
                Content: '欢迎关注我们'
            });
        });

        api.msg.receive.onXml('<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[this is a test]]></Content><MsgId>1234567890123456</MsgId></xml>', function (msg, rmsg) {
            console.log('发送回复消息：');
            console.log(rmsg);
        });
    };
})();
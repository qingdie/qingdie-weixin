# qingdie-weixin
微信公众平台，小程序、微信支付等
```
 var wx = require('qingdie-weixin');
```
### 1.公众号授权验证
```
 this.auth = async (ctx) => {
        if (ctx.method.toLowerCase() === 'get') {
            var r = wx.token.wxauth(config.wxwebconfig.app.token, ctx.apidata);
            return r ? ctx.apidata.echostr : '';
        } 
    };
```

### 2.消息接收和回复
```
this.auth = async (ctx) => {
        if (ctx.method.toLowerCase() === 'get') {
            var r = wx.token.wxauth(config.wxwebconfig.app.token, ctx.apidata);
            return r ? ctx.apidata.echostr : '';
        } else {
           //接收到消息
            var msg = await wx.msg.receive.onXml(ctx.apidata);
            return  msg ? wx.util.toXml(msg) : 'success';
        }
    };
  //注册消息接收监听
  wx.msg.receive.on(function (msg, cb) {
        cb({
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: '技术正在熬夜开发，敬请期待！[玫瑰][红包][耶]'
        });
    });
 wx.msg.receive.on('unsubscribe', function (msg, cb) {
        cb();
    });
 wx.msg.receive.on('subscribe', function (msg, cb) {
        cb({
            ToUserName: msg.FromUserName,
            FromUserName: msg.ToUserName,
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: '技术正在熬夜开发，敬请期待！[玫瑰][红包][耶]'
        });
    });
 wx.msg.receive.on('LOCATION', function (msg, cb) {
        cb();
    });
```
### 3.发送客服消息
```
 wx.msg.custom.sendText(config.wxwebconfig.app,'og9V-xFD-CGtdSwkhrC9t0g0anJ0','很高兴通知你，明天放假啦！');
```


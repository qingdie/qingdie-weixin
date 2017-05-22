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
    
```

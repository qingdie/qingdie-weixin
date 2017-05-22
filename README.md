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
## 2.消息处理
### 2.1消息接收和回复
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
### 2.2发送客服消息
```
 wx.msg.custom.sendText(config.wxwebconfig.app,'og9V-xFD-CGtdSwkhrC9t0g0anJ0','很高兴通知你，明天放假啦！');
```
## 3.支付
### 3.1公众号支付
```
 var r = await wx.pay.payjs(config.wxwebconfig, {
            openid: ut.openid,
            body: order.body,
            attach: order.attach,
            out_trade_no: order.OrderId,
            total_fee: order.Pay,
            time_start: (new Date(order.AddTime)).format('yyyy-MM-dd-hh-mm-ss').replace(/-/g, ''),
            time_expire:(new Date(new Date(order.AddTime).getTime() + 12 * 60 * 60 * 1000)).format('yyyy-MM-dd-hh-mm-ss').replace(/-/g, '')
        });
//r 可直接给网页的jsskd调用
```
### 3.2App支付
```
        var r = await wx.pay.payapp(config.wxappconfig, {
            body: order.body,
            attach: order.attach,
            out_trade_no: order.OrderId,
            total_fee: order.PayThird,
            time_start: (new Date(order.AddTime)).format('yyyy-MM-dd-hh-mm-ss').replace(/-/g, ''),
            time_expire:(new Date(new Date(order.AddTime).getTime() + 12 * 60 * 60 * 1000)).format('yyyy-MM-dd-hh-mm-ss').replace(/-/g, '')
        });
//r 可直接给app的skd调用
```
### 3.3小程序支付
```
 var r = await wx.pay.payjs(config.wxsappconfig, {
            openid: ut.openid,
            body: order.body,
            attach: order.attach,
            out_trade_no: order.OrderId,
            total_fee: order.PayThird,
            time_start: help.dateFormat(new Date(order.AddTime), 'yyyy-MM-dd-hh-mm-ss').replace(/-/g, ''),
            time_expire: help.dateFormat(new Date(new Date(order.AddTime).getTime() + 12 * 60 * 60 * 1000), 'yyyy-MM-dd-hh-mm-ss').replace(/-/g, '')
        });
//r 可直接给小程序的skd调用 
```




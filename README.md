# qingdie-weixin
微信公众平台，小程序、App端微信支付等微信提供的所有api接口的node版本实现

微信公众号的acessToken不能总是去获取，现是存储在redis缓存下的
建议根据需要需要自己实现存储和获取函数

```
 var wx = require('qingdie-weixin');

//实现自己的acessToken存储方法
//不实现默认采用redis进行存储
wx.token.get=function (id, key, cb) {
        return new Promise(function (res) {
		    cb=cb||res;
            var redis = require("qingdie-redis");
            redis.get('cache-weixin', function (r) {
                var c = r && r[id] || (r = {}, r[id] = {});
                cb && cb(c[key] || null);
            });
        });
 };

 wx.token.set = function (id, key, value, cb) {
       return new Promise(function (res) {
		    cb=cb||res;
            var redis = require("qingdie-redis");
            redis.get('cache-weixin', function (r) {
               var c = r && r[id] || (r = {}, r[id] = {});
               c[key] = value;
               redis.set('cache-weixin', r);
               cb && cb();
            });
        });
};


```
## 1.授权验证
### 1.1公众号服务器身份授权验证
```
 this.auth = async (ctx) => {
        if (ctx.method.toLowerCase() === 'get') {
            var r = wx.token.wxauth(config.wxwebconfig.app.token, ctx.apidata);
            return r ? ctx.apidata.echostr : '';
        } 
    };
```
### 1.2jsskd注册
```
  var data = await wx.jssdk.jsconfig(ctx.app.config.wxwebconfig.app, ctx.apidata.url);

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
### 2.3 发送模版消息
```
var r = await wx.msg.template.send(config.wxwebconfig.app, {
            "touser": user.wxopenid,
            "miniprogram": {
                "appid": config.wxsappconfig.app.id,
                "pagepath":"pages/notice/info?id=000"
            },
            "template_id": templateid,
            "url": config.domain + '/notice.html?id=000',
            "data":  {
			"first": {
				"value": "你好啊，明天可以不用来上班啦！",
				"color": "#173177"
			},
			"keyword1": {
				"value": 100,
				"color": "#173177"
			},
			"keyword2": {
				"value":'2017-05-23',
				"color": "#383232"
			},
			"remark": {
				"value": '想知道为什么请点击',
				"color": "#173177"
			}
        }
     });

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
            total_fee: order.Pay,
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
            total_fee: order.Pay,
            time_start: help.dateFormat(new Date(order.AddTime), 'yyyy-MM-dd-hh-mm-ss').replace(/-/g, ''),
            time_expire: help.dateFormat(new Date(new Date(order.AddTime).getTime() + 12 * 60 * 60 * 1000), 'yyyy-MM-dd-hh-mm-ss').replace(/-/g, '')
        });
//r 可直接给小程序的skd调用 
```
## 4.用户信息
### 4.1通过code获取用户信息
```
var  wxuser = await wx.user.oauth2(ctx.app.config.wxwebconfig.app, ctx.apidata.code);
```
### 4.2url授权地址获取
```
  const url = wx.jssdk.jsurl(ctx.app.config.wxwebconfig.app, ctx.apidata.url.split('#')[0]);
```
### 4.3根据openid获取用户信息
```
var  wxuser = await wx.user.info(ctx.app.config.wxwebconfig.app, 'oSyyowCDu_MGuoEu4maA4T0h7ZL9');
```

### 4.4小程序根据code换取seesession
```
 var ret = await wx.wxapp.jscode2session(ctx.app.config.wxsappconfig.app, ctx.apidata.code);

```
### 4.5小程序解密数据
```
 var wxuser = await wx.wxapp.decryptData(config.wxsappconfig.app, ctx.apidata.session, ctx.apidata.encryptedData, ctx.apidata.iv);
```

其他很多很多api请查看源码啦！
# qingdie-weixin
微信公众平台，小程序、App端微信支付等微信提供的所有api接口的node版本实现
安装：
```
npm install qingdie-weixin
```

配置参数：

```
  this.wxconfig = {
        app: {
            name: '公众号',//名称
            id: 'wxe4cb6ee64656457',//appid
            secret: 'd6c3fb4be7277aa18bb4',
            token: 'qdauc2017',
            component:{//微信开放平台第三方信息（代公众号开放，代小程序开放）
                 appid: "wx46890257c9e46a78",
                 appSecret: "c0311a566821400934afa9a2cae34253",
                 encodingAesKey: "1b30c561a8ee47674e0c8ee47674e0c3f5849c99b73",
                 token: "Qd2018.Wx",
            }
        },
        merchant: {
            id: '1487762830',
            key: '1c61291cb07f025cd01d7bf8c70f7e28'
        },
        certificate: {
            pkcs12: './res/1487762830.p12',
            key: '1487762830'
        },
        wxnotifyUrl: this.domain + '/api/pay/wxnotify'
    };

```


微信公众号的acessToken不能总是去获取，现是存储在redis缓存下的
获取方法已经实现了分布式环境下的并发锁问题 依赖于redis

```
 var wx = require('qingdie-weixin');

//实现自己的acessToken存储方法
//不实现默认采用qingdie-redis进行存储
自己实现存储和锁
global.redis={
    get:async(key){},
    set:async(key,value,expires_in){},
    locked:async(key){
        //加锁成功 return true;
        //加锁失败 return false;
    },
    unlock:async(key){}
}

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
### 1.3获取用户信息
```
   let wxuser = await wx.user.oauth2Token(wxconfig.app, ctx.apidata.code);//获取用户openid和token
   let wxuser = await wx.user.oauth2(wxconfig.app, ctx.apidata.code);//获取完整用户信息
   let wxuser = await wx.user.info(wxconfig.app, openid);

```
## 2.消息处理
### 2.1消息接收和回复
```
//一般公众号，小程序消息处理
this.auth = async (ctx) => {
        if (ctx.method.toLowerCase() === 'get') {
            var r = wx.token.wxauth(config.wxwebconfig.app.token, ctx.apidata);
            return r ? ctx.apidata.echostr : '';
        } else {
           //接收到消息
            var msg = await wx.msg.receive.onXml(ctx.apidata);
            return  msg ? wx.util.toXml(msg,{"其他配置":'可用于区分来自于哪一个公众号'}) : 'success';
        }
};
//第三方代开发消息处理
this.msg = async (ctx) => {
       var appid=ctx.path.substring(12);
       var wxconfig = await serviceAdminUser.getWxconfig(appid);//根据appid获取配置
       if (!wx.util.checksign(wxconfig.app.component.token, ctx.query.timestamp, ctx.query.nonce, ctx.query.signature)) return { errmsg: '签名错误' };
       var data = await wx.util.toJson(ctx.apidata);
        var ret = wx.util.decryptData(wxconfig.app.component.encodingAesKey, data.Encrypt);//解密消息
        var msg = await wx.msg.receive.onXml(ret.xml, wxconfig);//消息处理
        return msg ? wx.util.xmlEncry(wxconfig.app.component.appid, wxconfig.app.component.encodingAesKey, wx.util.toXml(msg)) : 'success';
}
//注册消息接收监听
wx.msg.receive.on((msg, opt)=> {
       return {
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: '技术正在熬夜开发，敬请期待！[玫瑰][红包][耶]'
       }
});
wx.msg.receive.on('unsubscribe', (msg, opt)=> {
       return '';
});
wx.msg.receive.on('subscribe', function (msg, opt) {
    return {
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: '技术正在熬夜开发，敬请期待！[玫瑰][红包][耶]'
        }
});
wx.msg.receive.on(['scan', 'view'], (msg, opt, mtype) => {
     return '';
})
wx.msg.receive.on('text', (msg, opt) => {
        if (msg.Content == 'TESTCOMPONENT_MSG_TYPE_TEXT') { //第三方平台接入检测
            return {
                CreateTime: parseInt(Date.now() / 1000),
                Content: 'TESTCOMPONENT_MSG_TYPE_TEXT_callback'
            };
        }
        if (msg.Content.substring(0, 16) == 'QUERY_AUTH_CODE:') { //第三方平台接入检测
            var code = msg.Content.substring(16);
            (async () => {
                var authinfo = await wx.token.apiQueryAuth(wxconfig.component, code);
                wx.msg.custom.sendText({ authToken: { accessToken: authinfo.authorizer_access_token } }, msg.FromUserName, code + "_from_api");
            })();
            return '';
        }
        return '';
})
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

其他很多很多api请查看源码啦！此版本加入了第三方代开发的全部功能

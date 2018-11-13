var auth = require('./auth');
var util = require('./util');
//模版消息
var template = new(function() {
    //获得模版ID
    this.templateId = async (app, shortId) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/api_add_template';
        return await auth.post(app, url, { template_id_short: shortId });
    };
    //获取模板列表
    this.templateId = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template';
        return await auth.get(app, url);
    };
    //获取模板列表
    this.list = async (app) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/template/get_all_private_template';
        return await auth.get(app, url);
    };
    //发送模板消息
    this.send = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send';
        return await auth.post(app, url, data);
    };
    //发送小程序模版消息
    this.sendwxapp = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send';
        return await auth.post(app, url, data);
    };
})();


//客服消息
var custom = new(function() {
    //发送消息
    this.send = async (app, data) => {
        var url = 'https://api.weixin.qq.com/cgi-bin/message/custom/send';
        return await auth.post(app, url, data);
    };
    //发送文本消息
    this.sendText = async (app, openid, text) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "text",
            "text": {
                "content": text
            }
        });
    };
    //发送图片消息
    this.sendImage = async (app, openid, mediaId) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "image",
            "image": {
                "media_id": mediaId
            }
        });
    };
    //发送语音消息
    this.sendVoice = async (app, openid, mediaId) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "voice",
            "voice": {
                "media_id": mediaId
            }
        });
    };
    //发送视频消息
    this.sendVideo = async (app, openid, video) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "video",
            "video": video
        });
    };
    //发送音乐消息
    this.sendMusic = async (app, openid, music) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "music",
            "music": music
        });
    };
    //发送图文消息
    this.sendNews = async (app, openid, news) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "news",
            "news": news
        });
    };
    //发送图文消息
    this.sendMpnews = async (app, openid, mpnews) => {
        return await this.send(app, {
            "touser": openid,
            "msgtype": "mpnews",
            "mpnews": mpnews
        });
    };
})();

//接收回复消息
var receive = new(function() {
    var fns = {};
    this.on = function(type, fn) {
        if (typeof type === "string") {
            fns[type.toLowerCase()] = fn
        } else if (type instanceof Array) {
            type.forEach(k => {
                fns[k] = fn
            });
        } else if (typeof type == 'function') {
            fns["all"] = type
        }
    };
    this.onXml = async (xml, opt) => {
        var json = await util.toJson(xml);
        var mtype = (json.MsgType.toLowerCase() === 'event' ? json.Event : json.MsgType).toLowerCase();
        var fn = fns[mtype] || fns["all"] || null;
        if (!fn) return json;
        var msg = await fn(json, opt, mtype);
        if (msg) {
            msg.FromUserName = msg.FromUserName || json.ToUserName;
            msg.ToUserName = msg.ToUserName || json.FromUserName;
        }
        return msg;
    };
})();


module.exports.template = template;
module.exports.custom = custom;
module.exports.receive = receive;
module.exports = new(function() {
    const crypto = require('crypto');
    //获取随机字符串
    this.getNonce = function(length) {
        length = length || 32;
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var pos = chars.length;
        var nonces = [];
        var i;
        for (i = 0; i < length; i++) {
            nonces.push(chars.charAt(Math.floor(Math.random() * pos)));
        }
        return nonces.join('');
    };
    //拼接url参数
    this.toParam = function(params) {
        params = params || {};
        var keys = [];
        for (var k in params) {
            if (params.hasOwnProperty(k)) {
                if (['string', 'number'].indexOf(typeof params[k]) != -1) {
                    keys.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
                }
            }
        }
        return keys.join('&');
    };
    //拼接排序后的url参数
    this.marshall = function(params) {
        params = params || {};
        var keys = Object.keys(params).sort();
        var obj = {};
        var kvs = [];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            if (params[k]) {
                obj[k] = params[k];
                kvs.push(keys[i] + '=' + params[k]);
            }
        }
        return kvs.join('&');
    };
    //sha1签名
    this.sign = function(params, type) {
        var str = this.marshall(params);
        var sha1 = crypto.createHash(type || 'sha1');
        sha1.update(str);
        return sha1.digest('hex');
    };
    //xml转换为json
    this.toJson = function(xml, cb) {
        return new Promise(function(rcb) {
            if (typeof xml !== 'string' || xml.indexOf('<xml') === -1) return rcb(xml) && cb && cb(xml);
            var x2j = require('xml2js');
            x2j.parseString(xml, {
                explicitArray: false,
                ignoreAttrs: true
            }, function(error, json) {
                if (error) {
                    throw Error('Failed Parsing XML!' + error);
                }
                json = json.xml;
                rcb(json) && cb && cb(json);
            });
        });
    }
    //第三方平台验签
    this.checksign = function(token, timestamp, nonce, signature) {
        var shasum = crypto.createHash('sha1');
        var arr = [token, timestamp, nonce].sort();
        shasum.update(arr.join(''));
        var sign = shasum.digest('hex');
        return sign == signature;
    }
    //第三方平台签名
    this.signature = function(timestamp, nonce, encrypt) {
        var shasum = crypto.createHash('sha1');
        var arr = [this.token, timestamp, nonce, encrypt].sort();
        shasum.update(arr.join(''));
        return shasum.digest('hex');
    }
    //第三方平台解密数据
    this.decryptData = function(aeskey, data) {
        var aeskey = new Buffer(aeskey + '=', 'base64');
        if (aeskey.length !== 32) {
            throw new Error('encodingAESKey invalid');
        }
        var iv = aeskey.slice(0, 16);
        var decipher = crypto.createDecipheriv('aes-256-cbc', aeskey, iv);
        decipher.setAutoPadding(false);
        var deciphered = Buffer.concat([decipher.update(data, 'base64'), decipher.final()]);
        var pad = deciphered[deciphered.length - 1];
        pad = pad < 1 || pad > 32 ? 0 : pad;
        deciphered = deciphered.slice(0, deciphered.length - pad);
        var content = deciphered.slice(16);
        var length = content.slice(0, 4).readUInt32BE(0);
        return {
            xml: content.slice(4, length + 4).toString(),
            appid: content.slice(length + 4).toString()
        }
    }
    //第三方平台加密数据
    this.encryptData = function(appid, aeskey, xml) {
        var aeskey = new Buffer(aeskey + '=', 'base64');
        if (aeskey.length !== 32) {
            throw new Error('encodingAESKey invalid');
        }
        var iv = aeskey.slice(0, 16);
        var randomString = crypto.pseudoRandomBytes(16);
        var msg = new Buffer(xml);
        var msgLength = new Buffer(4);
        msgLength.writeUInt32BE(msg.length, 0);
        var id = new Buffer(appid);
        var bufMsg = Buffer.concat([randomString, msgLength, msg, id]);
        var blockSize = 32;
        var textLength = bufMsg.length;
        var amountToPad = blockSize - (textLength % blockSize);
        var result = new Buffer(amountToPad);
        result.fill(amountToPad);
        var encoded = Buffer.concat([bufMsg, result]);
        var cipher = crypto.createCipheriv('aes-256-cbc', aeskey, iv);
        cipher.setAutoPadding(false);
        var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
        return cipheredMsg.toString('base64');
    }
    //生成回复加密xml文档
    this.xmlEncry = function(appid, aeskey, xml) {
        var data = this.encryptData(appid, aeskey, xml);
        var timestamp = parseInt(Date.now / 1000);
        var nonce = this.getNonce(10);
        var signature = this.signature(timestamp, nonce, data);
        return this.toXml({
            Encrypt: data,
            MsgSignature: signature,
            TimeStamp: timestamp,
            Nonce: nonce
        });
    }
    //res加密
    this.resencrypt = function(wxconfig, data) {
        var nodeRSA = require('node-rsa');
        var key = require('fs').readFileSync(wxconfig.publicpem);
        var crt = new nodeRSA(key);
        var rsaed = crt.encrypt(data, 'base64', 'utf8');
        return rsaed;
    };
    //json转换为xml
    this.toXml = function(json) {
        var lines = [];
        lines.push('<xml>');
        for (var k in json) {
            if (json.hasOwnProperty(k)) {
                if (!json[k]) {
                    continue;
                }
                if (typeof json[k] === 'number') {
                    lines.push('<' + k + '>' + json[k] + '</' + k + '>');
                } else {
                    lines.push('<' + k + '><![CDATA[' + json[k] + ']]></' + k + '>');
                }
            }
        }
        lines.push('</xml>');
        return lines.join('');
    };
    String.prototype.format = function(args) {
        var result = this;
        if (arguments.length > 0) {
            var reg;
            if (arguments.length === 1 && typeof(args) == "object") {
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (args[key] != undefined) {
                            reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        reg = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    }
    Date.prototype.dateFormat = function(format) {
        var date = this;
        var map = {
            "M": date.getMonth() + 1, //月份   
            "d": date.getDate(), //日   
            "h": date.getHours(), //小时   
            "m": date.getMinutes(), //分   
            "s": date.getSeconds(), //秒   
            "q": Math.floor((date.getMonth() + 3) / 3) //季度 
        };
        format = format.replace(/([yMdhmsqf])+/g, function(all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            } else if (t === 'f') {
                return (date.getMilliseconds() + '').substr(3 - all.length);
            }
            return all;
        });
        return format;
    };
})();
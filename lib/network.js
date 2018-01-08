var request = require('request');
module.exports = {
    get: async (url) => {
        return await new Promise(function (cb) {
            request.get({
                url: url,
                json: true
            }, function (error, response, body) {
                cb(body || error);
            });
        });
    },
    post: async (url, data) => {
        return await new Promise(function (cb) {
            request.post({
                url: url,
                body: data,
                json: true
            },
                function (error, response, body) {
                    cb(body || error);
                }).on('response', function (response) {
                    if (response.headers['content-type'].indexOf('image/') == 0) {
                        response.setEncoding("binary");
                    }
                });
        });
    },
    sslpost: async (ssl, url, xml) => {
        return await new Promise(function (cb) {
            var options = {
                securityOptions: 'SSL_OP_NO_SSLv3'
            };
            if (ssl.pfx && ssl.pfxKey) {
                options.pfx = typeof ssl.pfx === 'string' ? new Buffer(ssl.pfx, 'base64') : ssl.pfx;
                options.passphrase = ssl.pfxKey;
            } else {
                options.pfx = require('fs').readFileSync(ssl.pfx || ssl.pkcs12);
                options.passphrase = ssl.key;
            }
            request.post({
                url: url,
                body: xml,
                agentOptions: options
            }, function (error, response, body) {
                cb(body || error);
            });
        });
    }
};
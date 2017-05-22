var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async()=> {
       // await this.jscode2session();
        await this.decryptData();
    };
    this.jscode2session = async()=> {
        var r = await api.wxapp.jscode2session(this.app, "003BDMfu0ano2d1fZLeu0S8Lfu0BDMf8");
        console.log(r);
    };
    this.decryptData = async()=> {
        var r = await api.wxapp.decryptData(this.app, 'bYpwD4F3CHaSYGxYDIFwUQ==', "EUOJBRS+GsOUlGsPYWWulExNaixiuZge2+LPvKrrXnUvSfbSNmXFgrwSpvXC6o0IVvfHpc5aMtNp2kF4O6ft/YqumaG+Lc3g7gGmI65MrzGls15+xRn7MAjZrvfHlEwnkxRlkOgp3Af0IKFWXfq7S+du5SoLrv6FQO1MAsVeW7WMZX8zSMhYrpg0FaCPX21sjI9HFYwPDp1gFf3392CVvimDQ8O/drEeJWKRlNrwzsRBw5fHZFcwWxi8yxpLzujO2eOF8tDCl1QeCSCCTdmLXf+VxD5jAt25TnavoSBAsMxqH2a8/X0IcT/P+6U+yEOFYHBUqrDjvaUApHSbxeu+COsUiNk0CkUtnPDfbzjO1i1upQXkaEnBBbJgvBIxWgZOaThxLl20fAejhEsUjobvmOBgafDzuTSQ9o9b/Y8PgfKUE+2zvFUH55+kcNMaG7PR", "bxnSxttyyEqeun4pn+T8/Q==");
        console.log(r);
    };
})();
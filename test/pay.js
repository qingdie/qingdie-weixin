var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () => {
       // await this.unifiedorder();
         await this.query();
        //  await this.refund();
        //  await this.refundquery();
        // await this.closeorder();
        //  await this.notify();
    };
    this.unifiedorder = async () => {
        var order = {
            openid: 'oSyyowCDu_MGuoEu4maA4T0h7ZLo',
            body: '粮油',
            out_trade_no: '20170201200800001',
            total_fee: 100
        };
        var r = await api.pay.payjs(this.wxconfig, order);
        console.log(r);
    };
    this.query = async () => {
        var order = {
            out_trade_no: '20170201200800004'
        };
        var r = await api.pay.query(this.wxconfig, order);
        console.log(r);
    };
    this.refund = async () => {
        var order = {
            out_trade_no: '20170201200800004',
            out_refund_no: '20170201200800004002',
            total_fee: 10,
            refund_fee: 2
        };
        var r = await api.pay.refund(this.wxconfig, order);
        console.log(r);
    };
    this.refundquery = async () => {
        var order = {
            out_trade_no: '20170201200800004',
            //out_refund_no: '20170201200800004002'
        };
        var r = await api.pay.refundquery(this.wxconfig, order);
        console.log(r);
    };
    this.closeorder = async () => {
        var order = {
            out_trade_no: '20170201200800004'
        };
        var r = await api.pay.closeorder(this.wxconfig, order);
        console.log(r);
    };

    this.notify = async () => {
        var xml = '<xml><appid><![CDATA[wx90d71a0b18c5fa45]]></appid><bank_type><![CDATA[CFT]]></bank_type><cash_fee><![CDATA[10]]></cash_fee><fee_type><![CDATA[CNY]]></fee_type><is_subscribe><![CDATA[Y]]></is_subscribe><mch_id><![CDATA[1326907501]]></mch_id><nonce_str><![CDATA[AltZjbEKaJknLZm7GJe3Hgx63DGslQuE]]></nonce_str><openid><![CDATA[oSyyowCDu_MGuoEu4maA4T0h7ZLo]]></openid><out_trade_no><![CDATA[20170201200800004]]></out_trade_no><result_code><![CDATA[SUCCESS]]></result_code><return_code><![CDATA[SUCCESS]]></return_code><sign><![CDATA[4DCEF0734667DE5FAFC964C196006518]]></sign><time_end><![CDATA[20170202000715]]></time_end><total_fee>10</total_fee><trade_type><![CDATA[JSAPI]]></trade_type><transaction_id><![CDATA[4002902001201702028345645638]]></transaction_id></xml>';
        var r = await api.pay.notify(this.wxconfig, xml);
        console.log(r);
    };
})();
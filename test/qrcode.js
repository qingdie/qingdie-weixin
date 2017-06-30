var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () => {
        await this.create();
    };
    this.create = async () => {
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                 scene: {
                     scene_id: 1
                 }
            }
        });
        console.log(r);
        r = api.qrcode.imgurl(r.ticket);
        console.log(r);
    };

})();
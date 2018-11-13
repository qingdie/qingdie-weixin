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
                    scene_id: 14
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 15
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 16
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 17
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 18
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 19
                }
            }
        });
        console.log(r);
        var r = await api.qrcode.create(this.app, {
            action_name: 'QR_LIMIT_SCENE',
            action_info: {
                scene: {
                    scene_id: 20
                }
            }
        });
        console.log(r);
    };

})();
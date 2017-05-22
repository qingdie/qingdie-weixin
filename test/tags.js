var api = require("qingdie-weixin");
module.exports = new (function () {
    this.app = {};
    this.all = async () =>{
        await this.get();
        await this.create();
        await this.update();
        await this.users();
        await this.batchtagging();
        await this.getidlist();
        await this.batchuntagging();
        await this.delete();
    };
    this.create = async()=> {
        var r = await api.tags.create(this.app, {
            tag : {
                name : "重要领导"//标签名
            }
        });
        this.id = r.tag.id;
        console.log(r);
    };
    this.get = async()=> {
        var r = await api.tags.get(this.app);
        console.log(r);
    };
    this.update = async()=> {
        var r = await api.tags.update(this.app, {
            "tag" : {
                "id" : this.id,
                "name" : "vip用户"
            }
        });
        console.log(r);
    };
    this.delete = async()=> {
        var r = await api.tags.delete(this.app, {
            "tag" : {
                "id" : this.id
            }
        });
        console.log(r);
    };
    this.users = async()=> {
        var r = await api.tags.users(this.app, {
            "tagid" : 102,
            //"next_openid": ""//第一个拉取的OPENID，不填默认从头开始拉取
        });
        console.log(r);
    };
    this.batchtagging = async()=> {
        var r = await api.tags.batchtagging(this.app, {
            "openid_list" : [
                "opHT2wD99svIiYON9Hw_Bk9IzrTI",
                "opHT2wCEGXpC8kf3E6sss3KVnrck"
            ],
            "tagid" : this.id
        });
        console.log(r);
    };
    this.batchuntagging = async()=> {
        var r = await api.tags.batchuntagging(this.app, {
            "openid_list" : [
                "opHT2wD99svIiYON9Hw_Bk9IzrTI",
                "opHT2wCEGXpC8kf3E6sss3KVnrck"
            ],
            "tagid" : this.id
        });
        console.log(r);
    };
    this.getidlist = async()=> {
        var r = await api.tags.getidlist(this.app, {
            "openid" : "opHT2wD99svIiYON9Hw_Bk9IzrTI"
        });
        console.log(r);
    };
})();
import config from '../config.js'
class Http {
    constructor(base_url = '') {
        this._baseUrl = base_url;
        this._requestCount = 0;
        this._showWait = true;
        this._showError = true;

    }
    setWait(value) {
        this._showWait = value;
        return this;
    }
    autoError(value) {
        this._showError = value;
        return this;
    }
    request(url, option = {}) {
        let that = this;
        return new Promise((resolve, reject) => {
            option.url = that._baseUrl + url;
            option.method = option.method || "POST";
            option.header = {
                'Content-Type': 'application/x-www-form-urlencoded',
               
            };
          //	option.header.token = uni.getStorageSync('access_token') || "";

            option.fail = function(res) {
                 setTimeout(function(){
                     var nowtime=(new Date().getTime())/1000;
                     var errortime=uni.getStorageSync('errortime');
                     if(!errortime) {
                         errortime=nowtime;
                         uni.setStorageSync('errortime',nowtime);
                     }
                     if(nowtime-errortime>3600*12){
                         
                         uni.setStorageSync('errortime',nowtime);
                        
                         uni.showToast({
                             title: '网络连接不可用，请稍后重试',
                            icon:'none',
                            duration: 1000,
                            position: "bottom"
                         }); 
                     }
                 },100)
           
            };
            

            option.success = function(res) {

                if (res.statusCode == 200) {
                    if (res.data && res.data.code == 200) {
                        resolve(res.data, res);
                    } else {
                        if (res.data && res.data.message && that._showError) {
                          
                            setTimeout(() => {
                                uni.showToast({
                                    icon: 'none',
                                    title: res.data.message
                                });
                            }, 20);
                        }
                        reject(res.data, res);
                    }
                } else {
                    if (res.data && res.data.message && that._showError) {
                        setTimeout(() => {
                            uni.showToast({
                                icon: 'none',
                                title: res.data.message
                            });
                        }, 20);
                    }
                    reject(res.data, res);
                }
            };
            let _complete = option.complete;
            option.complete = function(res) {
                that._showWait = true;
                that._showError = true;
                if (!(--that._requestCount)) uni.hideLoading();
                _complete && _complete(res);
            };
            if (that._showWait && !that._requestCount) {
                uni.showLoading({
                    title: '加载中',
                    mask: true
                });
            }
            that._requestCount++;

            uni.request(option);
        });
    }
    get(url, data = {}) {

        if (data._showWait === false) this.setWait(false);
        data.agentid=this.agentid();
        
        return this.request(url, {
            method: "GET",
            data
        });
    }
    
    post(url, data = {}) {

        if (data._showWait === false) this.setWait(false);
         data.agentid=this.agentid();
        
        return this.request(url, {
            method: "POST",
            data
        });
    }
    agentid(){
        if(uni.getStorageSync('agentid')) return uni.getStorageSync('agentid');
        else{
            var agentid=this.randomstr(18);
            uni.setStorageSync('agentid',agentid);
            return agentid;
        }
    }
    randomstr(len){
     var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
       var maxPos = chars.length;
   　　  var pwd='';
     for (var i = 0; i < len; i++) {
     　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
   　　}
   　　return pwd;
    }
}
export default new Http(config.apiUri);

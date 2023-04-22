import Vue from 'vue';
import App from './App';
import store from "./store";
import helper from "./extends/helpers";
import {
	mapMutations
} from 'vuex';

import LoadMore from './components/load-more';
import Result from './components/result-page';
import Sender from './components/sender';

import Payment from './components/payment';
import Contracts from './components/contacts';
import socket from "./library/socket"
import config from "./config.js";
import action from "./library/action.js";
import chat from "./library/chat.js";
import ican  from './js_sdk/ican-H5Api/ican-H5Api.js'
helper(Vue);
uni.setStorageSync('storeykey',"index");
//打包消息数据
const packMsg = function(res) {
 
	return {
		id: res.cache_key,
		msg: res
	};
};
//连接
socket.connect(config.socketUri);
//初始化
socket.on('init', () => { //连接初始化

   if( uni.getStorageSync('access_token')>0){
    socket.send({
    	type: 'login',
    	token: uni.getStorageSync('access_token'),
        imgUri:config.imgUri
    });   
   }
  
}).on('no_auth', () => { 
    //收到这条指令需要重新验证身份
   if( uni.getStorageSync('access_token')>0){
    socket.send({
    	type: 'login',
    	token: uni.getStorageSync('access_token'),
        imgUri:config.imgUri
    });   
   }

}).on('userinfo', (res) => { //收到自己的用户信息
//console.log(res.data);
uni.setStorageSync('userinfo',JSON.parse(res.data));
	store.commit('update_userinfo', JSON.parse(res.data));
}).on('message', (res) => { //有用户或群发来的消息
   console.log(res);
	//store.commit('chat/push', packMsg(res));
}).on('setting', (res) => { 
	store.commit('chat/setting', res.data);
}).on('chat', (res) => { //有用户或群发来的消息
//console.log(res);
chat.push(res,'index');
 // try{

 //    store.commit('chat/push', packMsg(res.data)); 
 // }catch(e){
 //     store.commit('chat/push', packMsg(JSON.parse(res.data))); 
 // }

	//
}).on('request', (res) => {
    //接收好友申请人数
   if(parseInt(res.num)>parseInt(uni.getStorageSync('newfriendnum'))){
       var   userinfo=uni.getStorageSync('userInfo');
       if(parseInt(userinfo.note2)!=0) uni.vibrateLong();
       if(parseInt(userinfo.note1)!=0) action.playVoice('/static/voice/friend.mp3');
   }
    uni.setStorageSync('newfriendnum',res.num);
   action.setStatusTips();
}).on('data_circle_tips', (res) => { 
    uni.setStorageSync('data_circle_tips',res.data);
   action.setStatusTips();
}).on('circle_push', (res) => {//更新朋友圈消息
    action.circleUpate(res.data)

}).on('otherlogin', (res) => {//另一台设备登录
      socket.send({
        	type: 'logout',
        	token: uni.getStorageSync('access_token'),
        }); 
       action.quitcid();
       uni.removeStorageSync('userInfo');
       uni.removeStorageSync('access_token'); 
   uni.showModal({
           title:'强制下线提醒',
           content:'您的账号于'+res.time+'在另一台设备登录',
       })
  setTimeout(function(){
 uni.reLaunch({
     url:'/pages/game/index',
 })      
  },1500)     

}).on('clearmsg', (res) => { //清空聊天记录
//console.log(res);
store.commit('chat/delete_msglist',res.key);

}).on('response', (res) => { //接收响应消息

	 console.log(res.message);
});



Vue.prototype.sendmsg = function (data){
    
   // console.log(packMsg(data))
store.commit('chat/push', packMsg(data));

}


Vue.prototype.clearchatlist = function (msg){
 store.commit('chat/clearchatlist',msg);

}

Vue.prototype.delete_msg = function (cache_key){
 store.commit('chat/delete_msglist',cache_key);

}
Vue.prototype.update_msglist = function (data){
 store.commit('chat/update_msglist',data);

}



Vue.prototype.image_cache= function(image_url) {
       
    // #ifndef APP-PLUS
    
    if(image_url==undefined) return false;
        
        
    if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
   
     return image_url;
       
    // #endif
     // #ifdef APP-PLUS
                if(image_url==undefined) return false;
    
           if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
    		var store=uni.getStorageSync('file_cache_'+image_url);
            if(store.length>10){
              uni.getSavedFileInfo({
                  filePath:store,
                  success: (res) => {
                 
                  },
                  fail: (res) => {
                      uni.removeStorageSync('file_cache_'+image_url)
                      return image_url;
                  }
              })
              //  console.log('本地存在缓存',store); 
          
           return store;
            }else{
          
                uni.downloadFile({
                	url: image_url,
                	success: (res) => {
                    
                		if (res.statusCode === 200) {
                             uni.saveFile({
                                  tempFilePath:res.tempFilePath,
                                  success: function (res1) {
                                    
                                    var savedFilePath = res1.savedFilePath;
                              
                                    uni.setStorageSync('file_cache_'+image_url,savedFilePath);
                                  }
                                });
                			
                		}
                	}
                }); 
                return image_url;
            }
           
           // #endif
    	}
Vue.prototype.GetUserinfo = function(userid){
  var friendlist =  uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata');
   if(!friendlist) friendlist=[];
   for(var i=0;i<friendlist.length;i++){
       if(friendlist[i].id==userid) return friendlist[i];
   }
  return [];
}

Vue.prototype.$socket = socket;
Vue.prototype.$store = store;
Vue.prototype.$packMsg = packMsg;
Vue.prototype.$action = action;

Vue.component('load-more', LoadMore);
Vue.component('result', Result);
Vue.component('v-sender', Sender);
Vue.component('v-payment', Payment);
Vue.component('v-contracts', Contracts);


Vue.config.productionTip = false;

App.mpType = 'app';
const app = new Vue({
	...App,
	store
});

app.$mount();




 import action from "./action.js"
 
 class chat {
     push(res,fromway){
   
         if(fromway!=uni.getStorageSync('storeykey')) return false;
        var   data={ id: res.data.cache_key, msg: res.data}
       
         let key = prefix(data.id);
       
         var msg_list_key = msglist_key();
         var statesource = cache(key) ? cache(key) : [];
        // console.log(statesource[statesource.length-1].msg_id,res.data.msg_id)
   if(statesource.length>0){
       if(statesource[statesource.length-1].msg_id==res.data.msg_id) return false;  
   }
        
         if (data.msg.sender_id != uni.getStorageSync('access_token')) data.msg.unread = 1;
         else data.msg.unread = 0;
         
         var statelist = [];
                var msglist = cache(msg_list_key) || [];    

            statesource.push(data.msg);
         //  console.log(data.msg.message);
         if (data.msg.message.type != 'tips' || data.msg.message.msg_type == 'show') {
             //更新消息列表
         
             if (data.msg.isloading == 0 || data.msg.message.msg_type == 'show') {
                
                 let msgindex = msglist.findIndex(v => v.key == key);
                 let unreadCount = 0;
                 var readtime=0;
                 if (msgindex >= 0) {
                     let tmp = msglist.splice(msgindex, 1);
                     unreadCount = tmp[0].msg.unread || 0;
                     readtime=tmp[0].msg.readtime || 0;
                 }
                    // console.log(data.msg);
                    //  console.log(data.msg.cache_key , uni.getStorageSync('cache_key'))
                 if (data.msg.self != 1 && data.msg.cache_key != uni.getStorageSync('cache_key')) {
                     var no_tip = 0;
                     var msgnotip = uni.getStorageSync('msgnotip');
                     if (!msgnotip) msgnotip = [];
                     msgnotip.map(item => {
                         if (item == data.msg.cache_key) {
                             no_tip = 1;
                         }
         
                     })
                     try {
                         data.msg.message.content = JSON.parse(data.msg.message.content);
         
                     } catch (e) {
         
                     }
                     if (data.msg.message.content.type == 'remind' && data.msg.message.content.remind.id == uni.getStorageSync('access_token')) {
                         no_tip = 0;
                         data.msg.message.content.content = data.msg.message.content.content.replace('@{' + data.msg
                             .message.content.remind.id + '}', '有人@我');
                         cache('remid_' + key, data.msg);
         
                     }
         
                     if (no_tip == 0) {
                         try{
                             let userinfo = cache('userInfo');
                           
                             if(parseInt(data.msg.group_id)>0){
                               if (parseInt(userinfo.note1) != 0) action.playVoice('/static/voice/chat.mp3');
                               if (parseInt(userinfo.note2) != 0) uni.vibrateLong();  
                             } 
                             else{
                                 if (parseInt(userinfo.note3) != 0) action.playVoice('/static/voice/friend.mp3');
                                 if (parseInt(userinfo.note4) != 0) uni.vibrateLong();
                             }
                         }catch(e){
                             //TODO handle the exception
                         }
         
                     }
                 }
                 //console.log(data.msg);
                 if (cache('remid_' + key)) var datamsg = cache('remid_' + key)
                 else
                     var datamsg = data.msg
                 delete datamsg['receiver']
         
                 msglist.push({
                     key,
                     msg: {
                         ...datamsg,
                         unread: data.msg.self ? unreadCount : unreadCount + 1,
                         readtime:0,
                         istop: 0
                     }
                 });
               
                 uni.setStorageSync(msg_list_key, msglist);
                 
            
             }
         
             // console.log(data.msg);
       
         } else {
         
             let list1 = statesource;
           
             
             //测回消息
             if (data.msg.message.msg_type == 'chat_back') {
                 // #ifdef APP-PLUS
                    plus.push.clear();
                   // #endif
                try{
                   var msg_id = data.msg.message.data.msg_id; 
                }catch(e){
                    //TODO handle the exception
                    var msg_id = data.msg.msg_id;
                }
                
                 var list = [];
                 if (msg_id > 0) {
                     var unread = 0;
                     var tempdata = '';
                       var num=0;
                       for(var i=0;i<statesource.length;i++){
                           var item=statesource[i];
                          if (parseInt(item.msg_id) == parseInt(msg_id) ) {
                                
                              
                            }
                          else{
                           list.push(item);
                              if (item.message.type != 'tips') {
                                  tempdata = item;
                                  unread = unread + item.unread;
                              }
                                       
                          } 
                       }
                  
                     
                    statesource= list;
         
                    
                     let msgindex = msglist.findIndex(v => v.key == key);
                     let unreadCount = 0;
                     if (msgindex >= 0) {
                         let tmp = msglist.splice(msgindex, 1);
                         unreadCount = tmp[0].msg.unread || 0;
                     }
                     msglist.push({
                         key,
                         msg: {
                             ...tempdata,
                             unread: unread,
                             istop: set_msgtop(data.msg.cache_key)
                         }
                     });
                    
                     cache(msg_list_key, msglist);
                   
                 }
                 
             }else{
                // console.log(data);
             }
         
         }
     
           uni.setStorageSync(key, statesource);
         return {'source':statesource,'msglist':msglist};
     }
 
     send(data){
         
         
         console.log(data);
     }
     
     //最近聊天记录
     msglist() {
         let tmp = [];
     
         var msg_list_key = msglist_key();
     
         let lists11 = cache(msg_list_key) ? cache(msg_list_key) : [];

         let lists = [];
         var userid=uni.getStorageSync('access_token') ;
         for (var i = 0; i < lists11.length; i++) {
             try {
                 //	console.log(lists11[i]['key'],uni.getStorageSync('access_token'));
                 if (lists11[i]['key'].indexOf(userid + '_chat_') > -1) lists.push(lists11[i]);
             } catch (e) {
     
             }
     
         }
        lists.forEach(v => {
     
             v.msg = Object.assign(v.msg, (+v.msg.group_id > 1) ? getGroupInfoById(v.msg.group_id) :
                 getUserInfo(v.msg));
     
             try {
                 v.msg.message.content = JSON.parse(v.msg.message.content);
     
             } catch (e) {
     
             }
     
             if (v.msg.message.content.type == 'remind') {
               if(v.msg.message.content.remind.id == uni.getStorageSync('access_token')){
                   
                     v.msg.message.content.content = v.msg.message.content.content.replace('@{' + v.msg.message.content.remind.id + '}', "有人@我"); 
               }else{
                  
                  var mem = getGroupmemebrs(v.msg.group_id, v.msg.message.content.remind.id);
                  if (mem.id==v.msg.message.content.remind.id) {
                      var atname = mem.nickname;
                  } else var atname = v.msg.message.content.remind.nickname;
                  v.msg.message.content.content = v.msg.message.content.content.replace('@{' + v.msg.message.content.remind.id + '}', '@' + atname); 
               }
              
     
             }
     
            // if (!v.msg.group_id) console.log(getUserInfoById(v.msg.id))
             if (!v.msg.none) tmp.push(v.msg);
         
     
         });
         let temp1 = [];
         let temp2 = [];
         tmp.map(item => {
             if (item.istop > 0) temp1.push(item)
             else temp2.push(item)
         })
         temp1.sort((a, b) => b.istop - a.istop);
         temp2.sort((a, b) => b.timestamp - a.timestamp);
         // tmp.sort((a, b) => b.timestamp - a.timestamp);
     
         action.setStatusTips();
         var res= temp1.concat(temp2);
           
         return res;
     }
     
     
 }
 
 export default new chat();
 const cache = function(key, value) {
 
     try {
         if (arguments.length == 1) {
             //            console.log(key);
             return uni.getStorageSync(key)
         }
         if (arguments.length > 1) {
             if (value === null) {
                 uni.removeStorageSync(key);
             } else {
                 uni.setStorageSync(key, value);
             }
         }
     } catch (e) {
         uni.showToast({
             icon: 'none',
             title: '程序发生错误'
         });
     }
 };
 const parseDate = (str) => new Date(str.replace(/(-|年|月)/g, '/').replace('日', ''));
 const dateToTime = (date) => date.getTime() / 1000;
 const cutTimeStr = (str) => str.substr(0, 11);
 
 function timestampToTime(timestamp) {
     var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
     var Y = date.getFullYear();
     var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
     var D = date.getDate();
     var h = date.getHours();
     var m = date.getMinutes();
     var s = date.getSeconds();
     if (D < 10) D = '0' + D;
     if (h < 10) h = '0' + h;
     if (m < 10) m = '0' + m;
     if (s < 10) s = '0' + s;
     return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
 }
 
 function setTimeShow(timestamp) {
     var time = timestampToTime(timestamp);
 
     var now = new Date();
     var Year = now.getFullYear();
     var month = now.getMonth() + 1;
     if (month < 10) month = '0' + month;
     var day = now.getDate();
     if (day < 10) day = '0' + day;
     var today = Year + '-' + month + '-' + day;
     if (time.substr(0, 10) == today) return time.substr(11, 8);
     if (time.substr(0, 4) == Year) return time.substr(5, 14);
     return time;
 }
 
 function prefix(id) {
 
     return uni.getStorageSync('access_token') + '_chat_' + id;
 }
 
 function prefixIndex(id) {
     return uni.getStorageSync('access_token') + prefix(id) + '_index';
 }
 
 function msglist_key() {
     return prefix('msglist');
 }
 
function set_msgtop(key) {
    var msgtop = cache('msgtop');

    var istop = 0;
    for (var i = 0; i < msgtop.length; i++) {
        if ( msgtop[i]== key) {
            return true;
        }
    }
    return false;
}

 
 
 function set_senderlist(sender) {
     var list = uni.getStorageSync(prefix('senderlist'));
 
     var isin = 0;
     if (list.length > 0) {
 
         for (var i = 0; i < list.length; i++) {
             if (parseInt(list[i].id) == parseInt(sender.id) && isin == 0) {
                 list[i].nickname = sender.nickname;
                 list[i].avatar = sender.avatar;
                 isin = 1;
             }
 
         }
 
     } else var list = Array();
     if (isin == 0) list.push(sender);
 
 
     uni.setStorageSync(prefix('senderlist'), list);
 
 }
 
 function getUserInfoById(id) {
     if (id > 0) {
 
         var result = {
             id,
             avatar: config.imgUri + '/uploads/avatar.jpg',
             nickname: '未知用户',
         };
         let list = uni.getStorageSync(uni.getStorageSync('access_token') + '_frienddata');
         if (!list) list = [];
         list.forEach(v => {
             if (v.id == id) {
                 result.nickname = v.nickname;
 
                 if (v.avatar.indexOf('http') > -1) {
 
                 } else v.avatar = config.imgUri + v.avatar
 
                 result.avatar = v.avatar;
             }
 
         })
     } else {
         var system = uni.getStorageSync('system');
 
         var result = {
             id,
             avatar: config.imgUri + system['admin_logo'],
             nickname: system['admin_nickname'],
         };
     }
 
 
 
 
 
 
     return result;
 }
 
 function getGroupInfoById(id) {
     var groups = uni.getStorageSync(uni.getStorageSync('access_token') + '_groups');
     for (var i = 0; i < groups.length; i++) {
         if (groups[i].id == id) {
             var avatar = groups[i].avatar;
             if (avatar !== null && avatar.indexOf('http') > -1) {
 
             } else avatar = config.imgUri + avatar
             var result = {
                 id: id,
                 avatar: avatar,
                 nickname: groups[i].nickname,
                 none: false
             };
 
 
             return result;
 
         }
     }
 
     return {
         id,
         avatar: config.imgUri + '/uploads/group.jpg',
         nickname: '未知群组',
         none: false
     };
 
 
 }
 
 function getGroupmemebrs(group_id, userid) {
     var members = uni.getStorageSync(group_id + '_group_members');
     if (!members) members = [];
     let result = [];
     members.forEach(item => {
         if (item.id == userid) result = item;
 
     })
     return result;
 }
 
 function get_chat_list(id) {
   
     try{
   var temp = cache(prefix(id)) ? cache(prefix(id)) : [];
       
   return temp;
     }catch(e){
         //TODO handle the exception
         return [];
     }
 }
 
 function get_chatold_list(id) {
     try{
       var temp = cache(prefix('old' + id)) ? cache(prefix('old' + id)) : [];
       return lists;  
     }catch(e){
         //TODO handle the exception
         return [];
     }
    
 }
 
 function msg_vocice(data) {
     if (data.msg.self != 1 && data.msg.cache_key != uni.getStorageSync('cache_key')) {
         var no_tip = 0;
         var msgnotip = uni.getStorageSync('msgnotip');
         if (!msgnotip) msgnotip = [];
         msgnotip.map(item => {
             if (item.storekey == data.msg.cache_key) {
                 no_tip = 1;
 
             }
 
         })
         if (data.msg.message.content.type == 'remind' && data.msg.message.content.remind.id == uni.getStorageSync(
                 'access_token')) {
             no_tip = 0;
             data.msg.message.content.content = data.msg.message.content.content.replace('@{' + data.msg.message.content
                 .remind.id + '}', '有人@我');
             cache('remid_' + key, data.msg);
 
         }
 
         if (no_tip == 0) {
             let userinfo = cache('userInfo');
 
             //  console.log(userinfo);
             if (parseInt(userinfo.note2) != 0) uni.vibrateLong();
             if (parseInt(userinfo.note1) != 0) action.playVoice('/static/voice/chat.mp3');
 
         }
     }
 
     return data;
 
 
 }
 
 function httpString(str) {
 
     var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
     //  console.log(str);
     
     try{
         
       var s = str.match(reg);
       if (s != null) {
           return s;
       } else {
           return false;
       }  
     }catch(e){
        return false; 
     }
     
     
 
 }
 
 function get_senderinfo(v) {
 
 
     try {
         if (v.group_id > 0) {
             var mem = getGroupmemebrs(v.group_id, v.sender_id);
             if (mem.id > 0) v.sender = mem;
             //  console.log(mem);
         }
         var avatar = v.sender.avatar;
         if (avatar.indexOf('http') > -1) {
 
         } else avatar = config.imgUri + avatar
         var obj = {
             id: v.sender_id,
             avatar: avatar,
             nickname: v.sender.nickname,
         };
     } catch (e) {
         //                 console.log(v);
         var obj = {
             id: v.sender_id,
             avatar: '',
             nickname: v.nickname,
         };
     }
 
     return obj;
 }
 
 function message_format(v) {
       
     try {
     v.message.content = JSON.parse(v.message.content);
         var type = v.message.content.type;
        
     } catch (e) {
         //TODO handle the exception
    
         var type = v.message.content.type;
     }
 
    
     if (type == 'remind') {
 
  var mem = getGroupmemebrs(v.group_id, v.message.content.remind.id);
                     if (mem.id==v.message.content.remind.id  ) {
                         var atname = mem.nickname;
                     } else 
       var atname = v.message.content.remind.nickname;
          
         v.message.content.content = v.message.content.content.replace('@{' + v.message.content.remind.id + '}', '@' +
             atname);
 
     }
     if (v.message.type == 'text' && v.message.content.type != 'emotion') {
 
         if (type == 'remind')
             var content = v.message.content.content;
         else var content = v.message.content;
 
         var res = httpString(content);
         if (res != false) {
             v.message.type = 'url';
             v.message.content = {};
             v.message.content.content = content;
             v.message.content.urls = res;
         }
     }
 
     return v;
 }
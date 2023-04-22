import Vue from 'vue';

var UNREAD_LIST_KEY = prefix('unread');
const GETS_NUM = 30;

import config from "../config.js";
import api from "../library/index.js"
import message from "../library/message.js"
import action from "../library/action.js"
var userid = uni.getStorageSync('access_token')
var groups = uni.getStorageSync(userid + '_groups')

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
var system=uni.getStorageSync('system');
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
function getUserInfo(msg){
   
    if(msg.id==1) return msg.group;
    else 
   {
        return getUserInfoById(msg.id)
    }
 
    
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

function getGroupInfoById(msg) {
    var id=msg.id;
   
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
        avatar: config.imgUri + msg.avatar,
        nickname:msg.nickname,
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

function get_chat_list(state, id) {
    var temp = cache(prefix(id)) ? cache(prefix(id)) : [];
    let lists = state.source[prefix(id)] || temp;
    return lists;
}

function get_chatold_list(state, id) {
    var temp = cache(prefix('old' + id)) ? cache(prefix('old' + id)) : [];
    let lists = state.source[prefix('old' + id)] || temp;
    return lists;
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
        if (data.msg.message.content.type == 'remind' && data.msg.message.content.remind.id == uni.getStorageSync('access_token')) {
            no_tip = 0;
            data.msg.message.content.content = data.msg.message.content.content.replace('@{' + data.msg.message.content.remind.id + '}', '有人@我');
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
            ///console.log(mem);
            if (mem.id > 0) v.sender = mem;
            if(v.sender_id>0){
                var avatar = v.sender.avatar;
                if (avatar.indexOf('http') > -1) {
                
                } else avatar = config.imgUri + avatar
                var obj = {
                    id: v.sender_id,
                    avatar: avatar,
                    nickname: v.sender.nickname,
                };
            }else{
                var result = {
                    id,
                    avatar: config.imgUri + system['admin_logo'],
                    nickname: system['admin_nickname'],
                };
            }
            //  console.log(mem);
        }
        else{
            if(v.sender_id>0){
                var avatar = v.sender.avatar;
                if (avatar.indexOf('http') > -1) {
                
                } else avatar = config.imgUri + avatar
                var obj = {
                    id: v.sender_id,
                    avatar: avatar,
                    nickname: v.sender.nickname,
                };
            }else{
                var result = {
                    id,
                    avatar: config.imgUri + system['admin_logo'],
                    nickname: system['admin_nickname'],
                };
            }
        }
        
    } catch (e) {
              
        var obj = getUserInfoById(v.sender_id);
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

      if ( v.message.content.remind.id == uni.getStorageSync('access_token')) {
      
         v.message.content.content = v.message.content.content.replace('@{' + v.message.content.remind.id + '}', '有人@我');
      }
            else{
                var mem = getGroupmemebrs(v.group_id, v.message.content.remind.id);
                                   if (mem.id==v.message.content.remind.id  ) {
                                       var atname = mem.nickname;
                                   } else 
                     var atname = v.message.content.remind.nickname;
                        
                       v.message.content.content = v.message.content.content.replace('@{' + v.message.content.remind.id + '}', '@' +atname);
                
            }


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
import http from "../library/http.js"
export default {
    namespaced: true,
    state: {
        source: {},
        msglist: []
    },
    mutations: {
        /**
         * 从缓存里拉去消息
         * @param {Object} state
         * @param {Object} id
         */
        pull(state, id) {
            //  console.log('pull');
            let key = prefix(id);
            let data = cache(key) || [];
            let indexKey = prefixIndex(id);
            let beforeList = state.source[key] || [];
            // console.log(id);
            if (data.length && beforeList.length == 0) {
                /* let _index = state.source[indexKey] === undefined ? (data.length - 1) : state.source[indexKey],
                	list = [];
                for (let i = 0; i < GETS_NUM && _index >= 0 && data[_index]; _index--, i++) list.push(data[_index]);
                Vue.set(state.source, key, list.reverse().concat(state.source[key] || [])); //让属性具有响应式 */
                Vue.set(state.source, key, data.concat(state.source[key] || [])); //让属性具有响应式
                // state.source[indexKey] = _index;
            } else {
                // Vue.set(state.source, key, []);
                // state.source[indexKey] = undefined;
            }
        },
        /**
         * 推送消息到缓存
         * @param {Object} state
         * @param {Object} data
         */
        push(state, data) {

            let key = prefix(data.id);
            //  console.log(data);
            var msg_list_key = msglist_key();
            var temp = cache(key) ? cache(key) : [];

            Vue.set(state.source, key, temp);
            //	if(!data.msg['_mid']) data.msg['_mid'] = 'm' + Math.random().toString(36).substring(2); //生成唯一id
            if (data.msg.sender_id != uni.getStorageSync('access_token')) data.msg.unread = 1;
            else data.msg.unread = 0;

            var statelist = [];
        
     
                state.source[key].push(data.msg);

            //  console.log(data.msg.message);
            if (data.msg.message.type != 'tips' || data.msg.message.msg_type == 'show') {
                //更新消息列表

                if (data.msg.isloading == 0 || data.msg.message.msg_type == 'show') {
                    let msglist = cache(msg_list_key) || [];
              
                    
                    let msgindex = msglist.findIndex(v => v.key == key);
                      //   console.log(msgindex,key)
                    let unreadCount = 0;
                    if (msgindex >= 0) {
                        let tmp = msglist.splice(msgindex, 1);
                        unreadCount = tmp[0].msg.unread || 0;
                    }


                    if (data.msg.self != 1 && data.msg.cache_key != uni.getStorageSync('cache_key')) {
                        var no_tip = 0;
                        var msgnotip = uni.getStorageSync('msgnotip');
                        if (!msgnotip) msgnotip = [];
                        msgnotip.map(item => {
                            if (item.storekey == data.msg.cache_key) {
                                no_tip = 1;

                            }

                        })
                        try {
                            data.msg.message.content = JSON.parse(data.msg.message.content);

                        } catch (e) {

                        }
                        if (data.msg.message.content.type == 'remind' && data.msg.message.content.remind.id == uni.getStorageSync('access_token')) {
                            no_tip = 0;
                            data.msg.message.content.content = data.msg.message.content.content.replace('@{' + data.msg.message.content.remind.id + '}', '有人@我');
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
                            istop: set_msgtop(data.msg.cache_key)
                        }
                    });



                    state.msglist = msglist;
                    cache(msg_list_key, msglist);
                }

                // console.log(data.msg);

            } else {

                let list1 = state.source[key];
                var msg_id = data.msg.message.data.msg_id;
                //测回消息
                if (data.msg.message.msg_type = 'chat_back') {
                    // #ifdef APP-PLUS
                       plus.push.clear();
                      // #endif
                    var list = [];
                    if (msg_id > 0) {
                        var unread = 0;
                        var tempdata = '';
                        list1.map(item => {
                            if (item.msg_id != msg_id) {
                                list.push(item);
                                if (item.message.type != 'tips') {
                                    tempdata = item;
                                    unread = unread + item.unread;
                                }
                            }
                            
                        })
                        state.source[key] = list;

                        let msglist = cache(msg_list_key) || [];
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
                                istop: set_msgtop(key)
                            }
                        });
                        state.msglist = msglist;
                        cache(msg_list_key, msglist);
                    }

                }

            }
            cache(key, state.source[key]);
            action.setStatusTips();
        },

        //从云端更新历史聊天记录

        update_message(state, data) {

            let key = prefix(data.id);
            var msg_list_key = msglist_key();
            var temp = cache(key) ? cache(key) : [];
            var listsold = get_chatold_list(state, data.id);
            Vue.set(state.source, key, temp);

            //	if(!data.msg['_mid']) data.msg['_mid'] = 'm' + Math.random().toString(36).substring(2); //生成唯一id
            if (data.msg.sender_id != uni.getStorageSync('access_token')) data.msg.unread = 1;
            else data.msg.unread = 0;

            var statelist = temp;
            var isin = 0;
            temp.map(item => {

                if (parseInt(item.msg_id) == parseInt(data.msg.msg_id)) {
                    isin = 1;
                }
            })
            if(isin==0){
                listsold.map(item => {
                            
                    if (parseInt(item.msg_id) == parseInt(data.msg.msg_id)) {
                    
                        isin = 1;
                    }
                })
            }
        
            if (isin == 0) {
                statelist.push(data.msg);

            }
            state.source[key] = statelist;
            cache(key, state.source[key]);

        },


        //删除
        clearchatlist(state, msg) {

            var key = prefix(msg.storekey);

            let lists = get_chat_list(state, msg.storekey);

            let list = [];
            lists.map(item => {

                if (item._mid != msg._mid) {
                    list.push(item)
                }
            })
            state.source[key] = list;
            Vue.set(state.source, key, list);
            uni.setStorageSync(key, list);

            //历史消息删除
            var listsold = get_chatold_list(state, msg.storekey);
            var listold = [];
            listsold.map(item => {

                if (item._mid != msg._mid) {
                    listold.push(item)
                }

            })
            var keyold = prefix('old' + msg.storekey);
            uni.setStorageSync(keyold, listold);
            var msg_list_key = msglist_key();
            let msglist = cache(msg_list_key) || [];

            var data = [];
            for (var i = list.length - 1; i >= 0; i--) {

                if (list[i].message.type != 'tips') {
                    data = list[i];
                    break;
                }


            }

            for (var i = 0; i < msglist.length; i++) {
                if (msglist[i].key == key) {
                    msglist[i].msg = {
                        ...data,
                        unread: 0,
                        istop: set_msgtop(msglist[i].msg.cache_key)
                    }
                }
            }

            state.msglist = msglist;
            uni.setStorageSync(msg_list_key, msglist);


            var userid = parseInt(uni.getStorageSync('access_token'));
            var postdata = {
                id: msg.msg_id,
                userid: userid
            };

            http.setWait(false).post('group.php?act=clearchatlist', postdata).then(res => {

            })
        },

        //更新历史消息记录
        update_msglist(state, msglist) {
            var msg_list_key = msglist_key();
            state.msglist = msglist;
         
            uni.setStorageSync(msg_list_key, msglist);
        },

        //设置
        setting(state, data) {

            cache('setting', data);
            if (!data.msgtop) data.msgtop = [];
            cache('msgtop', data.msgtop);
            if (!data.msgnotip) data.msgnotip = [];
            cache('msgnotip', data.msgnotip);
            var msg_key = msglist_key();

            var lists = uni.getStorageSync(msg_key) ? uni.getStorageSync(msg_key) : [];
            let list = [];
            let msgtop = data.msgtop;
            var list11 = [];
            lists.map(item => {
            
                item.msg.istop = set_msgtop(item.msg.cache_key);
                // item.msg.istop=0;
                // console.log()
                list11.push(item);

            })
            //  console.log(list11);
            state.msglist = list11;
            uni.setStorageSync(msg_key, list11);
        },

        //置顶
       set_istop(state){
         var msg_key = msglist_key();
         var msgtop =  uni.getStorageSync('msgtop')?uni.getStorageSync('msgtop'):[];
        
         var lists = uni.getStorageSync(msg_key) ? uni.getStorageSync(msg_key) : [];
         let list = [];
    
         var list11 = [];
         lists.map(item => {
             var istop=false;
          for (var i = 0; i < msgtop.length; i++) {
           
              if ( msgtop[i]== item.msg.cache_key) {
                 istop=true;
              }
          }
             item.msg.istop = istop;
  
             list11.push(item);
         
         })
         //  console.log(list11);
         state.msglist = list11;
         uni.setStorageSync(msg_key, list11);  
       },
        //标记已读未读
        set_read(state,msg){
           if(msg.unread>0) var unread=0;
           else var unread=1;
           var msg_key = msglist_key();

           var lists = uni.getStorageSync(msg_key) ? uni.getStorageSync(msg_key) : [];
           let list = [];
               
           var list11 = [];
           lists.map(item => {
            
             if(item.msg.cache_key==msg.cache_key)  item.msg.unread = unread;
             
               list11.push(item);
           
           })
           //  console.log(list11);
           state.msglist = list11;
          uni.setStorageSync(msg_key, list11);
           action.setStatusTips();
        http.setWait(false).get('group.php?act=setReadTime3',{cache_key:msg.cache_key,userid:uni.getStorageSync('access_token'),unread:unread}).then(res=>{
          
        })
          
        },
        
        update_msglist(state,msg){
        
           var msg_key = msglist_key();
        
           state.msglist = msg;
          uni.setStorageSync(msg_key, msg);
           action.setStatusTips();
       
        },
        
        //删除消息列表
        delete_msglist(state, cache_key) {
            var msg_key = msglist_key();

            var lists = uni.getStorageSync(msg_key);
            let list = [];
            lists.map(item => {

                if (item.msg.cache_key != cache_key) list.push(item)

            })
            state.msglist = list;
            uni.setStorageSync(msg_key, list);
            cache(prefix(cache_key), '');
            state.source[prefix(cache_key)] = '';
            cache(prefix('old' + cache_key), '');
            console.log(cache_key);
            if (cache_key.indexOf('G') > -1) {
                var groupid = cache_key.substr(1, cache_key.length - 1);
                var userid = parseInt(uni.getStorageSync('access_token'));
                var touid = 0;
                var isgroup=1;
            } else {
                var touid = cache_key.substr(1, cache_key.length - 1);
                var userid = parseInt(uni.getStorageSync('access_token'));
                var groupid = 0;
                var isgroup=0;
            }
            http.setWait(false).post('group.php?act=delete_msglist', {
                groupid: groupid,
                userid: userid,
                touid: touid,
                isgroup:isgroup
            }).then(res => {
                // console.log(res);
            })

            action.setStatusTips();

        },


        /**
         * 初始化数据
         * @param {Object} state
         * @param {Object} id
         */
        init(state, id) {
            let indexKey = prefixIndex(id);
            // Vue.set(state.source, prefix(id), []);
            // state.source[indexKey] = undefined;
            uni.setStorageSync('cache_key', id);
            var key = prefix(id);
            uni.setStorageSync('remid_' + key, '');
            if (state.msglist.length) {
                //清空未读消息
                state.msglist.forEach(v => {
                    // console.log(v);
                    if (prefix(id) == v.key) v.msg.unread = 0;
                });


                var msg_list_key = msglist_key();
                cache(msg_list_key, state.msglist);
            }
        },
        /**
         * 清除未读标记
         */
        clearunread(state, id) {
            var msg_list_key = msglist_key();
            if (state.msglist.length) {
                //清空未读消息
                state.msglist.forEach(v => {
                    if (prefix(id) == v.key) v.msg.unread = 0;
                });
                cache(msg_list_key, state.msglist);
            }
          //  console.log({cache_key:id,userid:uni.getStorageSync('access_token')})
            http.setWait(false).get('group.php?act=setReadTime2',{cache_key:id,userid:uni.getStorageSync('access_token')}).then(res=>{
                 
            })
        },
        /**
         * 清除聊天记录
         */
        clear(state) {
            state.source = [];
            state.msglist = [];
        },

        clear_message(state, key) {
            var msg_list_key = msglist_key();
            // console.log(msg_list_key);
            let lists = cache(msg_list_key) ? cache(msg_list_key) : [];
            let list = [];

            console.log(key);
            lists.map(item => {
                console.log(item);
                if (parseInt(item.msg_id) != parseInt(key)) {

                    list.push(item)
                }

            })


            state.msglist = list;
            cache(msg_list_key, list);
        },


        receiveredpack(state, data) {
            let key = prefix(data.id);
            let list = cache(key) || [];
            list.forEach(v => {
                if (v.message.type == 'redpack' && v.message.content.id == data.redpack_id) {
                    if (!v.message.content.hasget) v.message.content.hasget = true;
                }
            });
            cache(key, list);
            let list2 = state.source[key] || [];
            list2.forEach(v => {
                if (v.message.type == 'redpack' && v.message.content.id == data.redpack_id) {
                    if (!v.message.content.hasget) v.message.content.hasget = true;
                }
            });
        },
      
        setredpackempty(state, data) {
            let key = prefix(data.id);
            let list = cache(key) || [];
            list.forEach(v => {
                if (v.message.type == 'redpack' && v.message.content.id == data.redpack_id) {
                    if (!v.message.content.empty) v.message.content.empty = true;
                }
            });
            cache(key, list);
            let list2 = state.source[key] || [];
            list2.forEach(v => {
                if (v.message.type == 'redpack' && v.message.content.id == data.redpack_id) {
                    if (!v.message.content.empty) v.message.content.empty = true;
                }
            });
        }
    },
    getters: {

        messagesold: (state) => (id, page) => {
            var shownum = 20;
            let tmp = [];
            var timeshow = 0;
            var timeshow1 = 0;

            if (page > 0) {
                var lists = get_chatold_list(state, id);
                var start = lists.length - 1;
               
                var to = start - page * shownum + 1;
                if (to < 0) to = 0;
                if (start > 0) {
                 
                    for (var i = start; i >= to; i--) {
                        var v = lists[i];
                        var obj = get_senderinfo(v);

                        if (v.message.type != 'tips' && (parseInt(v.timestamp) - parseInt(timeshow) >= 300 ||
                                parseInt(v.timestamp) - parseInt(timeshow1) >= 900)) {
                            if (v.timestamp) {
                                tmp.push({
                                    message: {
                                        type: 'tips',
                                        content: {
                                            type: 'time',
                                            text: setTimeShow(v.timestamp)
                                        }
                                    }
                                });
                                timeshow1 = v.timestamp;
                            }

                        }
                        try {
                            var isloading = v.isloading;
                        } catch (e) {
                            var isloading = 0
                        }
                        v = message_format(v);
                        timeshow = v.timestamp;
                        var array = {
                            msgtype: 'msg',
                            ...obj,
                            self: v.self,
                            message: v.message,
                            msg_id: v.msg_id,
                            storekey: id,
                            _mid: v._mid,
                            time: v.timestamp,
                            isloading: isloading,
                            group_id: v.group_id,
                          
                        }

                        tmp.push(array);
                    }



                }

            }
           // console.log(tmp.length)
            return tmp;
        },
        /**
         * 获取消息内容列表
         */
        messages: (state) => (id) => {
            var shownum = 15;
            let lists = get_chat_list(state, id);

            var key = prefix(id);
            let tmp = [];
            let lastTime = false;
            var timeshow = 0;
            var timeshow1 = 0;
            var list22 = [];
            var num = 0;
            var len = lists.length;
            var is_oldadd = 0;
            var starttime = (new Date()).getTime() / 1000 - 7 * 24 * 3600;
            if (len > 0 && (len > shownum) && lists[lists.length-1].isloading==1) {
                var lists_old = get_chatold_list(state, id);
                var key_old = prefix('old' + id);
                is_oldadd = 1;
            }

                 var nowtime=(new Date().getTime())/1000;
               
            lists.map(v => {
              
                num++;
            
                if (len - num < shownum || lists[lists.length-1].isloading==0) {
                    v.unread = 0;
                    if (v.isloading == 1) {
                        if (nowtime - (parseInt(v.timestamp)) > 120) v.isloading = 2;
                        num--;
                    }
                    
                   
                    list22.push(v);
                   
                    var obj = get_senderinfo(v);

                    if (v.message.type != 'tips' && (parseInt(v.timestamp) - parseInt(timeshow) >= 300 ||
                            parseInt(v.timestamp) - parseInt(timeshow1) >= 900)) {
                        if (v.timestamp) {
                            tmp.push({
                                message: {
                                    type: 'tips',
                                    content: {
                                        type: 'time',
                                        text: setTimeShow(v.timestamp)
                                    }
                                }
                            });
                            timeshow1 = v.timestamp;
                        }

                    }
                    try {
                        var isloading = v.isloading;
                    } catch (e) {
                        var isloading = 0
                    }
                    v = message_format(v);

  
                    timeshow = v.timestamp;
                    var array = {
                        msgtype: 'msg',
                        ...obj,
                        self: v.self,
                        message: v.message,
                        msg_id: v.msg_id,
                        storekey: id,
                        _mid: v._mid,
                        time: v.timestamp,
                        isloading: isloading,
                        group_id: v.group_id
                    }
                       
                    tmp.push(array);
                } else {
               
                
                  //setTimeout(function(){
                     
                     
                     try{
                       var isin = 0;
                       var to=lists_old.length-5;
                                
                       for(var i=lists_old.length-1;i>=to;i--){  
                           if (parseInt(lists_old[i].msg_id) == parseInt(v.msg_id)) {
                               isin = 1;
                               break;
                           }
                       }
                         if(isin==0) {
                             lists_old.push(v);
                            
                         }  
                     }catch(e){
                         //TODO handle the exception
                     }
                    
                        
                // },10000,lists_old,v)
             
                }

            });
            //  console.log(list22.length)
            state.source[id] = list22;
            cache(key, list22);

            if (is_oldadd == 1) {
                 cache(key_old, lists_old);
               
            }



            return tmp;
        },

        /**
         * 检查消息是否还有更多
         */
        checkmore: (state) => (id) => {
            if (state.source[prefixIndex(id)] === undefined) return false;
            return state.source[prefixIndex(id)] >= 0;
        },
        /**
         * 获取最近的聊天列表
         */
        msglist: (state) => {
            let tmp = [];

            var msg_list_key = msglist_key();

            let lists11 = uni.getStorageSync(msg_list_key) ? uni.getStorageSync(msg_list_key) : [];

        //console.log(msg_list_key,lists11.length)

            let lists = [];
            for (var i = 0; i < lists11.length; i++) {
                try {
                    //	console.log(lists11[i]['key'],uni.getStorageSync('access_token'));
                    if (lists11[i]['key'].indexOf(uni.getStorageSync('access_token') + '_chat_') > -1) lists.push(
                        lists11[i]);
                } catch (e) {

                }

            }


            Vue.set(state, 'msglist', lists);
            state.msglist.forEach(v => {

            
               v.msg = Object.assign(v.msg, (+v.msg.cache_key.indexOf('G') > -1) ? getGroupInfoById(v.msg) :v.msg.group);

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
                if (item.istop==true) temp1.push(item)
                else temp2.push(item)
            })
            temp1.sort((a, b) =>b.timestamp - a.timestamp);
            temp2.sort((a, b) => b.timestamp - a.timestamp);
            // tmp.sort((a, b) => b.timestamp - a.timestamp);

            action.setStatusTips();
            var res= temp1.concat(temp2);
              
            return res;
        }
    }
}


import config from '../config.js'
const parseDate = (str) => new Date(str.replace(/(-|年|月)/g, '/').replace('日', ''));
const dateToTime = (date) => date.getTime() / 1000;
const cutTimeStr = (str) => str.substr(0,11);
class Message {
	//注册
	list(){
        
     
       var msg_list_key=uni.getStorageSync('access_token')+'_chat_msglist';
     let tmp = [];
     let lists11 =uni.getStorageSync(msg_list_key)?uni.getStorageSync(msg_list_key):[];
     	let list= [];

         let lists=[];
         for(var i=0;i<lists11.length;i++){
        
         try{
         	console.log(lists11[i]['key'],uni.getStorageSync('access_token'));
         	if(lists11[i]['key'].indexOf(uni.getStorageSync('access_token')+'_chat_')>-1) lists.push(lists11[i]);
         }catch(e){
         	
         }
         }
     
        uni.setStorageSync(msg_list_key,lists);
    
     	lists.forEach(v => {
    
           if(v.msg.group_id>0){
               
               
               
           }
           else{
             var avatar=v.msg.avatar;
             if(avatar!==null && avatar.indexOf('http')>-1) {
                 
             }else avatar=config.imgUri+avatar
             var  userinfo = {
             	avatar:avatar,
             	nickname:v.msg.nickname,
                 
             }; 
                               
           }
                
            
             v.msg = Object.assign(v.msg, (+v.msg.group_id > 0) ? getGroupInfoById(v.msg.receiver) :userinfo);
             
     		if(!v.msg.none) tmp.push(v.msg);
          // console.log(JSON.stringify(v));
             
     	});
     	tmp.sort((a, b) => dateToTime(parseDate(b.time)) - dateToTime(parseDate(a.time)));
     	//console.log(tmp)
     	return tmp;
    
	}
    
    }
    export default new Message()
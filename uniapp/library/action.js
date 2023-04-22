		import http from "./http.js"
 class Action {
	
	/** 播放音效 */
	playVoice(path){

        var innerAudioContext = uni.createInnerAudioContext();  
        innerAudioContext.autoplay = true;  
        innerAudioContext.src=path;
         innerAudioContext.play();
        
	}
    toChat(message){
        if(uni.getStorageSync('ispush')===true){
              uni.setStorageSync('ispush',false)
               if(uni.getStorageSync('access_token')>0){
                   
        if(message.id>0){
             var url="../friend/chat?id="+message.id;
             if(message.type=='group') url="../group/chat?id="+message.id;
             else if(message.type=='request') {
                 url="../friend/request?type="+message.senderid;
             }
             uni.navigateTo({
                 url:url
             }) 
          
         }
         else{
            uni.reLaunch({
                url:'../index/index'
            }) 
         }        
     }
     else{
         uni.navigateTo({
             url:'../login/index'
         }) 
     }
         }
    }
     timestampToTime(timestamp) {
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() ;
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            var D = date.getDate();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            if(D<10) D='0'+D;
             if(h<10) h='0'+h;
              if(m<10) m='0'+m;
               if(s<10) s='0'+s;
            return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
    }
	/** 时间戳转换 */
	timestampFormat( timestamp ) {
		let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
		timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
		curDate = new Date( curTimestamp * 1000 ), // 当前时间日期对象
		tmDate = new Date( timestamp * 1000 ),  // 参数时间戳转换成的日期对象
		Y = tmDate.getFullYear(), 
		m = tmDate.getMonth() + 1, d = tmDate.getDate(),
		H = tmDate.getHours(), i = tmDate.getMinutes(), 
		s = tmDate.getSeconds();
		if ( timestampDiff < 60 ) { // 一分钟以内
			return "刚刚";
		} else if( timestampDiff < 3600 ) { // 一小时前之内
			return Math.floor( timestampDiff / 60 ) + "分钟前";
		} else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
			return '今天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
		} else {
			var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
			if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
				return '昨天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			} else if ( curDate.getFullYear() == Y ) {
				return  ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			} else {
				return  Y + '年' + ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			}
		}
	}
    
    
    /** 显示状态通知提醒 */
    setStatusTips(){
    	let pages = getCurrentPages();
     
    	if(pages.length < 1){
    		return;
    	}
    	let route = pages[pages.length - 1].route;
    
        
         var num=0;
         if(uni.getStorageSync('access_token')){
             try{
                   var msg_key=uni.getStorageSync('access_token')+'_chat_msglist';
                    var msg_list=uni.getStorageSync(msg_key);
                   msg_list.map(item=>{
                    
                     num+=parseInt(item.msg.unread)
                   })
                        
                }catch(e){
                    
                }
                  
                 	if(num){
                 		uni.setTabBarBadge({
                 		 index: 0,
                 		 text: (num + ''),
                    
                 		});
                 		if(route == 'pages/index/index'){
                 			uni.setNavigationBarTitle({
                 				title: '消息' + '(' + num +')',
                 			});
                 		}
                 	}
              else{
             uni.removeTabBarBadge({ index: 0 });
              
                if(route == 'pages/index/index'){
                	uni.setNavigationBarTitle({
                		title: '消息' ,
                	});
                }  
              }
             
         }
         // #ifdef APP-PLUS
       if(plus.os.name=='iOS') 
         plus.runtime.setBadgeNumber(num);
          // #endif
    
     
       return num;
    	
    }
    
     
    
    /** 路由守卫执行方法 */
    routeTool() {
    	let token =  uni.getStorageSync('access_token');
    	/** 没有token就跳转到登陆去获得token */
    	if(!token){
    		uni.reLaunch({
    			url: '/pages/login/index'
    		});
    		return;
    	}
    	/** 如果没有连接上socket,则连接 */
    	if(!_data.data('socket_state')) {
    		_mixins.methods.$socketSend();
    	}
    }
    
    addFrend(userid,mark){

        
    }
    
    
    circleUpate(data){

        var k=uni.getStorageSync('access_token')+'_circle_data';
        var circle_data=uni.getStorageSync(k);
        var newdata=[];
        var info=data.info;
        try{
            circle_data.map(item=>{
              
                if(parseInt(item.id)==parseInt(data.id)){
                    if(data.action!='delete'){
                        item.like=info.like;
                        item.comment=info.comment;
                        newdata.push(item);
                    }
                }else{
                    newdata.push(item);
                }
            })
            uni.setStorageSync(k,newdata);
        }catch(e){
            //TODO handle the exception
        }
       
    }
    
   image_cache(image_url,call_back) {
    		var store=uni.getStorageSync(image_url);
            if(store){
                 console.log('本地存在缓存',store); 
            
            }else{
                console.log('本地没有缓存,需要下载');
                uni.downloadFile({
                	url: image_url,
                	success: (res) => {
                        console.log('图片下载成功',res);
                		if (res.statusCode === 200) {
                			uni.setStorageSync(res);
                		}
                	}
                }); 
                
                
            }
            
         
    	}
        
       
        
        
       init(){
           
       http.setWait(false).get('index.php?act=init',{}).then(res=>{
        var data=res.data;
 
       uni.setStorageSync('system',data.system);

         uni.setStorageSync('note',data.note);
       })
       // #ifdef APP-PLUS
       this.bindcid()
        // #endif
       }
       
       bindcid(){
        // #ifdef APP-PLUS
          var user=uni.getStorageSync('userInfo');
            if(user.id>0){
               var clientid= plus.push.getClientInfo().clientid;
             
               http.setWait(false).get('index.php?act=bindcid',{cid:clientid,userid:user.id,osname:plus.os.name}).then(res=>{
              
               })
            }
            // #endif
       }
       quitcid(){
             // #ifdef APP-PLUS
                var clientid= plus.push.getClientInfo().clientid;
         http.setWait(false).get('index.php?act=quitcid',{cid:clientid}).then(res=>{
                       
         })  
         // #endif
       }
       
   profileTips(tips,path){
     
     uni.showModal({
     	title: '提示',
     	content: tips,
     	showCancel: true,
     	cancelText: '取消',
     	confirmText: '去设置',
     	success: res => {
           
     		if(res.confirm) {
                 uni.setStorageSync('profileback',path);
               uni.redirectTo({
                 url:"/pages/mine/profile"  
               })
     		}
     	}
     });
       
   }
   
   loginTips(tips,path){
       
        if(uni.getStorageSync('access_token')>0) {
            return true;
        }
    else{
         uni.showModal({
         	title: '提示',
         	content: tips,
         	showCancel: true,
         	cancelText: '取消',
         	confirmText: '登录',
         	success: res => {
               
         		if(res.confirm) {
                     uni.setStorageSync('gourl',path);
                   uni.redirectTo({
                     url:"/pages/login/index"  
                   })
         		}
         	}
         });
         return false;
     }  
   }
   //检查用户是否被冻结
   check_userlock(){
       var user= uni.getStorageSync('userInfo');
       if(user.lock_time==undefined || user.lock_time==null) user.lock_time=0;
       if(user.status==1 || (user.status==2 && parseInt(user.lock_time)>= Date.parse(new Date())/1000)){
      
           uni.showModal({
           	title: '提示',
           	content: "您的账户已被冻结,无法完成此项操作\n如有问题，请联系客服",
           	showCancel: true,
           	cancelText: '取消',
           	confirmText: '联系客服',
           	success: res => { 
           		if(res.confirm) {
                       var system=uni.getStorageSync('system');
                     uni.redirectTo({
                       url:"/pages/friend/chat?id="+system['admin_id']  
                     })
           		}
           	}
           });
           return false;
       }
       else{
           return true;
       }
   }
   
  
   
   
        
}
export default new Action();
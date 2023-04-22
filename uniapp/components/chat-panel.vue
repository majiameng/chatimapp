<template>
	<view  @tap="ontap">
		<scroll-view class="chat-detail" :style="{'height':chatheight+'px'}"  id="chat" scroll-y="true"  :scroll-into-view="scrollToView"
		 @scroll="chatscroll">

	<!-- <view class="chat-detail" id="chat" auto-height="true" > -->
			<!-- 加载历史数据waitingUI -->
      <view class="nodata" v-if="showmore && system.chattime<3650"> 仅能查看最近{{system.chattime}}日的聊天记录</view>
			<view class="loading" v-if="showLoading">
				<view class="spinner">
					<view class="rect1"></view>
					<view class="rect2"></view>
					<view class="rect3"></view>
					<view class="rect4"></view>
					<view class="rect5"></view>
				</view>
			</view>
           
<view v-for="(m,index) in messagelist_old" :key="'itemold_'+m.msg_id"  :id="'item_'+m.msg_id" v-if="m.isloading!=3">
    <messageitem :item="m" :loading_id="loading_id" :userid="userid" :playVoiceId="playVoiceId" @redpack_open="redpack_open" @atusuer='atusuer' @clickAvatar='clickAvatar' @msgAction='msgAction' @play_vedio='play_vedio' @playVoice="playVoice"></messageitem>
        
</view>

<view v-for="(m,index) in messagelist"  :key="'itemnew_'+m.msg_id"  :id="'item_'+m.msg_id" v-if="m.isloading!=3">
    
    <view class="nodata" v-if="unreadid==m.msg_id">以下是未读消息</view>
    <messageitem :item="m" :ref="'messageitem_'+index" :loading_id="loading_id" :unreadid="unreadid" :userid="userid" :playVoiceId="playVoiceId"  @redpack_open="redpack_open" @atusuer='atusuer' @clickAvatar='clickAvatar' @msgAction='msgAction' @play_vedio='play_vedio' @playVoice="playVoice"></messageitem>
        
</view>
 	
<view  v-if="sending">
 
    <messageitem   id="self_send" :item="sendingdata" :userid="userid"  :loading_id="loading_id" @clickAvatar='clickAvatar'  @redpack_open="redpack_open" @msgAction='msgAction' @play_vedio='play_vedio' @playVoice="playVoice"></messageitem>
     
</view>
<view id="self_bottom1" class="self_bottom" >
    
</view>
<view id="self_bottom2" class="self_bottom" >
    
</view>
	<!-- </view> -->
  
	</scroll-view>
      <view class="unread" @tap="scrollto_unread" v-if="unreadnum>0">有<view class="num">{{unreadnum}}</view>条未读消息</view>
        <view :class="touch_class" :style="touch_style" v-if="touch_menu" >
            <block v-for="(m1,index1) in touch_menulist" :key="'menu_'+index1">
                    <view @tap="tap_menu(m1.type)">{{m1.text}}</view>
            </block>
        </view>
        <view  class="vedioplay" v-if="videoshow" :style="{'display':videoshow?'inline-block':'none'}" >
     <video id="video_play" :src="videosrc" loop="false" autoplay="true"  @play="playVedio()" @ended="endVedio()" @pause="pauseVedio()" :poster="poster"  ></video>
   
   
   <view class="bottom">
       <uni-icons type='closeempty' class="icon1" @tap="endVedio()" ></uni-icons>
       
   </view>
        </view>
     


  <redpick v-if="is_redpack_open" :item="redpack_info" @closePick="is_redpack_open=false;" @fresmsg="freshmsg_fromredopen"></redpick>
 <logoutwords v-if="showlogout" :item="logoutinfo"  @sub="logout_sub" @cancle="showlogout=false;" ></logoutwords>
    </view>
   

    
</template>

<script>
    
    import {
    	mapState,
    	mapGetters
    } from 'vuex';
    import action from '../library/action.js'
 
    import messageitem from './messageitem.vue'
   import http from "../library/http.js"
      import chat from "../library/chat.js"
     import uniIcons from './uni-icons/uni-icons.vue'
        import redpick from './get-redpick.vue'
        import Vue from 'vue';
           import logoutwords from './logout_words.vue'
	const innerAudioContext = uni.createInnerAudioContext();
	let loadStatus = false;
	let lastMid = '';
    var windowHeight= uni.getSystemInfoSync().windowHeight;	
    var windowWidth= uni.getSystemInfoSync().windowWidth;	
    var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
     var chatheight=windowHeight- 60 ;
     var chattop=0;
     // #ifndef APP-PLUS
     var chattop=statusBarHeight + 45;
       var windowWidth= uni.getSystemInfoSync().screenHeight;	
     var chatheight=uni.getSystemInfoSync().windowHeight - chattop  - 60 ;
     // #endif
    
   function timestampToTime(timestamp) {
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

	export default {
        components: {
            uniIcons,
            messageitem,redpick,
            logoutwords
            
        },
		props: {
			storeKey: {
				
				require: true
			},
            boardheight:{
              type:Number,
              default:0
            },
            manager: {
            	type: [Number, String,Object,Boolean],
            	default: 0
            },
            thistype:{
              default:'',  
            },
			sending: {
				type: Boolean,
				default: false
			},
            sendingdata:{
                
                default:{}
            },
            no_add: {
            	type: Boolean,
            	default: false
            },
            atme:{
               default:0 
            },
            at_msg_id:{
                default:0
            }
                     
		},
		data() {
			return {
                
                chatheight:chatheight,
                chattop:chattop,
                panelheight:chatheight,
                paddingtop:0,
				scrollToView: 'self_bottom2',
				scrollAnimation: true,
				showLoading: false,
				playVoiceId: '',
				isizes: {},
				pageHeight: 0,
				contentViewHeight: 0,
				footViewHeight: 90,
				mitemHeight: 0,
				scrollTop: 0,
				letterDetails: [],
                senderheight:0,
                hide_list:'',
                loading_id:0,
                playVedioId: '',
                videoshow:false,
                videosrc:"",
                video_playing:false,
                video_end:false,
                poster:null,
                isbottom:false,
                pagemaxtop:0,
                isscroll:false,
                pagetop:0,
                storeId:0,
                isgroup:1,
                page:0,
                pagenum:0,
                userid:parseInt(uni.getStorageSync('access_token')),
                isfrist:0,
                oldheight:0,
                lastmessage:[],
                oldlength:0,
                showmore:false,
                touch_menu:false,
                touch_style:"",
                touch_class:'touch_menu',
                touch_menulist:[],
                touch_time:0,
                touch_timer:null,
                message:[],
                touch_item:null,
                isfristload:true,
                maxheight:0,
                msg_id1:0,
                messagelist:uni.getStorageSync(uni.getStorageSync('access_token')+"_chat_"+this.storeKey),
                messagelist_old:[],
                isupdate:false,
                lastscroll:0,
                scrollpos:'down',
                unreadid:0,
                unreadnum:0,
                 redpack_info:{},
                 is_redpack_open:false,
                 showlogout:false,
                 logoutinfo:{},
                 keyboardheight:0,
                 system:uni.getStorageSync('system')
            
			};
		},
   
		mounted() {
           
            uni.setStorageSync('storeykey','chat');
             if(this.atme==1 && this.at_msg_id>0){
                 
                 this.scrolltoAtme();
             }else{
                 this.isfristload=false;
             }
           
		    this.scrollToBottom(0);
             
          this.storeId=this.storeKey.substr(1,this.storeKey.length-1);
     
          if(this.storeKey.indexOf('G')>-1){
              this.isgroup=1;
              //群组消息
             this.group_read(this.storeId);
            
          }else{
              this.isgroup=0;
             this.user_read(this.storeId);
               
              //私人消息
          }
         //  console.log(this.messagelist.length)
         // if(this.messagelist.length>30){
         //     for(var i=0;i<this.messagelist.length-30;i++){
         //         this.messagelist.splice(i,1);
         //     }
              
         //     uni.setStorageSync(uni.getStorageSync('access_token')+"_chat_"+this.storeKey,this.messagelist);
         // }
         var that=this;
         that.messageslist(0);
           

         var that=this;
      this.$socket.on('chat', (res) => {
          
             this.sendmsg(res);
       })  
     
       
        // #ifdef APP-PLUS
        var that=this;
        setTimeout(function(){
   var wh= uni.getSystemInfoSync().screenHeight;
    var ch=wh - statusBarHeight - 105 ;
      if(ch<that.chatheight) that.chatheight=ch;
      else{
         var wh= uni.getSystemInfoSync().windowHeight;
          var ch=wh  - 60 ; 
          that.chatheight=ch;
      }
        },1000)
        uni.onKeyboardHeightChange(res => {
           
                if(res.height>0){
                    that.scrollToBottom();
                }
             this.chatheight=this.panelheight-res.height;
             this.$forceUpdate();
             
               this.keyboardheight=res.height;
            // console.log(this.chatheight);
        // console.log(this.panelheight,this.maxheight)
        // if(this.panelheight<=this.maxheight  && this.messagelist.length<=6){
        //     // that.paddingtop=res.height;
        //     // that.$forceUpdate();
        // }
        
         })
         // #endif
         
  
        

       
         // console.log(message)
		},
        destroyed(){
            this.$socket.off('chat');
            uni.setStorageSync('storeykey',"index");
            if(this.isgroup==1){
               this.group_read(this.storeId);
              
            }else{
               this.user_read(this.storeId);
            }
        },
		computed: {
		},
	
		methods: {
            redpack_open(m){
              this.redpack_info=m;  
              this.is_redpack_open=true;
              
            },
            scrolltoAtme(){
               if(this.atme==1 && this.at_msg_id>0  && this.isfristload==true){
                   this.scrollToView='item_'+this.at_msg_id;
                   this.isfristload=false;
               }
             
            },
           
            sendmsg(res){
              var res= chat.push(res,'chat');
               if(res!=false){
                 //  console.log(res.msglist.length)
                      this.$store.commit('chat/update_msglist',res.msglist);
               }
               this.freshmsg()
              
            },
            freshmsg(){
                 this.messagelist= uni.getStorageSync(this.userid+"_chat_"+this.storeKey);
              
            },
            freshmsg_fromredopen(e){
                //this.messagelist='';
              this.freshmsg();  
              // var index=this.messagelist.findIndex(v => v.msg_id == e.msg_id);
              // console.log(index)
              // this.$set(this.messagelist,index,e)

          
            },
        
            isindexhtml(str){
              var arr=['<br','&nbsp;',"<div" ,"<span"  ] ;
              str=str.toString();
               for(var i=0;i<arr.length;i++){
                   //console.log(str,arr[i])
                 if(str.indexOf(arr[i])>-1) return true;
               }
               return false;
            },
            
            getautoheight(){
               // console.log(this.oldheight);
                this.showLoading=false;
                var that=this;
              setTimeout(function(){
                  if(this.pagenum>0)
                 that.scrollToView='item_'.that.msg_id1;  
              },200)
              
            },
            
            
            message_format(data){
                var messagedata=[];
                if(data.length>0){
                    for(var i=0;i<data.length;i++){
                        var item=data[i];
                     
                        try{
                            if(item.type=='time'){
                                 var temp={type:'tips',message:{content:item.content,type:'tips'},'msg_id':item.id,isloading:0};
                                 temp['sender_id']=item.userid;
                                 temp['sender']=item.sender;
                                 temp['timestamp']=item.addtime;
                                 messagedata.push(temp);
                               
                             }
                                                            
                            else if( item.addtime !=undefined &&item.addtime>0){
                               var temp={};
                               
                                 temp['_mid']='m' + Math.random().toString(36).substring(2); 
                                 
                                 temp['cache_key']=this.storeKey;
                                   
                                 temp['group_id']=item.groupid;
                                 
                                 if(this.isgroup==1) temp['id']=item.groupid;else temp['id']=item.userid;
                              
                                 temp['isloading']=0;
                                 temp['msg_id']=item.id;
                                 temp['self']=item.self;
                                 temp['sender_id']=item.userid;
                                 temp['sender']=item.sender;
                                 temp['timestamp']=item.addtime;
                                 temp['unread']=0;
                                 temp['type']=item.type; 
                                
                                 temp['message']={'type':item.type,'content':item.content1};
                                
                                  messagedata.push(temp);
                           
                            }
                            
                        }catch(e){
                            //TODO handle the exception
                           /// console.log(e)
                        }          
                    }
                }
                
                return messagedata;
            },
			//获取云端消息记录
            messageslist(totime){
                var lists=[];
                var time1= (new Date()).getTime()/1000-7*24*3600;
                if(totime<1){
                    var isfrist=true;
                    totime=parseInt((new Date()).getTime()/1000);
                }else{
                    var isfrist=false;
                if(this.showLoading==true) return false;
                }    
                var storekey=this.storeKey
                var postdata={id:parseInt(this.storeId),userid:parseInt(this.userid),isgroup:this.isgroup,totime:totime};
              
             var that=this;
      
                  http.setWait(false).get('group.php?act=messages2',postdata).then(res=>{
                   
                     if(res.code==200){
                   
                        //     console.log(res);
                            var data=res.data;
                             var messagedata=this.message_format(data);             
                    if(isfrist==true) {
                        if(messagedata.length<1) {
                            this.messagelist=[];
                             this.showmore=true;
                        }
                     uni.setStorageSync(this.userid+"_chat_"+this.storeKey,messagedata);
                      this.freshmsg(); 
                         
                       var that=this;
                         setTimeout(function(){ 
                       
                             if(that.atme==1 && that.at_msg_id>0){
                       
                                 that.scrolltoAtme();
                             }
                             else
                             that.scrollToBottom();
                             that.isupdate=true;
                             },300)  
                           
                       }
                       else {
                              
                              this.showLoading=false;
                              if(messagedata.length>0){
                                  if(this.messagelist_old.length>0){
                                      var scrollToView='item_'+this.messagelist_old[0].msg_id;
                                       this.messagelist_old.unshift(...messagedata)
                                  }
                                  
                                  else {
                                        var scrollToView='item_'+this.messagelist[0].msg_id;
                                         this.messagelist_old=messagedata;
                                  }
                                 
                                    this.showmore=false;
                                    var that=this;
                                    setTimeout(function(){that.scrollToView=scrollToView},200)
                              }
                              else{
                                  this.showmore=true;
                              }
                          }
                                               
                     }
                  
                  })
            },
            
       
            
          update_message(data){
              var isin=0;
              for(var i=this.messagelist.length-1;i>=0;i--){
                  var item=this.messagelist[i];
                  if(parseInt(item.msg_id) == parseInt(data.msg.msg_id)){
                      return false;
                  }
              }

              var messageold= uni.getStorageSync(this.userid+"_chatold_"+this.storeKey);
              for(var i=messageold.length-1;i>=0;i--){
                  var item=messageold[i];
                  if(parseInt(item.msg_id) == parseInt(data.msg.msg_id)){
                      return false;
                  }
              }
             var  message= messageold.concat(this.messagelist);
              
              
          },
            //设置群未读消息
            group_read(group_id){
                   this.$store.commit('chat/clearunread', this.storeKey);  
              
                
            },
            user_read(userid){
              
              this.$store.commit('chat/clearunread', this.storeKey);  
             
                
            },
          scrollto_unread(){
              this.scrollToView="item_"+this.unreadid;
                this.unreadid=0;
                this.unreadnum=0;
            },
            chatscroll(e){
                
             // if(this.keyboardheight>0) uni.hideKeyboard();         
                this.touch_menu=false;
                var top=e.detail.scrollTop;
                this.maxheight=e.detail.scrollHeight;
                if(top>this.maxheight) this.maxheight=top;
                
               
                if(top+this.panelheight>=this.maxheight-100 && top>0) {
                 this.isbottom=true;   
                    this.unreadid=0;
                    this.unreadnum=0;
                }
                else this.isbottom=false;
             
                 if(top>this.lastscroll) this.scrollpos='down';
                 else this.scrollpos='up';
                // console.log(this.scrollpos,this.isbottom);
                
                this.lastscroll=top;
                if(top<50 && this.isfristload==false  && this.isupdate==true){
                    if(this.messagelist_old.length>0){
                        var msg=this.messagelist_old[0];
                    }
                    else{
                        var msg=this.messagelist[0];
                    }
                      if(msg.timestamp==undefined) var totime=msg.msg_id;
                      else var totime=msg.timestamp;
                      if(totime>0) totime=totime-1;
                  
                   this.messageslist(parseInt(totime));
                   this.showLoading=true;

                  
                }
            },
            
            setAutoHeight(e){
                 //console.log(e);
            this.touch_menu=false;
            },
      
            vedio_show(m){
                      
              if(m.isloading==1){ 
              return m.message.content.src;
              }
              else 
              return this.image_cache(m.message.content.src)  
                
            },
            
            poster_show(m){
                if(m.isloading==1){
                return false;
                }
                else {
            
                       var src=m.message.content.src;
                    try{
                        var arr=src.split('/');
                        var filename=arr[arr.length-1];
                         var arr1=filename.split('.');
                         var newname=arr1[0]+"_video.jpg";
                          var poster= src.replace(filename,newname);
                        return poster;
                    }catch(e){
                        //TODO handle the exception
                      return "/static/img/vediobanner.jpg";
                    }
                 
      
                }
                 
           
            },
          
        
			scrollToBottom: function() {
                var that=this;
                                   
                setTimeout(function(){ 
                 if(that.scrollToView=="self_bottom1")
                   that.scrollToView="self_bottom2";
                    else{
                        that.scrollToView="self_bottom1";
                    }
                     that.pagenum=0;
                     that.isbottom=true;
                     that.unreadnum=0;
                     that.unreadid=0;
                    },200)
			},
	
    
            play_vedio(m){
                this.videoshow=true;
                this.videosrc=this.vedio_show(m);
                this.poster=this.poster_show(m);
                this.video_playing=false;
               
                var that=this;
                setTimeout(function(){
                    var videoContext = uni.createVideoContext('video_play');
                    if(that.video_playing==false){
                      //  videoContext.requestFullScreen(0);
                        // setTimeout(function(){videoContext.play()},100);
                        that.playVedioId=m._mid;
                          videoContext.play(); 
                    }              
                },500)   
            },
            
            //结束播放
            endVedio(){
                this.video_end=true;
                var videoContext = uni.createVideoContext('video_play');
                // videoContext.exitFullScreen();
                 videoContext.pause();
                 this.playVedioId="";
                 this.videosrc="";
                 this.pauseVedio();
                 var that=this;
                 that.video_end=false;
              
                  
            },
            playVedio(){
                
                this.video_playing=true;
                this.video_end=false;
                this.videoshow=true;
                    
            },
            pauseVedio(){
                      
                 this.video_playing=false;
                 this.videoshow=false;
            },
            screenchange(){
               
                    
                    if(this.video_playing==true){
                     var videoContext = uni.createVideoContext('video_play');
                       videoContext.exitFullScreen();
                       videoContext.pause();
                       this.playVedioId="";
                       this.videosrc="";
                       this.pauseVedio();
                        
                    }
                    else{
                       if(this.video_end==false){  
                       var videoContext = uni.createVideoContext('video_play');
                           videoContext.play();
                          }        
                    }
               
                
            },
	
			playVoice(message) {
               
			
                  var that=this;
          
                   var id = message._mid;
                   if(this.playVoiceId==id){
                       
                       innerAudioContext.stop();
                       innerAudioContext.src ='';
                       that.playVoiceId = "";
                       that.loading_id=0;
                     return false;
                       
                   }
                   
                   if(this.playVoiceId!==''){
                       
                       innerAudioContext.stop();
                       innerAudioContext.src ='';
                       that.playVoiceId = "";
                       that.loading_id=0;           
                   }
                   
                   
                   
				// if (this.playVoiceId == '') {
                    
                    this.loading_id=id;
					innerAudioContext.src = this.image_cache(message.message.content.url);
                    innerAudioContext.volume=1;
                    innerAudioContext.autoplay = true;
                  
                    innerAudioContext.onCanplay(function(){
                      innerAudioContext.play();  
                      that.playVoiceId = id;
                      that.loading_id=0;
                    })
					
					innerAudioContext.onEnded(() => {
                        innerAudioContext.stop();
                        innerAudioContext.src ='';
						that.playVoiceId = "";
                        that.loading_id=0;
					});
					

			},
		    atusuer(msg){
                  
                  if(msg.sender.id!=this.userid){
                    let result={
                               id:msg.id,
                               nickname:msg.sender.nickname
                           }
                         
                    this.$emit('close',result);   
                  }
                
                 //  console.log(msg)  ;
            },
			clickAvatar(msg) {
            

                if(msg.id>0){
                   var  params = {id: msg.sender.id,'group_id':msg.group_id,thistype:this.thistype};
                   // console.log(JSON.stringify(msg));
                    return this.$jump('friend.detail',params)
                   				//this.$emit('click-avatar', this.messages[index]); 
                }
               else{
                   return false;
               }
			},
		toText(msg){
		  var text= msg.replace(/&nbsp;/g, ' ');  
       
		    text=text.replace(/<br>/g, '\n'); 
		
		                text=   text.replace(/<\/?[^>]*>/g, '');
		                
		    return text;
		},
            copyText(msg){
                var message=msg.message;
                if(message.content.type=='remind')
                var content=message.content.content;
                else if(message.type=='url')
                 var content=message.content.content;
                else var content=message.content
               content=this.toText(content);
               
                uni.setClipboardData({
                    data: content,
                    success: function () {
                       uni.showToast({
                           title:'复制成功',
                           icon:'none'
                           
                       })
                    }
                });
            },
            ontap(){
              if(new Date().getTime()-this.touch_time>1500)  this.touch_menu=false;;
            },
            
            delete_msg(msg){
                
              
                var list=this.messagelist;
           var isin=0;
            var list11=[];
            list.forEach(item=>{
             
                if(parseInt(item.msg_id)==parseInt(msg.msg_id)) {
                   // item.isloading=3;
                   isin=1;
                }
                else{
                    
                    list11.push(item);
                }
            })
         
                  var that=this;
          if(isin==1){
            that.messagelist=list11;
               uni.setStorageSync(this.userid+"_chat_"+this.storeKey,list11);  
          }else{
              var list=this.messagelist_old;
             
               var list11=[];
               list.forEach(item=>{
                   if(parseInt(item.msg_id)==parseInt(msg.msg_id)) {
                 
                   }
                   else{
                      
                       list11.push(item);
                   }
               })
             that.messagelist_old=list11;
          }
     
          var postdata = {
              id: msg.msg_id,
              userid: this.userid
          };
          
          http.setWait(false).get('group.php?act=clearchatlist', postdata).then(res => {
          
          })
            //  this.freshmsg();
               
            },
            logout_sub(e){
                uni.showToast({
                                  icon:'none',
                                  title:'操作成功'
                              })
                          
            },
            tap_menu(type){
                var msg=this.touch_item;
              
                uni.showToast({
                    title:new Date().getTime()-this.touch_time
                })
                     
              if(new Date().getTime()-this.touch_time>1000){
                     
                  this.touch_menu=false;
                   var that=this;
                  if(type=="delete"){
                    
                     // this.clearchatlist(msg);
                     this.delete_msg(msg)
                  }
                  if(type=='copy'){
                       that.copyText(msg);
                    
                  }
                  if(type=='back'){
                       let data = {
                                    userid:that.userid,
                                    msg_id: msg.msg_id,
                                    type:'chat_back',
                                  store:that.storeKey
                              }
                                                 
                           that.$socket.send(data);
                  }
                  if(type=='at'){
                      that.atusuer(msg);
                  }
                  if(type=='view'){
                      that.clickAvatar(msg);
                  }
                 
                  if(type=='manage0'){
                     var data={type:'groupset1',mode:'manage',settype:0,group_id:msg.group_id,userid:msg.sender.id,from_uid:uni.getStorageSync('access_token')};
                     that.$socket.send(data); 
                     
                  }
                  if(type=='manage1'){
                     var data={type:'groupset1',mode:'manage',settype:1,group_id:msg.group_id,userid:msg.sender.id,from_uid:uni.getStorageSync('access_token')};
                     that.$socket.send(data);  
                  }
                  if(type=='deny0'){
                     var data={type:'groupset1',mode:'deny',settype:0,group_id:msg.group_id,userid:msg.sender.id,from_uid:uni.getStorageSync('access_token')};
                     that.$socket.send(data); 
                     
                  }
                  if(type=='deny1'){
                     var data={type:'groupset1',mode:'deny',settype:1,group_id:msg.group_id,userid:msg.sender.id,from_uid:uni.getStorageSync('access_token')};
                     that.$socket.send(data);  
                  }
                  
                  if(type=='deleteuser'){
                     //    var data={type:'deleteGroup',group_id:msg.group_id,userid:msg.id,fromid:uni.getStorageSync('access_token')};
                     
                     // that.$socket.send(data);  
                     this.showlogout=true;
                     this.logoutinfo={group_id:msg.group_id,userid:msg.sender.id,nickname:msg.sender.nickname};
                  }
                  
                  if(type=='manage0' || type=='manage1' || type=='deny0' || type=='deny1' || type=='deleteuser'){
                      uni.showToast({
                          title:'操作成功',
                          icon:'none'
                      })
                  }
                  
              }
               
                    
                    
            },
            msgAction(e,msg){
                this.touch_item=msg;
                this.touch_time=new Date().getTime();
                var user_id=uni.getStorageSync('access_token');
             
                var  that=this;
                var itemList=[{type:'delete',text:'删除'}];
                if( (that.manager==1 && msg.group_id>0 )  || (user_id==msg.sender.id && new Date().getTime() / 1000 - (parseInt(msg.timestamp))<=120)){
                
                    itemList.push({type:'back',text:'撤回消息'});
                }
                if(msg.message.type=='text' || msg.message.type=='url'){
                     itemList.push({type:'copy',text:'复制'});
                }
                
           
               if(that.manager==1 && msg.group_id>0 && user_id!=msg.sender.id) {
                 var users = uni.getStorageSync(msg.group_id+'_group_members');
                 var thistype='user';
                 var usertype="user";
                 var is_deny=0;
                 var isin=0;
                 for(var i=0;i<users.length;i++){
                    
                     if(users[i].id==user_id) thistype=users[i].type;
                     if(users[i].id==msg.sender.id) {
                         usertype=users[i].type; 
                         is_deny=users[i].is_deny;
                          isin=1;
                     }
                   
                 }
               }
                if(thistype=='owner'){
                  
                    if(usertype=='manager' ) itemList.push({'type':'manage0','text':'取消管理'});
                    else itemList.push({'type':'manage1','text':'设为管理'});
                    if(is_deny==1) itemList.push({'type':'deny0','text':'解除禁言'});
                    else itemList.push({'type':'deny1','text':'禁言'});
                  if(isin==1)  itemList.push({'type':'deleteuser','text':'踢人'});
                }
                if(thistype=='manager'  && usertype=='user'){
                  if(is_deny==1) itemList.push({'type':'deny0','text':'解除禁言'});
                    else itemList.push({'type':'deny1','text':'禁言'});
                   if(isin==1) itemList.push({'type':'deleteuser','text':'踢人'});
                }
               // itemList.push({type:'view',text:'查看名片'});
                this.touch_menulist=itemList;
              
          this.touch_menu=0;
       var y=e.changedTouches[0].clientY+50;
        var yy="top";
        var xx="left";
        var top=0;
        var classname="touch_menu";
                   var len=itemList.length;
       
       if(y<160){
           yy='top'
           top=y-10
        classname+=' top';
       }else{
       top=windowHeight-y+85 ;
       yy='bottom';
      classname+=' bottom'
       }
    
       
       if(msg.sender.id==this.userid){
           var xx="right";
           //var x=windowWidth-x;
         classname+=" right";
       }
       else classname+=" left";
     
       this.touch_class=classname;
           
         this.touch_style=yy+":"+top+"px";
         
           setTimeout(function(){that.touch_menu=true;},100)
             clearTimeout( this.touch_timer);
            this.touch_timer=  setTimeout(function(){that.touch_menu=0;},5000)

            },
		},
		watch: {
		
			messagelist(val) {
             
            if(val.length>0){
                var last=val[val.length-1];
                if(last.msg_id!=this.lastmessage.msg_id){
                   //this.pagenum=0;
                //   console.log(last);
                    if(last.self==1 && this.sendingdata._mid==last._mid   || last.message.type=='tips') {
                       this.$emit('setSending',false);   
                       this.scrollToBottom();   
                    }
                    else{
                       if(this.isbottom==true){
                           this.scrollToBottom();
                       }else{
                           if(last.self!=1){
                           this.unreadnum++;
                           if(this.unreadid==0) this.unreadid=last.msg_id;    
                           }
                           
                       }
                    }
                     
                }
                this.lastmessage=last;
            }
            else{
                this.showmore=true;
            }
            var that=this;
         
			this.$store.commit('chat/clearunread', this.storeKey);  
              //  //创建后调用回到底部方法 
			},
            sending(val){
              
              if(val!=false) {
                  this.scrollToBottom();   
              }
            }
		}
      
	}
</script>

<style lang="scss" scoped>
    
	$redpackBgColor: #EF9638;

	$reverseTextBgColor: #3388ff;


	$voiceBgColor: #fafafa;
	$voiceColor: #000;
	$reverseVoiceBgColor: #3388ff;
	$reverseVoiceColor: #fff;
    .chat-detail {
    	width:100%;
       padding: 0px 0px;
      position: fixed;
       z-index: 1;
       left: 0px;
       bottom:60px;
       width: 100%;
       
       
    }
    .unread{
        position: fixed;
        z-index: 999s;
        right:5px;
        bottom: 75px;
        height: 25px;
        line-height: 25px;
        padding: 0px 10px;
        border-radius: 10px;
        background-color: #eee;
        color: #333;
        font-size: 14px;
        clear: both;
    }
    .unread .num{
        color: #FF0000;
        padding: 0px 2px;
        display: inline-block;
        font-weight: 600;
    }
    .self_bottom{
        height: 10px;display: block;clear: both;
     
        margin-top: 10px;
    }
    .nodata{
        height:30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #ccc;
    }
    .vedioplay{
        position: fixed;
        z-index: 9999999999;
        background-color: #000;
        top:0px;
        width: 100%;
        left: 0px;
        height: 100vh;
        line-height: calc(100vh - 45px);
        
        vertical-align: middle;
        display: table-cell;
    }
    .vedioplay  video{
        vertical-align: middle;
        width: 100%;
        display: inline-block;
        
    }
    
    .vedioplay .bottom{
        
        position: absolute;
        z-index: 999;
        bottom: 10px;
        left: 0px;;
        width: 100%;
        height: 50px;
        line-height: 50px;
        color:#fff;
        text-align: center;
    }
    .vedioplay .bottom .icon1{
        font-size: 36px !important;
        color: #eee !important;
    }
    



    
 .vedio{
    display: inline-block;
    float: left;
    width:calc(100% - 200upx);
    border-radius: 10upx;
     padding-top:0upx;
     padding-bottom: 0upx;
     overflow: hidden;
     position:relative;

     z-index: 0;
 } 
    .vedio .timeshow{
        position: absolute;
        right:12upx;
        bottom:16upx;
        font-size: 24upx;
        color: #FFFFFF;
        z-index: 999999999;
    }
    
    .vedio .play_btn{
        position: absolute;
        height: 80upx;
         width: 80upx;
         left: calc(50% - 40upx);
         top:calc(50% - 40upx);
        z-index: 999999999;
    }
.vedio_src{
    max-width: 100%;
    border-radius: 10upx;
     max-height: 70vw;
    z-index: 0 !important;
}
.touch_menu{
        position: fixed;
        z-index: 9999;
        background-color: rgba(0,0,0,0.8);
        border: 1px #000 solid;
        border-radius: 10px;
        padding: 0px 10px;
        line-height: 30px;
        max-width: 100%;
        
        font-size: 14px;
        min-height: 40px;
    }
.touch_menu view{
        height: 45px;
        line-height: 45px;
        color: #fff;
        display: inline-block;
        padding: 0px 10px;
        text-align: center;
       border-right:1px #999 solid;
    }
    .touch_menu view:last-child{
        border-width: 0px;;
    }
    .touch_menu.right view{
        padding: 0px 15px;
    }
       .touch_menu::before{
            display: block;
            content: " ";
            position: absolute;
         
            
            width: 0;
            height: 0;
            border-style: solid;
      
    }
 .touch_menu.top::before
    {
          top: -12px;
              
          border-width: 0px 12px 12px 12px;
          border-color: #000 transparent; 
    }
     .touch_menu.bottom::before
     {
        
       bottom: -24px;
 border-width:12px ;
 border-color:#000 transparent transparent transparent;
     }
      .touch_menu.left{
          text-align: left;
          left:3px;
      }
      .touch_menu.right{
          text-align: right;
          right:20px;
      }
  .touch_menu.left::before
     {
           left: 70px;
 
     }
  .touch_menu.right::before
      {
         
         right:50px;
         
      }



	.first {
		width: 2px;
		height: 2px;
		background: #fff;
		top: 22px;
		left: 22px;
	}

	.second {
		width: 12px;
		height: 12px;
		top: 17px;
		left: 17px;
	}

	.third {
		width: 20px;
		height: 20px;
		top: 12px;
		left: 12px;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/**/
	.loading {
		//loading动画
		display: flex;
		justify-content: center;

		@keyframes stretchdelay {

			0%,
			40%,
			100% {
				transform: scaleY(0.6);
			}

			20% {
				transform: scaleY(1.0);
			}
		}

		.spinner {
			margin: 20upx 0;
			width: 60upx;
			height: 25px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			view {
				background-color: #ff9800;
				height: 25px;
				width: 3px;
				border-radius: 3px;
				animation: stretchdelay 1.2s infinite ease-in-out;
			}

			.rect2 {
				animation-delay: -1.1s;
			}

			.rect3 {
				animation-delay: -1.0s;
			}

			.rect4 {
				animation-delay: -0.9s;
			}

			.rect5 {
				animation-delay: -0.8s;
			}
		}
	}

	image {
		will-change: transform;
	}



    .loadingbox{
        height: 80upx;
        width: 70upx;
        justify-content: center;
        line-height: 80upx;
        display: inline-block;
        text-align: center;
        vertical-align: top;
    }
    .loadingbox image{
        height:36upx;
        width: 36upx;
        vertical-align: middle;
    }
</style>

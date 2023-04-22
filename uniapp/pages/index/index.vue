<!-- 聊天 -->
<template>
	<view class="page page--divider">
	<headerline   navstyle="left:18%;width:60%;" :reditem="unreadnum" issearch="true" :showsearch="showsearch" searchtips="请输入搜索内容"  @clicksearch='clicksearch' :shownav="false"  :title="navtitle" :menuitem="menuitem" :navselect="navselect" :statusbarheight='statusBarHeight'   :islogo="false"  @tapnav="tapnav"    @tapmenu="tapmenu" rightmenu="true"></headerline>
		
		<view class="widget" v-if="navselect==0  && !showsearch">
			<scroll-view  v-if="chats.length>0"  refresher-enabled='true' refresher-threshold='60' :refresher-triggered="isfresh" :refresher-default-style='refreshstyle' @refresherpulling='refresherpulling'  @refresherrefresh='refresherrefresh'>
                  <view class="fresh" v-if="isfresh==true">
                      {{fresh_tip}}
                  </view>
				<view :class="{'item':true,'istop':item.istop}" v-for="(item, index) in chats" :key="item.key"
                 @tap="handleClick(item)" @longtap="msgAction(item)">
                   
					<image :src="image_cache(item.avatar)" class="leftImg" />
					<view class="rightContent">
						<view class="topCont"> 
							<view class="userName">{{item.nickname||'匿名'}}</view>
							<view class="time">{{ timestamp(item.timestamp) || '--:--' }}</view>
						</view>
						<view class="bottomCont">
							<view class="content" v-if="item.message.type!='tips'">
                                <block v-if="item.self || item.sender.nickname!=undefined">
                                {{item.self? '[我]': item.sender.nickname+':'}}
                                </block>
								<text style='color: #666666;font-size: 28upx' v-if="item.message.type=='voice'">[语音]</text>
								<text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='redpacket'">[红包]</text>
								<text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='image'">[图片]</text>
                                 <text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='vedio'">[视频]</text>
								<text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='emotion'">[表情]</text>
                                <text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='apply'">{{item.message.content.text}}</text>
                                    <text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='tips'">
                                    <block v-if="item.message.content.type=='time'">
                                         {{item.message.content.text}}
                                        
                                    </block>
                                    <block v-else>
                                {{item.message.content}}                                        
                                    </block>
                                   
                                    
                                    </text>
								
                                
                                <text style='color: #666666;font-size: 28upx' v-else-if="item.message.type=='text'">

								<text v-if="item.message.content.type!='emotion' ">
								
								<block v-if="item.message.content.type=='remind' && toText(item.message.content.content).indexOf('@我')>-1 ">
                                <text style="color:#1d830a"> {{item.message.content.type=="remind"?toText(item.message.content.content):toText(item.message.content)  }}</text>
                                </block>
                                <block v-else>
                                     {{item.message.content.type=="remind"?toText(item.message.content.content):toText(item.message.content)  }}
                                </block>
                               
								</text>
								<text v-if="item.message.content.type=='emotion' ">
								{{item.message.content.content}}
								</text>
								
								</text>
								<text  style='color: #999999;font-size: 28upx'  v-else-if="item.message.msg_type=='show'">
                                  {{item.message.content.text}}  
                                </text>
							</view>
                            <view class="content" v-else>
                                <text  style='color: #999999;font-size: 28upx'  >
                               <block v-if="item.message.content.type=='time'">
                                        {{item.message.content.text}}
                                       
                                   </block>
                                   <block v-else>
                               {{item.message.content}}                                        
                                   </block>
                                  
                                </text>
                            </view>
							<view class="badge" v-if="item.unread && item.unread>99" style="width: auto;padding: 0 5px;">99+</view>
							<view class="badge" v-if="item.unread && item.unread<=99">{{item.unread}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
            <view v-else class="nodata" >
                您还没有任何消息
            </view>
		</view>
        
      
	</view>
</template>

<script>

	import scode from "../../library/scode.js"
	import api from "../../library/index.js"
    import chat from "../../library/chat.js"
    	import http from "../../library/http.js"
	import message from "../../library/message.js"
    	import action from "../../library/action.js"
        import headerline from '../../components/header.vue'
              
            var windowHeight= uni.getSystemInfoSync().windowHeight;	
            var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
            var contenttop=statusBarHeight+45;
            var conentheight=windowHeight-contenttop;
            var lottHeight= conentheight-30;
            var lottTop= contenttop + 30;
	export default {
		components: {
            headerline,
           
		},
		data() {
			return {
                statusBarHeight: statusBarHeight+ 'px',
                contenttop:contenttop+'px',
                contentheight:conentheight+'px',
                 lottHeight:lottHeight+'px',
                 lottTop:lottTop+'px',
                 shownav:false,
                 // navtitle:'消息',
                 navselect:0,
                 menuitem:[],
				newfriendNotify: false,
				showMenu: false,
                newfriendnum:0,
                clickkey:false,
                reading_id:-1,
				actions: [],
                user:uni.getStorageSync('userInfo'),
                showsearch:false,
                friends:uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata'),
                pinyin:[],
                char_select:false,
                kefunum:0,
                unreadnum:[0,0,0],
                refreshstyle:'none',
                isfresh:false,
                fresh_tip:'下拉刷新'
			}
		},
		computed: {
		chats(){
          var res  = this.$store.getters['chat/msglist'];
          return res;
        },
        navtitle(){
          var num=0;
             var msg_list=this.$store.getters['chat/msglist'];
            msg_list.map(item=>{
            
              num+=parseInt(item.unread)
            })
            if(num==0) return '消息';else return '消息('+num+')'
        }
     
		},
        watch:{
          chats(val){
              var num=0;
               for(var i=0;i<val.length;i++){
                  num+=val[i].unread;              
              }
          
              this.unreadnum.splice(0,3);
              this.unreadnum.push(num);
               this.unreadnum.push(0);
                this.unreadnum.push(0);
                 this.$forceUpdate();
          }  
        },
	  
      
		methods: {
            refresherpulling(){
         
              this.refreshstyle='none';
             this.isfresh=true;
             this.fresh_tip='下拉刷新...';
             
            },
            refresherrefresh(){
             
               this.refreshstyle='black';
               this.fresh_tip='正在刷新...';
               this.lastchat();
       
            },
            href(path,opts){
              
               if(!opts || opts==undefined  || opts == null) opts={}; 
                this.$jump(path,opts);
                
            },
            open_detail(item){
            
                 this.$jump('friend.detail',{id:item.id});
            },
            toText(str) {
                str=str.toString()
                    str=str.replace(/&nbsp;/g," ");
                    str=str.replace(/<br>/g," ");
                   str= str.replace(/<[^<>]+>/g,'')
                    return str;
                },
            timestamp(time){
              // return  action.timestampFormat(new Date(time.replace(/(-|年|月)/g, '/').replace('日', '')).getTime()/1000)
          return action.timestampFormat(time)
            },
		
            tapnav(num){
              this.navselect=num;  
              if(num==1) this.friendlist();
              else this.lastchat();
            },
            clicksearch(e){
              this.showsearch=e;  
            },
            go_search(e){
                http.setWait(true).get('user.php?act=searchUser',{keywords:e}).then(res=>{
                   if(res.data.length>0){
                       var id=res.data[0].id;
                       uni.navigateTo({
                           url:'../friend/detail?id='+id+'&from='+res.data[0].from
                       })
                       
                   }else{
                       uni.showToast({
                           icon:'none',
                           title:'没有搜索到相关用户',
                           duration:1500
                       })
                   }
                })
              
            },
            tapmenu(num){
             
                if(this.$action.loginTips('未登录用户，无法完成此操作','/pages/game/index') ==false) return false;
                 if(this.$action.check_userlock()==false) return false;
               
              if(num==0){
                    
                      if(this.user.nickname=='' || this.user.nickname==this.user.name){
                        this.$action.profileTips('未设置昵称，不能创建群','/pages/group/create')   ;
                       return false;
                      }
                      else
                    this.$jump('group.create');
                 }
                 else if(num==1){
                       this.$jump('group.list',{method:0});
                 }
                 else if(num==2){
                       this.$jump('group.list',{method:1});
                 }
                 else if(num==3){
                       this.$jump('mine.note');
                 }
                 else if(num==4){
                     return uni.scanCode({
                     	success(res) {
                     		scode.getScode(res)
                     	},
                     	fail(e) {
                     		console.log(JSON.stringify(e));
                     		console.log('扫码失败')
                     	}
                     }); 
                 }
            },
            group_read(group_id){
                
                http.setWait(false).post('group.php?act=setReadTime',{group_id:group_id,userid:this.user.id}).then(res=>{
                  
                     this.lastchat();  
                })
                
            },
            user_read(userid){
               
             
                http.setWait(false).post('group.php?act=setReadTime',{group_id:0,userid:this.userid,sendid:this.user.id}).then(res=>{
                     this.lastchat();  
                })
                
            },
			handleClick(info) {
                
               
               if(info.unread>0) this.$store.commit('chat/clearunread', info.cache_key);  
            
               if(this.clickkey==info.cache_key) return false;
               
               this.clickkey=info.cache_key;
               if(info.cache_key=="U1"){
                   
                 	return this.$jump('friend.request?type='+info.sender.id);
               }
               
               else{
                   if (info.cache_key.indexOf('U')>-1) {
                   	let friend = {
                   		id: info.id,
                   		nickname: info.nickname
                   	}
                      //this.user_read(info.id);
                   	return this.$jump('friend.chat', friend);
                   }
                   else{
                       if(info.message.content.type=='remind' && this.toText(info.message.content.content).indexOf('@我')>-1)
                        var atme=1;
                        else var atme=0;
                       // this.group_read(info.id);
                       this.$jump('group.chat', {
                       	id: info.id,
                       	nickname: info.nickname,
                        atme:atme,
                        msg_id:info.msg_id
                       });
                   }
                  
               }
				
			},
	
            msgtopChanage(istop,cache_key){
              istop=!istop
           
                 var msgtop =  uni.getStorageSync('msgtop')?uni.getStorageSync('msgtop'):[];
               if(istop){
                   msgtop.push(cache_key)
               }else{
                   for (var i = 0; i < msgtop.length; i++) {
                      if(msgtop[i]==cache_key) {
                        msgtop.splice(i,1)
                      }
                   }
               }
            
               uni.setStorageSync('msgtop',msgtop);
               this.$store.commit('chat/set_istop');
                var  data = {cache_key:cache_key,userid: this.user.id,istop:istop};
                                 
                       http.setWait(false).get('group.php?act=set_msgtop',data).then(res=>{
                            
                           })
                
            },
            msgAction(msg){
                
 
                   var user_id=uni.getStorageSync('access_token');
                   // console.log(msg);
                   let that=this;
                   var itemList=[];
                   if(msg.istop<1) itemList.push('置顶');
                   else itemList.push('取消置顶');
                   if(msg.unread>0) itemList.push('标记已读');
                   else itemList.push('标记未读');
                    itemList.push('删除会话')
                   uni.showActionSheet({
                   	itemList:itemList,
                   	success: function (res) {
                   		switch (res.tapIndex){
                   			case 2:

                            that.delete_msg(msg.cache_key)
                   				break;
                   			case 0:
                          that.msgtopChanage(msg.istop,msg.cache_key)
                              // console.log(msg.cache_key)
                   				break;
                                case 1:
                                  that.$store.commit('chat/set_read',msg);
                                break;
                   			default:
                   				break;
                   		}
                   },
                   	fail: function (res) {
                   		//console.log(res.errMsg);
                   	}
                   });
                   
                   
                              
            },
            lastchat(){
                var userid=parseInt(uni.getStorageSync('access_token'));
                var postdata={userid:userid,reading_id:this.reading_id};
                var msg_list_key=userid+'_chat_msglist';
              var  temp1=[];
              var  temp2=[];
                
              http.setWait(false).get('group.php?act=lastchat',postdata).then(res=>{
               var data=res.data;
               var msglist=[];
            
               for(var i=0;i<data.length;i++){
                     
                   var item=data[i];
                 //  console.log(item)
//           console.log(item.cache_key,item.unread,this.timestamp(item.readtime))
                   var result={};
                    result['key']=userid+'_chat_'+item['cache_key'];
                   var msg={};
                     msg['id']=item.group.id;
                     msg['cache_key']=item['cache_key'];
                     msg['group_id']=item.group.id;
                     msg['nickname']=item.group['nickname'];
                    // msg['kefu']=item.group.kefu
                    msg['avatar']=item.group['avatar'];
                    msg['isloading']=1;
                    msg['istop']=item.istop;
                    msg['msg_id']=item.id;
                     msg['timestamp']=item.addtime;
                     if(parseInt(item.userid)==userid) msg['self']=1;
                     else msg['self']=0;
                     msg['none']=false;
                     msg['sender_id']=item.userid;
                     
                     msg['message']={'type':item.type,'content':item.content};
                     msg['unread']=parseInt(item.unread);
                     msg['readtime']=item.readtime;
                     if(item.groupid==1){
                         msg['sender']={'nickname':item.sender_name,id:item.reqtype}
                     }
                     else   msg['sender']={'nickname':item.sender_name};
                     result['msg']=msg;
              
                     if(msg.istop)temp1.push(result)
                     else temp2.push(result)
               }
               
                 temp1.sort((a, b) =>b.timestamp - a.timestamp);
                temp2.sort((a, b) => b.timestamp - a.timestamp);
                msglist=temp1.concat(temp2);
        
                 this.update_msglist(msglist);
           
                var that=this;
                this.fresh_tip='刷新成功'
                  this.refreshstyle='none';
                setTimeout(function(){   that.isfresh=false;},500)
         
              })  
            },
            
            
            setrightmenu(){
                var action=[
               
                    {
                    	title: '新建群组',
                    	icon: 'plus'
                    },
                    {
                    	title: '创建的群',
                    	icon: 'personadd'
                    },
                    {
                    	title: '加入的群',
                    	icon: 'person'
                    },
                   
                     // #ifdef APP-PLUS
                     {
                     	title: '通知设置',
                     	icon: 'gear'
                     },
                    {
                    	title: '扫一扫',
                    	icon: 'scan'
                    },
                     // #endif 
                ]
              this.menuitem=action;
            },
            fresh_msg(){
                 var msglist=uni.getStorageSync(uni.getStorageSync('access_token') + '_chat_msglist');
                this.update_msglist(msglist);
                this.$action.setStatusTips();
            },
          
		},
        created() {
            uni.$on('toChat',message=>{
                //console.log('index')
            this.$action.toChat(message);
            })
        },
		onShow() {
         this.unreadnum[0]=this.$action.setStatusTips()
            this.clickkey=false
             uni.setStorageSync('cache_key','');
                  uni.hideKeyboard();
 var userid=parseInt(uni.getStorageSync('access_token'));
     if(userid>0) {
        this.lastchat();
      
        this.$action.setStatusTips();
           if(uni.getStorageSync('ispush')==true){
              
           var message=uni.getStorageSync('pushmessage');
                this.$action.toChat(message);
              uni.setStorageSync('ispush',false)
              }
        
     }else{
     
         uni.setStorageSync('gourl','/pages/index/index');
        
         this.$jump('login.index');
     }
     

		},
        onLoad(){
          
            var userid=parseInt(uni.getStorageSync('access_token'));
                if(userid>0){
                     var that=this;
                    this.$socket.on('chat', (res) => {
                          setTimeout(function(){
                              that.fresh_msg();
                          },100)
                     })
                       that.setrightmenu();
                     setTimeout(function(){
                       
                             api.getMyGroup({userid:userid}).then(res => {
                                // console.log(res.data)
                             	uni.setStorageSync(userid+'_groups',res.data)
                             })
                             
                                                
                             api.getMyFriend({userid:userid}).then(resss => {
                                 uni.setStorageSync(userid+'_frienddata',resss.data);
                             })   
                     },3000)
                    
                }
        
        }
	}
    
  
</script>

<style lang="scss">

    .fresh{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        color: #666;
    }
    .btn_yellow{
        background-color: yellow;
        color: #000;
        font-size: 12px;
        display: inline-block;
        height:18px;
        line-height: 18px;
        padding: 0px 5px;
        border-radius: 5px;
        text-align: center;
         margin: 0px 2px;
    }
    .btn_green{
        background-color: #0aad6c;
        color: #fff;font-size: 12px;
        display: inline-block;
        height: 18px;
        line-height: 18px;
        padding: 0px 5px;
        border-radius: 5px;
        text-align: center;
    
        margin: 0px 2px;
    }
    .btn_blue{
        background-color: #2319dc;
        color: #fff;font-size: 12px;
        display: inline-block;
        height: 18px;
        line-height: 18px;
        padding: 0px 5px;
        border-radius: 5px;
        text-align: center;
     margin: 0px 2px;
    }
    
    .btn_grey{
        background-color: #ddd;
        color: #000;font-size: 12px;
        display: inline-block;
        height: 18px;
        line-height: 18px;
        padding: 0px 5px;
        border-radius: 5px;
        text-align: center;
         margin: 0px 2px;
    }
    .nodata{
        height: 35px;
        line-height: 35px;
        color: #666;
        font-size: 12px;
        text-align: center;
    }
  
	.item {
        height: 120upx;
		
		overflow: hidden;
		padding:0px 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
        margin-top: 5px;
   
	}
    .item:hover{
        background-color: #eee;
    }

	.leftImg {
		width: 100upx;
		height: 100upx;
		margin-right: $uni-spacing-row-base;
		border-radius: $uni-border-radius-base;
		display: flex;
		flex-flow: wrap;
		justify-content: center;
		background-color: #eee;
		align-items: center;

		&:not(image) {
			padding: 1upx;
		}

		view,
		image {
			width: (76upx-2upx*4)/3;
			height: (76upx-2upx*4)/3;
			margin: 1upx;
		}
	}

	.rightContent {
		flex: 1;
        border-bottom: 1px solid #fbfbfb;
	}

	.rightContent,
	.topCont {
		overflow: hidden;
		line-height:50upx;
	}

	.topCont {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
        vertical-align: top;
	}

	.userName {
		color: $uni-text-color;
		font-size: 32upx;
	}

	.time {
		color: #999999;
		font-size: 24upx;
	}

	.bottomCont {
		width: 100%;
		font-size: 24upx;
		color: #999999;

		display: flex;
		align-items: center;
		justify-content: space-between;
        flex-direction: row;
	}

	.content {
        font-size: 28upx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-direction: row;
    max-width:100%;
	}
.content text{
   white-space: nowrap;
   text-overflow: ellipsis;
   overflow: hidden;
   word-break: break-all; 
      max-width:100%;
}
	.badge {
		background-color: red;
		color: #fff;
		border-radius: 40upx;
		line-height: 40upx;
		width: 40upx;
		height: 40upx;
		font-size: 24upx;
		text-align: center;
		flex-shrink: 0;
	}
</style>

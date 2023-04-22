<template>
	<view class="page page--divider">
		<view style="display: none;">{{$store.state.hackUpdate}}</view>
		<load-more status="loading" v-if="initializing" />
		<chat-panel :store-key="storeKey" :thistype="thistype" :atme="atme" :at_msg_id='at_msg_id'  @close='atuser1' :sending="sending" :sendingdata="sendingdata" :manager="ismanage" :no_add="no_add" @click-avatar="openProfile" @setSending='setSending' :boardheight='boardheight' ref="panel"  />
		<view class="placeholder"></view>
		<v-sender ref='sender' v-if="!initializing" v-model="message" @send="sendTextMessage" :groupid="group.id" :isgroup="1"
		 @face="sendVoice" @sendImage="sendImg"   @sendVedio="sendVedio" @emoji="sendEmoji" :no-speaking="no_speaking"  :speaking_tips='speaking_tips'
		 :forbid-redpack="group.forbid_redpack==1 && !group.owner && !ismanage?true:false" @handleEmotion="handleEmotion" @input="inputMessage"
          @keyboardheight='keyboardheight' @senderheight="set_sheight" :sendtype='type'/>
<GroupUser ref='groupuser' :groupid='group.id' :show='groupshow' @atuser='atuser'></GroupUser>
	</view>
    
</template>

<script>
    import GroupUser from '../../components/GroupUser.vue';
	import ChatPanel from '../../components/chat-panel.vue'
    import chat from "../../library/chat.js"
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import api from "../../library/index.js"
	import config from "../../config.js"

	export default {
		components: {
			ChatPanel,
            GroupUser
		},
		data() {
			return {
                userid:uni.getStorageSync('access_token'),
                user:uni.getStorageSync('userInfo'),
                
				group: {},
				message: '',
				initializing: false,
				showPickMoney: '',
				getPick: '',
				pickErrorText: '',
				redpackInfo: {},
				sending: false,
                sendingdata:{},
                ismanage:false,
                no_speaking:false,
                no_add:false,
                sender:[],
                receiver:[],
                boardheight:0,
                groupshow:0,
                oldstr:'',
                atusers:{},
                type:'',
                speaking_tips:'',
                atme:0,
                at_msg_id:0,
                thistype:'',
                storeKey:''
              
			};
		},
		onLoad(opts) {
         //   console.log(opts);
             if(opts.atme>0) this.atme=opts.atme
                 if(opts.msg_id>0) this.at_msg_id=opts.msg_id
               
            uni.setNavigationBarTitle({
            	title: decodeURI(opts.nickname)
            })
            
			this.group = opts;
           
            this.group.id=parseInt(this.group.id);
			this.storeKey = 'G' + this.group.id;
         
            uni.setStorageSync('cache_key',this.storeKey);
            this.joingroup();
           // console.log(opts);
			
			
            this.$socket.on('group_update',(res)=>{
           this.getInfo();
           this.getGroupUsers();
                
            })
         this.sender=uni.getStorageSync('userInfo');
         // #ifdef APP-PLUS
         let currentWebview = this.$mp.page.$getAppWebview();  
         currentWebview.setStyle({  
         titleNView: {  
         titleText:''  
         },  
         })  
         // #endif
		},
        
       onUnload() {
          
              uni.setStorageSync('cache_key',''); 
       },
   
		onShow() {
             
		this.getInfo();
        this.getGroupUsers();
   
		},
		methods: {
	
            
         // 检测输入值
         inputMessage(e) {
            // console.log(e);
             //console.log(this.oldstr,e);
             if(e.substr(e.length-1,1)=='@' && this.oldstr!=e && e.length>0  && e.length > this.oldstr.length ){
             this.groupshow=1;  
               uni.hideKeyboard();  
             } 
            else {
                 this.groupshow=0;   
            }
            
            
         this.oldstr=e;
             
             this.emotion = e;
         },
         
         atuser(e){
            
            this.groupshow=0;
           if(e.nickname) {
            this.$refs.sender.setinputvalue(e.nickname);
            this.atusers=e;
           }
         },
         
         atuser1(e){
       console.log(e);
           if(e.nickname) {
               
            this.$refs.sender.setinputvalue('@'+e.nickname);
            this.atusers=e;
            
           }
         },
         
         set_sheight(e){
             
           this.$refs.panel.setAutoHeight(e); 
         },
         keyboardheight(e){
             this.boardheight=e;
             
           this.$refs.panel.setAutoHeight(0);
         },
         
       
         setSending(e){
          
         this.sending=e;
             
         },
         group_init(id){
             
              var group= uni.getStorageSync('group_'+id);
              if(group.id>0 && group.id==id) this.group_set(group);
         },
         
          group_set(group){
              this.group=group;
              if(group.deny_id==null) group.deny_id='';
              if(group.manager_id==null) group.manager_id='';
               if(this.user.status==1 || (this.user.status==2 && parseInt(this.user.lock_time)>= Date.parse(new Date())/1000)){
                   this.no_speaking=true;
                   this.speaking_tips='您的账号已被冻结';
               }
               else if((group.no_speaking==1)&& !group.owner && group.manager_id.indexOf(this.userid)<=-1){
                   this.no_speaking=true;
                   this.speaking_tips='全体禁言,限群主和管理员可发消息';
               }
               else if(( group.deny_id.indexOf(this.userid)>-1)&& !group.owner && group.manager_id.indexOf(this.userid)<=-1){
                   this.no_speaking=true;
                   this.speaking_tips='您已被禁言';
               }
               else {
                   this.no_speaking=false;
               }
             
         
                     if(group.manager_id.indexOf(this.userid)>-1 || group.owner) this.ismanage=true;
                     else this.ismanage=false;
                     if(group.is_owner==1) var type='owner';
                     else if(group.is_manager==1) var type='manager';
                     else var type='user';
                     this.thistype=type;
                    
                     
                 //    console.log(this.group);
              if((group.no_add==1 )&& this.ismanage==false)
               this.no_add=true;
               else this.no_add=false;      
                     
              	uni.setNavigationBarTitle({
              		title: `${group.name}(${group.people_count}人)`
              	})
              
              uni.setStorageSync('group_'+group.id,group);
          },
         
         
         
       getInfo() {
         if(this.group.id>0){
             
            this.group_init(this.group.id);
            api.getGroupInfo({
            	group_id: this.group.id,
                from_id: this.userid,
            }).then(res => {
                  this.group_set(res.data);
            }) 
             
         }
          
       },
         
			handleEmotion(value) {
			  //console.log(value);
			    this.emotion = value;
			    this.type = 'emotion';
			},
            joingroup(){
                let data = {
                  GroupId: this.group.id,
                  type:'joinGroup'
                }
                 this.getGroupUsers() 
                this.$socket.send(data);  
            },
		getGroupUsers() {
 
			api.getGroupUsers({
				group_id: this.group.id,
                userid: this.userid,
			}).then(res => {

		       uni.setStorageSync(this.group.id+'_group_members',res.data);
			
			})
		},
		toHtml(str) {
		        str=str.replace(/ /g,"&nbsp;");
		        str=str.replace(/\n/g,"<br>");
		        return str;
		    },
			sendImg(e) {
				this.commitMessage('image', e);
			},
            sendVedio(e){
                
            	this.commitMessage('vedio',e);
            },
			// 发送文本消息
			sendTextMessage() {
				this.emotionInfo = {
				    "type": "emotion",
				    "value": this.emotion,
				    "content": this.emotion
				}
				if (this.type == "emotion") {
				    this.commitMessage('emotion', this.emotionInfo);
				} else {
                    var msg=this.toHtml(this.message); 
				    this.commitMessage('text', msg);
				}
				

				// this.commitMessage('text', this.message);
			},
			commitMessage(type, sendData) {
              
          
           this.message = '';
                if(type=='image'){
                    var mid=sendData.mid;
                    sendData=sendData.src;
                   
                }
                else if( type=='vedio'){
                    var mid=sendData.mid;
                  //  sendData=sendData.src;
                   
                }else if(type=='voice'){
                    var mid=sendData.mid;
                }else{
                   var mid='m' + Math.random().toString(36).substring(2); 
                }
                var atuser=0;
               
                if(type=='text' && parseInt(this.atusers.id)>0){
   
                    if(sendData.indexOf(this.atusers.nickname)>-1){
                     
                      var content=sendData.replace('@'+this.atusers.nickname,'@{'+this.atusers.id+'}');
                     sendData={
                         type:'remind',
                         remind:this.atusers,
                         content:content
                     }
                    
                   this.oldstr='';
                   this.atusers={};
                    }

                }
                if(type=='text' && sendData=='') return false;
                              
				let data = {
                    userid:this.userid,
					group_id: this.group.id,
                    type:'group',
					msgtype: type,
					content: sendData,
                    mid:mid
				}
	        
                var sendlocal=0;
          
               if((type=='image' && sendData.indexOf(config.imgUri)<=-1) || (type=='vedio' && sendData.src.indexOf(config.imgUri)<=-1) || (type=='voice'&& sendData.url.indexOf(config.imgUri)<=-1) ){
                   
                  sendlocal=1;
               }
                else {

                   this.$socket.send(data);   
                }
                this.type='text';
                 if(type!=='image' && type!=='voice')  sendlocal=1;
				
                var that=this;
                 if(sendlocal==1){
             
                     
           //    setTimeout(function(){
                     var arr={};
                      arr.id=that.group.id;
                      arr.cache_key='G'+arr.id;
                      arr['self']=1;
                      arr['isloading']=1;
                      arr['receiver_id']=0
                      arr['sender_id']=that.sender.id;
                      arr['group_id']=that.group.id;
                      arr['timestamp']=parseInt(new Date().getTime()/1000);
                      arr['time']='';
                      arr['message']={type:type,content:sendData}
                      arr['sender']=that.sender;
                      arr['receiver']=that.group;           
                      arr['nickname']=that.sender.nickname; 
                      arr['avatar']=that.sender.avatar;
                      arr['msg_id']='';
                      arr['_mid'] = mid;
                         // that.$refs.panel.sendmsg({ data:arr});
                       that.sendingdata=arr;
                       that.sending=true;
                 //   console.log(arr)
                     // that.sendmsg(arr);
                 //  },20,that,mid)

                 }
                
			},
			sendVoice(e) {
	
                this.commitMessage('voice', e);
	
			},
			sendEmoji(e) {
				this.commitMessage('face', e)
			},
			openProfile(e) {
				let params = {
					id: e.id,
					status: 'friend'
				};
				return this.$jump('friend.detail', params)
			}
		},
		onNavigationBarButtonTap() {
   this.$refs.panel.endVedio();
			this.$jump('group.detail', {id:this.group.id,'from':'chat'});
         
		}
     
	}
</script>

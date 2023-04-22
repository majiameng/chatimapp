<template>
    <view class="page" ref="page">
        <view style="display: none;position: fixed;left: 50%;top: 50%;">{{ $store.state.hackUpdate }}</view>
        <load-more status="loading" v-if="initializing" />

        <chat-panel :storeKey="storeKey" :sending="sending" :sendingdata="sendingdata" @click-avatar="openProfile" @setSending="setSending" :boardheight="boardheight" ref="panel" />
        <v-sender
            v-if="!initializing"
            v-model="message"
            @send="sendTextMessage"
            @face="sendVoice"
            @sendImage="sendImg"
            @sendVedio="sendVedio"
            @emoji="sendEmoji"
            @input="inputMessage"
            @handleEmotion="handleEmotion"
            @senderheight="set_sheight"
            @keyboardheight="keyboardheight"
            :showboard="showboard"
            :sendtype="type"
            :isgroup="0"
            :groupid="friend.id"
        />
    </view>
</template>


<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
import ChatPanel from '../../components/chat-panel.vue';
import api from '../../library/index.js';
import http from '../../library/http.js';
import config from '../../config.js';

export default {
    components: {
        ChatPanel
    },
    data() {
        return {
            friend: {},
            message: '',
            initializing: false,
            getPick: false,
            showPickMoney: '',
            pickMsg: '',
            pickId: '',
            pickSender: {},
            pickTitle: '',
            pickErrorText: '',
            storeKey: '',
            redpackInfo: {},
            sending: false,
            sendingdata:[],
            senderheight: 120,
            sender: [],
            receiver: [],
            inpuvalue: '',
            boardheight: 0,
            showboard: false,
            type: '',
            user:uni.getStorageSync('userInfo'),
            system:uni.getStorageSync('system'),
            
        };
    },
    onShow(event) {
        uni.setNavigationBarTitle({
            title: decodeURI(this.friend.nickname)
        });
 
             
  
    },

    onLoad(opts) {
    
            uni.setNavigationBarTitle({
                title: decodeURI(opts.nickname)
            });
                         // #ifdef APP-PLUS  
                         let currentWebview = this.$mp.page.$getAppWebview();  
                         currentWebview.setStyle({  
                         titleNView: {  
                         titleText:''  
                         },  
                         })  
                         // #endif

        this.friend = opts;

        this.storeKey = 'U' + this.friend.id;
         uni.setStorageSync('cache_key',this.storeKey);
        
        this.getUserInfo(this.friend.id);
        this.sender =this.user;
        this.receiver = this.friend;
        
    },
    onUnload() {
       
           uni.setStorageSync('cache_key',''); 
    },
       

    methods: {
        // 检测输入值
        inputMessage(e) {
            //  console.log(e);
            this.emotion = e;
        },
        getUserInfo(id) {
            if(id>0){
                
               id = parseInt(id);
             http.setWait(false).get('user.php?act=userdetail',{id:id,group_id:0,userid:this.user.id}).then(res=>{
                 this.friend = res.data;
                 uni.setNavigationBarTitle({
                     title: decodeURI(this.friend.nickname)
                 });
                 
             })
             
              
            }else{
                var avatar=this.system.admin_logo;
                if(avatar.indexOf('http')<=-1) avatar=config.imgUri+avatar;
                  this.friend={id:0,nickname:this.system.admin_nickname,avatar:avatar};
          
            }
           
        },
        toHtml(str) {
                str=str.replace(/ /g,"&nbsp;");
                str=str.replace(/\n/g,"<br>");
                return str;
            },
        set_sheight(e) {
             this.$refs.panel.setAutoHeight(e); 
        },
        keyboardheight(e) {
            this.boardheight = e;

            this.$refs.panel.setAutoHeight(0);
        },

        // 选择表情
        handleEmotion(value) {
            //  console.log(value);
            this.emotion = value;
            this.type = 'emotion';
        },
        sendEmoji(e) {
            this.commitMessage('face', e);
        },
        sendImg(e) {
            this.commitMessage('image', e);
        },
        sendVedio(e) {
            this.commitMessage('vedio', e);
        },
       
        // 发送文本消息
        sendTextMessage() {
            // this.commitMessage('text',this.message);
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
        },

       setSending(e){
        
       this.sending=e;
           
       },

        commitMessage(type, sendData) {
            this.message = '';
            //   this.showboard=true

            if (type == 'image') {
                var mid = sendData.mid;
                sendData = sendData.src;
            } else if (type == 'vedio') {
                var mid = sendData.mid;
                //  sendData=sendData.src;
            } else if (type == 'voice') {
                var mid = sendData.mid;
            } else {
                var mid =
                    'm' +
                    Math.random()
                        .toString(36)
                        .substring(2);
            }

            let data = {
                userid: this.user.id,
                friend_uid: this.friend.id,
                type: 'chat',
                msgtype: type,
                content: sendData,
                mid: mid
            };
       //    console.log(data);
         
         var sendlocal=0;
         if((type=='image' && sendData.indexOf('http')<=-1) || (type=='vedio' && sendData.src.indexOf('http')<=-1) || (type=='voice'&& sendData.url.indexOf('http')<=-1) ){
           //本地图片不发到服务器  
           // console.log(sendData);
            sendlocal=1;
         }
          else {
             this.$socket.send(data);   
          }
           if(type!=='image' && type!=='voice')  sendlocal=1;
            // uni.showLoading({
            //     title: '发送中'
            // });

            var that = this;
            if (sendlocal == 1) {
               
                        var arr = {};
                        arr.id = that.receiver.id;
                        arr.cache_key = 'U' + arr.id;
                        arr['self'] = 1;
                        arr['isloading'] = 1;
                        arr['receiver_id'] = arr['id'];
                        arr['sender_id'] = that.sender.id;
                        arr['group_id'] = 0;
                        arr['timestamp'] = parseInt(new Date().getTime() / 1000);
                        arr['time'] = '';
                        arr['message'] = { type: type, content: sendData };
                        arr['sender'] = that.sender;
                        arr['receiver'] = that.receiver;
                        arr['nickname'] = that.sender.nickname;
                        arr['avatar'] = that.sender.avatar;
                        arr['msg_id'] = '';
                        arr['_mid'] = mid;
                         that.sendingdata=arr;
                      that.sending=true;
                        this.type='text';
                     
                        //that.sendmsg(arr);
               // console.log(sendlocal);
            }
            
              //that.sending=true;
        },

        sendVoice(e) {
            this.commitMessage('voice', e);
        },
        openProfile(e) {
            //     console.log(JSON.stringify(e));
            let params = { id: e.id, status: 'friend' };
            return this.$jump('friend.detail', params);
        }
    },
    onNavigationBarButtonTap(e) {
        let params = { ...this.friend, status: 'friend' };
        return this.$jump('friend.userset', params);
    }
};
</script>

<style lang="scss">
$avatar-width: 80upx;
$control-height: 100upx;
$control-input-height: $control-height - $uni-spacing-col-base * 2;


.placeholder {
    width: 750upx;
    height: 1upx;
}

.message {
    &-time {
        color: #999;
        font-size: 24upx;
        text-align: center;
    }

    &-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: $uni-spacing-col-lg $uni-spacing-row-lg;

        .spacing {
            width: $uni-spacing-row-lg;
            height: $avatar-width;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            &::before {
                display: block;
                content: '';
                border: $uni-spacing-row-lg/2 solid transparent;
                border-right-color: #fff;
            }
        }
    }

    &.right &-info {
        flex-direction: row-reverse;
        padding-left: $uni-spacing-row-lg;
        padding-right: $uni-spacing-row-lg * 2 + $avatar-width;

        .spacing::before {
            border-right-color: transparent;
            border-left-color: $uni-color-primary;
        }
    }

    &.right &-info {
        padding-left: $uni-spacing-row-lg * 2 + $avatar-width;
        padding-right: $uni-spacing-row-lg;
    }

    &-avatar {
        width: $avatar-width;
        height: $avatar-width;
        vertical-align: middle;
        border-radius: $uni-border-radius-base;
        flex-shrink: 0;
    }

    &-content {
        font-size: 32upx;
        background: rgba(255, 255, 255, 1);
        border-radius: $uni-border-radius-base;
    }

    &.right &-content {
        color: white;
        background-color: $uni-color-primary;
    }

    &--text &-content {
        padding: 20upx $uni-spacing-row-base;
    }

    &-failed {
        width: 30upx;
        height: 30upx;
        background-color: $uni-color-error;
        border-radius: 50%;
        margin: ($avatar-width - 30upx)/2 $uni-spacing-row-base 0;
    }
}
</style>

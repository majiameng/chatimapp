<template>
    <view class="page">
        
        <view class="profile">
            <image :src="image_cache(userInfo.avatar)" class="avatar" @click="showAvatar(image_cache(userInfo.avatar))"/>
            <view>
                <view class="nickname">
                    <text :class="userInfo.mark?'':'non-nickname'">{{userInfo.mark || userInfo.nickname}}</text>
                    
                    <block class="emoji" v-if="userInfo.sex==1">
                        <image src="../../static/img/gender1.png" style="width:30upx;height:30upx;margin-left:10upx;border-radius: 5px;"></image>
                    </block>
                    <block class="emoji" v-if="userInfo.sex==2">
                         <image src="../../static/img/gender2.png" style="width:30upx;height:30upx;margin-left:10upx;border-radius: 5px;"></image>
                    </block>
               
                </view>
                 <view class="id" v-if="userInfo.nickname!=userInfo.showname">昵称: {{userInfo.showname}}</view>
                <view class="id">ID: {{userInfo.id}}</view>
                <view class="id" v-if="userInfo.province && userInfo.province!='省份'"> 地区：{{userInfo.province}}{{userInfo.city}}</view>
             
            </view>
        </view>
        <view class="cell-wrapper" style="margin-top: 20px;">
        <view class="cell" v-if="userInfo.from" >
        	<view class="cell-hd" style="color: #666;font-size: 14px;">来源</view>
        	<view class="cell-hb" style="font-size: 14px;">{{userInfo.from}}</view>
        </view>
        <view class="cell arrow" style="margin-top: 0px;" @tap="toCircle"   >
        	<!-- <view class="cell-hd" style="color: #666;width: 150upx;font-size: 14px;">朋友圈</view> -->
            <view class="cell-hd" style="text-align: left;width:calc(100% - 260upx) ;">
                    <view class="imgs" v-for="(value,index) in imgs" :key="index">
                     
                        <image :src="image_cache(value)"></image>
                    </view>
                
            </view>
        	<view class="cell-hb emoji" style="width: 100upx;"></view>
        </view>
        
        
        <view class="cell arrow" style="margin-top: 0px;" @tap="towords"  v-if="userInfo.logout_words.length>0"  >
        	<view class="cell-hd" style="color: #666;width: 150upx;font-size: 14px;">群印象</view>
            <view class="cell-hd" style="text-align: left;width:calc(100% - 260upx) ;">
                    <block class="words" v-for="(value,index) in userInfo.logout_words" :key="index">
                     <view class="tag">{{value}}</view>
                     
                    </block>
                
            </view>
        	<view class="cell-hb emoji" style="width: 100upx;"></view>
        </view>
        
        <view class="cell" style="margin-top: 0px;"   v-if="userInfo.sign && userInfo.sign != 'null'"  >
        	<view class="cell-hd" style="color: #666;width: 140upx;font-size: 14px;">个性签名</view>
            <view class="cell-hd" style="text-align: left;width:calc(100% - 150upx) ;color:#666;font-size: 12px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                   
                {{userInfo.sign}}
            </view>
 
        </view>
        
        
        <view class="cell arrow" style="margin-top: 0px;" v-if="userInfo.isfriend" @tap="open_friendset"   >
        	<view class="cell-hd" style="color: #666;font-size: 14px;">更多设置</view>
            <view class="cell-hd" style="text-align: left;width:calc(100% - 260upx) ;">
                   
                
            </view>
        	<view class="cell-hb emoji" style="width: 100upx;"></view>
        </view>
      </view>
      
     
        <block v-if="!isSelf">
            
          <view style="width: 60%;margin: 20px auto;">
                <button class="button1" v-if="userInfo.isfriend" @tap="handleChat" >
                   <uni-icons type="chat" color="#ffffff" style="margin-right: 5px;"></uni-icons>发消息
                </button>
            <button class="button1" v-else @tap="apply_adduser">
                  <uni-icons type="plus" color="#ffffff" style="margin-right: 5px;"></uni-icons> 添加到通讯录
           </button>
          </view>
            
             <view style="margin-top:20px;color:#2319DC;text-align: center;font-size: 12px;text-decoration: underline;" @tap="toreport">
                 投诉
             </view>   
        </block>
        
    
       <view class="popup" v-if="isreq">
           <view class="box">
               <ul class="layer_nav" style="height: 40px;line-height: 40px;">
                   <li class="active">加为好友</li>
               </ul>
               <view class="group_detail">
               
                   <ul class="avatarline" style="position: relative;">
                       <li >
                           <image :src="image_cache(userInfo.avatar)" class="avatar"></image>
                       </li>
                       <li>
                           <div class="title" id="group_title">昵称：{{decodeURI(userInfo.nickname)}}</div>
                           <div>
                               ID:{{userInfo.id}}
                           </div>
                       </li>
                   </ul>
                   <textarea class="textarea" placeholder="我是..." v-model="reqcon"></textarea>
               </view>
               <view style="padding: 10px 10px;height: 30px;text-align: right;">
                   <button class="layer_btns cancel"  @tap="isreq=false;">
                       <uni-icons type='closeempty' style="font-size: 14px;margin-right:1px;color: #333;font-weight: 600;"></uni-icons>
                       取消</button>
                    <button class="layer_btns ok" @tap="apply_join()">
                           <uni-icons type='checkmarkempty' style="font-size: 14px;color: #fff;margin-right: 1px;"></uni-icons>
                        确定</button>
               </view>
                      </view>
       
           
       </view>
   
    </view>
   
</template>

<script>

	import api from '../../library/index.js';
    	import http from '../../library/http.js';
   
      	import config from "../../config.js"
            import uniIcons from '../../components/uni-icons/uni-icons.vue'
    export default {
        data() {
            return {
                id: '',
                nickname: '',
                isFriend: false,
                avatar: '',
                isSelf: false,
                gender: 0,
                hasDeny: false,
                roomId: 0,
				isGroup:false,
                description: '',
				userInfo:[],
                istop:false,
                from:'',
                imgs:[],
                showMenu:false,
                no_tip:false,
             pro_title:'添加好友请求',
             pro_text:'',
             placeholder:'',
             pro_type:'',
             tipstype:0,
             user:uni.getStorageSync('userInfo'),
             group_id:0,
             isreq:false,
             reqcon:''
            }
        },
     	components: {
     	uniIcons
		},
     		methods: {
                onNavigationBarButtonTap() {
                    if(this.userInfo.isfriend){
                        this.open_friendset();
                        return false;
                    }
                    else{
                     if(this.userInfo.id!=uni.getStorageSync('access_token')) var itemList=['添加到通讯录']  
                    } 
                    
                    var that=this;
                    uni.showActionSheet({
                    	itemList:itemList,
                    	success: function (res) {
                            that.apply_adduser();
                    		
                    	},
                    	fail: function (res) {
                    		//console.log(res.errMsg);
                    	}
                    });
                    
                	//this.quickMenuVisible(!this.showMenu);
                },
               
                apply_adduser(){
                    
                    if(uni.getStorageSync('access_token')>0) {
                           var user=uni.getStorageSync('userInfo');
                           if(user.issetname==1){
                             
                                this.isreq=true;  
                               
                               
                               
                           }else{
                               this.$action.profileTips('未设置昵称，不能添加好友','/pages/friend/detail?id='+this.user.id+'&from='+this.from);
                           }
                             
                    }else{
                        this.$action.loginTips('您还没有登录，不能添加好友','/pages/friend/detail?id='+this.user.id+'&from='+this.from);
                    }
                  
                },
                
                apply_join(){
                    
                    
                    var postdata={userid:this.user.id,friend_uid:this.id,mark:this.reqcon,from:this.from};
                    http.setWait(false).post('user.php?act=applyAddFriend',postdata).then(res=>{
                      if(res.code==200){
                        var send=res.data.send;
                        uni.showToast({
                            title:res.data.message,
                            icon:'none'
                        })   
                        if(send==2){
                            var that=this;
                            setTimeout(function(){
                                uni.redirectTo({
                                    url:'chat?id='+that.userid+"&nickname="+that.userinfo.nickname
                                })
                            },1000)
                        }else{
                          
                        }
                       
                                  
                      }else{
                       uni.showToast({
                           title:'网络错误，请稍后再试',
                           icon:'none'
                       })     
                      }
                
                    })  
                   this.isreq=false;
                },
             
              
            	
  
            getGroupuser(userid,group_id){
                 var group_users=uni.getStorageSync(group_id+'_group_members');
                  if(group_users.length>0){
                       this.users_set(group_users);
                  }
                
               api.getGroupUsers({
               	group_id: group_id,
                userid: userid,
               }).then(res => {
                 this.users_set(res.data);
               
               }) 
            },
            users_set(data){
             
             if(data.length>0){
                for(var i=0;i<data.length;i++){
                
                 if(this.myid==data[i].id){
                     this.myinfo=data[i];
            
                 }
                } 
                
                
                for(var i=0;i<data.length;i++){
                 if(this.userid==data[i].id){
                     this.group_user=data[i];
                        
                     if((this.myinfo.type!=data[i].type) && (this.myinfo.type=='owner' || (this.myinfo.type=='manager' && data[i].type=='user'))){
                         this.isset=true;
                     }
                     else this.isset=false;
                     
                 }
                 
              
                } 
             uni.setStorageSync(this.group_id+'_group_members',data);
             }
                
             
            },
            open_userset(){
              uni.navigateTo({
                  url:'../group/userset?id='+this.id+'&group_id='+this.group_id+'&thistype='+this.thistype+'&usertype='+this.group_user.type
                  
              })  
            },
            open_friendset(){
              uni.navigateTo({
                  url:'../friend/userset?id='+this.id+'&from=detail'
                  
              })  
            },
			getUserInfo(id){
                var userid=id;
         
                if(uni.getStorageSync('members_'+userid)) this.userInfo=uni.getStorageSync('members_'+userid);
                if(this.userInfo.id==userid){
                    this.isloading=false;
                }
                http.setWait(false).get('user.php?act=userdetail',{id:userid,group_id:this.group_id,userid:this.user.id}).then(res=>{
                  if(res.code==200){
                    this.isloading=false;
                      this.userInfo=res.data;
                      
                     
                 uni.setStorageSync('members_'+userid,res.data)   
                  }else{
                   uni.showToast({
                       title:'网络错误，请稍后再试',
                       icon:'none'
                   })     
                  }
                                 
                
                })  
                
              
                api.getCircleImg({id:id}).then(res=>{
               
                    this.imgs=res.data;
                    
                })
                
                
			},
            photo(path){
                if(path.indexOf('http')<=-1) path=config.imgUri+path;
            	return path;
            },
			handleChat(){
                
              uni.redirectTo({
                  url:'chat?id='+this.id+"&nickname="+this.userInfo.nickname
              })
            
            
			},
            toreport(){
                            this.$jump('friend.report', {id:this.userInfo.id});    
            },
            
            toCircle(){
              this.$jump('circle.mycircle', {id:this.userInfo.id});  
            },
            towords(){
              this.$jump('friend.logout_words',{id:this.userInfo.id});  
            },
			showAvatar(e){
				uni.previewImage({
					urls:[e]
				})
			},
			
        },
        onLoad(opts) {
            uni.setStorageSync('cache_key','');
          
            this.id = opts.id;
            if(opts.group_id) this.group_id=opts.group_id;
              //this.userInfo=this.GetUserinfo(this.id);
			this.getUserInfo(opts.id)
            
            if(this.user.id == this.id){
             this.isSelf = true;
                uni.hideTabBarRedDot()
            }
            this.from=opts.from;
            var msgtop=uni.getStorageSync('msgtop');
            msgtop.map(item=>{
                if(item.storekey=='U'+this.userInfo.id) this.istop=true;
                
            })
            var msgnotip=uni.getStorageSync('msgnotip');
            msgnotip.map(item=>{
               // console.log(item);
                if(item.storekey=='U'+this.id) this.no_tip=true;
                
            })
            
        },
        onShow() {
            uni.setNavigationBarColor({
                frontColor:'#000000'
            })
               uni.hideKeyboard();
        }
    }
</script>

<style lang="scss" scoped>
    
    .page{
        background-color: #fafafa;
    }
    .button1{
        height: 40px;
        line-height: 40px;
        border: 0px;
        border-radius: 20px;
        color: #fff;
        background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
        background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
        background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
        background: linear-gradient(to bottom right, #3388ff , #2319dc);
        width: 100%;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    
    .profile {
        display: flex;
        align-items: center;
        padding:10px 20px;
        background-color: #fff;
        margin-top: 10px;
        padding-bottom: 30px;
   
        .avatar {
            width: 120upx;
            height: 120upx;
            background-color: #fff;
            border-radius: $uni-border-radius-base;
            margin-right: $uni-spacing-col-lg;
            vertical-align: top;
            margin-left: 10px;
        }

        .nickname {
            font-size: 42upx;
            font-weight: 700;
            vertical-align: top;
            color:#000 !important;
           
        }

        .id {
            color: #666;
            font-size: 24upx;
            margin-top: $uni-spacing-col-sm;
        }

        .emoji {
            font-size: 32upx;
        }
    }
    .imgs{
        display: inline-block;
        padding: 0px 20upx;
        
    }
    .imgs image{
        height: 80upx;
        width: 80upx;
        vertical-align: middle;
        border-radius: 5px;
    }
   .center{
       justify-content: center;
   }
    .cell {
        margin-top: $uni-spacing-col-lg;
        font-size: 14px;
        background-color: #fff;
        color: $uni-color-primary;
         
        &.to-room,
        &.has-deny {
            padding: 0;
            padding-right: 0;
        }
        
        .deny,
        .agree {
            flex: 1;
            text-align: center;
        }
        
        .deny {
            color: $uni-color-error;
        }
        
        .divider {
            width: 1upx;
            height: 40upx;
            flex-shrink: 0;
            background-color: #eee;
        }
    }
	.btn-wrapper {
	    margin-top: $uni-spacing-col-base;
	    padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}
    .non-nickname {
        color: gray;
    }
    .popup{
            position: fixed;
            z-index: 1000;
            background-color: rgba(0,0,0,0.6);
            top:0;
            left: 0;
            width: 100%;
            height: 100vh;
        }
        .popup  .box{
            position: fixed;
            left: 10%;
            width: 80%;
            top:20vh;
            height: auto;
            background-color: #fff;
            border-radius: 10px;
        }
        
        .popup .textarea {
        display: block;
        height: 100px;
        padding: 5px 10px;
        margin: 10px auto;
        width: calc(100% - 42px);
        border-radius: 5px;
        border: 1px solid #ddd;
    }
    .layer_nav{
        width: 100%;
        display: block;
        height: 50px;
        line-height: 50px;
        padding: 0px !important;
        margin: 0px !important;
        background-color: #eee;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
    }
    .layer_nav li{
        display: inline-block;
        float: left;
        color:#666;
        background-color: #eee;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        width: 150px;
    }
    .layer_nav li i{
        margin-right: 0px;
    }
    .layer_nav li.active{
        background-color: #3f6df5;
        color: #fff;
    }
    .layer_nav li:first-child{
        border-top-left-radius: 8px;
    }
    .layer_btns{
       
    
    display: inline-block;
        line-height: 30px;
        padding: 0px 15px;
        border-radius: 5px;
        border: 0px;
        text-align: right;
        cursor: pointer;
        height: 30px;
        color:#fff;
        margin-left:15px;
        font-size: 14px;
    }
    .layer_btns.ok{
        background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
        background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
        background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
        background: linear-gradient(to bottom right, #3388ff , #2319dc);
     height:30px !important;
    }
    .layer_btns.cancel{
        border: 1px solid #666;
        color: #666;
        background-color: #fff;
        height: 30px;
        line-height: 30px !important;
     
    }
    .group_detail .avatar{
        height: 50px;
        width: 50px;
        border-radius: 5px;
    }
    
    .group_detail{
    
    
        -webkit-overflow-scrolling: touch;
        overflow-y: scroll;
        width: 100%;
    
    }
    .group_detail::-webkit-scrollbar{
        display: none;
    }
    .group_detail .avatarline{
        height: 50px;
        line-height:50px;
        display: inline-block;
    
        table-layout: fixed;
        width: 100%;
        background-color: #fff;
        margin-bottom: 0px;
        padding:10px 0px;
        padding-bottom: 0px !important;
    }
    .group_detail .avatarline li{
        display: inline-block;
        padding: 0px 0px;
        padding-bottom: 0px !important;
    }
    .group_detail .avatarline li:first-child{
        width: 60px;
        padding-left: 10px;
        text-align: left;
        vertical-align: middle;
    }
    .group_detail .avatarline li:first-child img{
        vertical-align: middle;
        height: 50px;
        width: 50px;
        border-radius: 5px;
    }
    .group_detail .avatarline li:nth-child(2){
        padding-left: 5px;
        line-height: 25px;
    
        vertical-align: top;
    }
    .group_detail .avatarline li:nth-child(2) > div{
        height: 25px;
        line-height: 25px;
        width: 100%;
    }
    .group_detail .avatarline li:nth-child(2) > div:last-child{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #666;
    }
    
    
    .group_detail .mark{
        background-color: #fff;
        line-height: 20px;
        display: inline-block;
        color:#999;
        margin-bottom: 15px;
        clear: both;
        width: calc(100% - 20px);
        padding:5px 10px;
    }
    
    .group_detail .users{
        display:block;
    
        background-color: #fff;
        padding: 5px 0px;
        margin-bottom: 15px;
        margin-top: -15px;
    }
    
    .group_detail .users >div{
        display: inline-block;
        clear: both;
        padding: 0px 10px;
        width: calc(100% - 20px);
    }
    
    
    .group_detail .users >div{
    
        line-height: 25px;
        text-align:left;
        position: relative;
    }
    .group_detail .users >div i{
      position: absolute;
        right:0px;
        top:15px;
        color: #666;
        font-size: 20px;
    }
    .group_detail .users >div li{
        display: inline-block;
        text-align: center;
        width: calc(20% - 0px);
        color: #666;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        line-height: 25px;
        vertical-align: top;
    }
    .group_detail .users >div li img{
        height: 50px;
        width: 50px;
        border-radius: 5px;
        vertical-align: top;
    }
    
    .group_detail .lines{
        height: 50px;
        line-height: 50px;
        margin-bottom: 15px;
        background-color: #fff;
        display: table;
        width: 100%;
        table-layout: fixed;
        padding-left: 0px;
        padding-right: 0px;
    }
    .group_detail .lines > li{
        display: table-cell;
    }
    .group_detail .lines > li:first-child{
        width: 60px;
         padding-left: 10px;
        text-align: left;
    }
    .group_detail .lines > li:nth-child(2){
        width: calc(100vw - 90px);
        text-align: right;
    
        color:#999;
    }
    .group_detail .lines > li:last-child{
        width: 20px;
    
        text-align: left;
    }
    
    .group_detail .lines > li:last-child i{
        font-size: 20px;
        color: #666;
    }
    
    .group_detail .note{
        display:block;
    
        background-color: #fff;
        padding: 5px 0px;
        margin-bottom: 10px;
    }
    
    .group_detail .note >div{
        display: inline-block;
        clear: both;
        padding: 0px 10px;
        width: calc(100% - 20px);
    
    }
    .group_detail .note >div:first-child{
        height: 25px;
        line-height: 25px;
    }
    .group_detail .note > div:last-child{
    
        line-height: 20px;
        text-align: left;
        padding: 5px 0px;
        font-size: 12px;
        color: #999;
    }
</style>

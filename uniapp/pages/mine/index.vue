<!-- 我的 -->
<template>
	<view class="page">

		<div class="usercenter" :style="{'padding-top':statusBarHeight}">
		
		    <ul  >
		        <li>
		            <image :src="image_cache(user.avatar)" class="avatar"  @tap="$jump('mine.profile')"/>
		        </li>
		        <li>
		            <div><span style="font-size: 20px;font-weight: 700;" @tap="$jump('mine.profile')">{{user.nickname}}</span>
		                                <image src="/static/img/gender1.png" class="sexbtn" v-if="user.sex==1" />
                                        <image src="/static/img/gender2.png" class="sexbtn" v-if="user.sex==2" /> 
                                        <block v-if="system.signopen==1">
                                    
                                              <span class="sign_btn ok" v-if="user.is_signed==1">
                                      <uni-icons type="checkmarkempty" color="#2319dc"></uni-icons>已签</span>
                                      <span class="sign_btn click" v-else @tap="click_sign()">  <uni-icons class="icon1" type="plus"></uni-icons>签到</span>
                                           
                                        </block>
		                                                       
		
		                            </div>
		            <div>账号:{{user.name}}
                    <image src="/static/img/vip0.png" @tap='joinvip()' class="vipbtn" v-if="user.vip==0" />
                    <image src="/static/img/vip1.png" @tap='joinvip()' class="vipbtn"  style="height: 20px;" v-if="user.vip>0" /> 
                    
                
                    </div>
		
                  
		        </li>
		
		    </ul>
		     <view class="other"  @tap="$jump('mine.qrcode')">
                 <view class="emoji"  style="display: inline-block;vertical-align: middle;margin-right: 2px;;font-size: 24px;color: #fff">&#xe613;</view>
                     <uni-icons type="arrowright" style="font-size: 16px; color: #fff;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
             </view>
		
		    
		
		</div>
		
        
        <view class="showlines"  @tap="$jump('mine.bag')">
            <view>
                 <image src="/static/img/icon/pay.png"/>
            </view>
            <view>
         我的钱包
            </view>
            <view>
                <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
        <view class="showlines" v-if="user.vip==0" @tap='joinvip()'  >
            <view>
                 <image src="/static/img/vip1.png"/>
            </view>
            <view>
                    加入VIP
            </view>
            <view>
                <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
        
    
       
        <view class="showlines" v-if="system.inviteopen==1  && user.isdaili==1" @tap="$jump('mine.menu',{act:'team'})">
            <view>
                 <image src="/static/img/group.png" style="border-radius: 50%;"/>
            </view>
            <view>
         我的下级
            </view>
            <view>
                <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
        <view class="showlines" @tap="$jump('mine.menu',{act:'setting'})">
            <view>
                 <image src="/static/img/icon/setting.png"/>
            </view>
            <view>
                设置
            </view>
            <view>
                <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
        
		<!-- <view class="showlines" @tap="$jump('circle.mycircle',{id:user.id})">
		    <view>
		         <image src="/static/img/icon-circle.png"/>
		    </view>
		    <view>
		        我的朋友圈
		    </view>
		    <view>
		        <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
		    </view>
		</view> -->
		<view class="showlines" @tap="$jump('circle.circle_chat_details')" style="margin-top: 0px;">
		    <view>
		         <image src="/static/img/icon/note.png"/>
		    </view>
		    <view>
		        我的消息
		    </view>
		    <view>
		        <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
		    </view>
		</view>
        
                 
         <!-- #ifdef APP-PLUS -->
        
        
        <view class="showlines" @tap="check_upload">
            <view >
                   <uni-icons class="icon2" type='upload' style="font-size: 22px !important;vertical-align: middle;"></uni-icons>
            </view>
            <view>检查更新</view>
            <view>
                 <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
         <!-- #endif -->
         
         
         <!-- #ifndef APP-PLUS -->
         <view class="showlines" @tap="downapp">
             <view >
                    <uni-icons class="icon2" type='download' style="font-size: 22px !important;vertical-align: middle;"></uni-icons>
             </view>
             <view>下载APP</view>
             <view>
                    <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
             </view>
         </view>
                  
         
          <!-- #endif -->
          
		
		
		<div style="width: 80%;margin: 20px auto;">
		    <div class="button1" style="text-align: center" @tap="logout()">
		      
		        退出登录
		    </div>
		
		</div>
        
        
       
		<div style="height: 50px;width: 100%"></div>
      
	</view>
</template>

<script>
    	import cache from "../../library/cache.js"
        import http from "../../library/http.js"
           import api from "../../library/index.js"
        		import helper from "../../library/helper.js"
    	import config from "../../config.js"
          import uniIcons from '../../components/uni-icons/uni-icons.vue'
              
                  
            var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
            var rewardtop=statusBarHeight+34;
    export default {
        components: {
        uniIcons,
       
      
        },
        data() {
        	return {
                statusBarHeight: statusBarHeight+ 'px',
                 rewardtop: rewardtop+ 'px',
        		user: uni.getStorageSync('userInfo'),
                system: uni.getStorageSync('system'),
                msgnum:0,
                avatar:'',
                getmoeny:false,
                banklen:0,
                showlayer:false,
        
        	}
        },
      
		methods:{
          
            downapp(){
                
              window.open(this.system.downurl)
             
            },
            uploadImage() {
                
            	uni.chooseImage({
            		success: (chooseImageRes) => {
            			const tempFilePaths = chooseImageRes.tempFilePaths;
            			helper.uploadFiles(tempFilePaths,'image',{type:'avatar'}).then(res=>{
                            
            				this.user.avatar = res;
                            this.avatar= res.replace(config.imgUri,'');
                            var postdata={
                            			id:this.user.id,
                            			avatar:this.avatar,
                            				};
                   http.setWait(false).post('user.php?act=profile',postdata).then(res=>{
                            this.user=res.data;
                  
                            uni.setStorageSync('userInfo',this.user)
                        
                            
                                
                            })
            			})
            		}
            	});
            },
			previewAvatar(){
				uni.previewImage({
					urls:[this.image_cache(this.user.avatar)],
                    
				})
			},
            href(path,opts){
               
               if(!opts || opts==undefined  || opts == null) opts={}; 
                this.$jump(path,opts);
                
            },
            joinvip(){
                if(this.user.vip==2) return false;
                this.href('mine.joinvip',{});
            },
            
            fresh_money(){
              this.getmoeny=true;
                var that=this;
               
                setTimeout(function () {
                 that.getmoeny=false;   
                },800)
                this.getuserinfo();
            },
            click_sign(){
               var status= this.$action.check_userlock();
              if(status==true){
                  var postdata={
                           	userid: uni.getStorageSync('access_token')
                              };
                  http.setWait(false).post('user.php?act=sign',postdata).then(res=>{
                           this.getuserinfo();
                           uni.showToast({
                               title:res.data,
                               icon:'none'
                           })
                           })
                  
              }
            },
            getuserinfo(){
                var postdata={
                         	id: uni.getStorageSync('access_token')
                            };
                http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
                         this.user=res.data;
                         uni.setStorageSync('userInfo',this.user)
                         })
                     
            },
          
            
          
            check_upload(){
                
                let _this = this;
                	  
                    plus.runtime.getProperty(plus.runtime.appid, function(info) {
                                
                        api.update({version: info.version,osname:plus.os.name}).then(res=>{
                               //   console.log(res);
                            if(res.data.status==1) {
                          
                    uni.showModal({ //提醒用户更新
                                      title: "更新提示",  
                                      content: res.data.content,  
                                      cancelText: '下次再说',
                                      confirmText: '立即更新',
                                      success: (r) => {  
                                          if (r.confirm) {  
                                              
                                              plus.runtime.openURL(res.data.downurl);  
                                          } 
                                          
                                      }  
                                  }) 
                            }
                            else{
                                uni.showToast({
                                    icon:'none',
                                    title:'当前已是最新版本',
                                    duration:2000
                                })
                            }
                       })
                    
                    });  
            },
            logout(){
            	uni.showModal({
            		title: '提示',
            		content: '确定要退出吗？',
            		showCancel: true,
            		cancelText: '取消',
            		confirmText: '确定',
            		success: res => {
            			if(res.confirm) {
                           this.$socket.send({
                            	type: 'logout',
                            	token: uni.getStorageSync('access_token'),
                                
                            }); 
            				uni.removeStorageSync('access_token');
                            uni.removeStorageSync('userInfo');
                            this.$action.quitcid();
            				//this.$store.commit('chat/clear')
            			//	this.$jump('game.index')
                        uni.reLaunch({
                            url:'/pages/login/index'
                        })
            			}
            		}
            	});
            },
		},
        onShow() {
            if(uni.getStorageSync('access_token')>0) {
                     this.getuserinfo();
                  
            }else{
              this.$jump('login.index');
            }
         
               this.$action.setStatusTips();
         
        }
    }
</script>

<style lang="scss" scoped>
    
   
     .page{
         background-color: #fafafa;
         font-size: 14px;
     }
     
     .usercenter{
     
          display: inline-block;
         width: 100%;
     
     
         padding-bottom: 10px;
         position: relative;
         background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
         background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
         background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
         background: linear-gradient(to right, #01d9ff , #01a9fe);
         height:125px;
         color: #fff;
         padding-left: 0px;
       
     }
     .usercenter > ul{
         display: flex;
        flex-direction: row;
         width: calc(100% - 20px);
         padding: 10px 10px;
         margin-top: 30px;
     }
     .usercenter .setting{
     
           position:absolute;
         right:20px;
         top:13px;
     
         display: inline-block;
         border-radius: 50%;
        color: #fff;
         font-size: 22px;
         
     }
     .usercenter li{
        
         vertical-align: middle;
         line-height: 28px;
     }
     .usercenter li:first-child{
         width: 70px;
         text-align: left;
         padding-left: 15px;
         line-height: 30px;
         padding-top: 5px;
     }
     .usercenter li:last-child{
     padding-top: 5px;
     width: calc(100% - 90px);
     }
     .usercenter .avatar{
         height: 60px;
         width: 60px;
         border-radius: 5px;
         vertical-align: top;
     
     }
     .usercenter .other{
         color: #fff;
         position: absolute;
         right:15px;
         bottom:30px;
         line-height: 25px;
         text-align: right;
         display: inline-block;
         width: 60px;
     }
     .usercenter .menu{
         position: absolute;
         left:0px;width: 100%;
         bottom:0px;
         line-height: 40px;
         height: 40px;
         text-align: center;
         display: table;
         background-color: rgba(0,0,0,0.3);
     }
     .usercenter .menu .row{
         display: table-cell;
         color: #fff;
     }
     .sexbtn{
         height: 16px;
         width: 16px;
         
         vertical-align: middle;border-radius: 5px;margin-left: 5px;margin-bottom: 5px
     }
     
     .vipbtn{
         height: 22px;
         width: 22px;
         
         vertical-align: middle;margin-left: 5px;margin-bottom: 5px;
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
     
.icon1{
    font-size: 16px !important;
   color:#fff !important;
   margin-right: 3px;
}
.icon2{
    font-size: 28px !important;

}

.icon3{
    font-size: 16px !important;
   color:#333 !important;
   margin-right:1px;
}
    .fresh{
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
    }
  .fresh.active{
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -o-transform: rotate(360deg);
        -ms-transform: rotate(360deg);
        transition: all 0.5s ease-in-out;
        -webkit-transition: all 0.5s ease-in-out;
        -moz-transition: all 0.5s ease-in-out;
        -o-transition: all 0.5s ease-in-out;
    }
    
    .showlines{
        display: flex;
        height: 50px;
        line-height: 50px;
        margin-top: 15px;
        flex-direction: row;
        background-color: #fff;
        
    }
    .showlines > view{
       
          flex-direction: row;
          height: 50px;
          line-height: 50px;
          
    }
    .showlines > view:nth-child(1){
        width:60px ;
        text-align: center;
        align-items: center;
           justify-content:center;
    }
    .showlines > view:nth-child(2){
        width:calc(100% - 100px);
        text-align: left;
        font-size: 16px;
        color: #000;
    }
    .showlines > view:nth-child(3){
        width:40px ;
        text-align: center;
    }
      .showlines  image{
          width: 25px;
          height:25px;
          vertical-align: middle;

      }
      .sign_btn{
      
          height: 25px;
          line-height: 25px;
          border: 0px;
          border-radius: 5px;
      
          cursor: pointer;
          padding: 0px  8px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          display: inline-block;
         
          float: right;
      }
      .sign_btn.click{
          color: #fff;
          background: -webkit-linear-gradient(left top, #f05c36 , #ff7e00);
          background: -o-linear-gradient(bottom right, #f05c36, #ff7e00);
          background: -moz-linear-gradient(bottom right, #f05c36, #ff7e00);
          background: linear-gradient(to bottom right, #f05c36 , #ff7e00);
      }
      .sign_btn i:before{
          margin-left: 0px;
      }
      
      .sign_btn.ok{
          color: #2319dc;
          background-color: #ccc;
          border: 1px solid #ddd;
          height: 23px;
          line-height: 23px;
      }
</style>

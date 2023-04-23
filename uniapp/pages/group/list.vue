<template>
	<view class="page page--divider">
  <headerline shownav=true  isback="true" @tapnav="tapnav"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'  :menuitem="menuitem"    @tapmenu="tapmenu" :rightmenu=false  ></headerline>
    
    

         
         <view id="grouplist" class="grouplist">
             
             <block v-for="(m,index) in groupData" :key='index'>
               <li  v-if="(navselect==0 && m.createid==userid) || (navselect==1 && m.createid!=userid) "  @tap="gochat(m)" >
                   <div class="avatar">
                      
                      <image :src="imgshow(m.avatar)"></image>
                      </div>
                       <div class="info">
                               <div class="title">{{m.name}} (余额:{{m.coin}}币)</div>
                               <div>
                                   <uni-icons type='person' style="font-size: 16px;font-weight: 700;"></uni-icons>
                               {{m.people_count}}/{{m.people_max}}人</div>
                               <div class="tag">{{m.tags}}</div>
                   </div></li>  
                 
                 
             </block>
     
         
         </view>
         
         <view class="loading"  v-if="loading">
         	<view class="spinner">
         		<view class="rect1"></view>
         		<view class="rect2"></view>
         		<view class="rect3"></view>
         		<view class="rect4"></view>
         		<view class="rect5"></view>
         	</view>
         </view>
      
		<tabbar></tabbar>
	</view>
</template>

<script>

	import api from "../../library/index.js"
import headerline from '../../components/header.vue'
import http from "../../library/http.js"
   import uniIcons from '../../components/uni-icons/uni-icons.vue'
    import tabbar from '../../components/tabbar.vue'
  var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
	export default {
   components: {
  uniIcons,
      headerline,
     tabbar
      },
		data() {
			return {
            statusBarHeight: statusBarHeight+ 'px',
				newfriendNotify: false,
				showMenu: false,
				initializing: true,
                groupData: uni.getStorageSync(uni.getStorageSync('access_token')+'_groups'),
           navitem:['我创建的群','我加入的群'],
           navselect:0,
           navstyle:"width:50%;left:25%",
           userid:uni.getStorageSync('access_token'),
           loading:true,
           user:uni.getStorageSync('userInfo'),
           menuitem:[
       
           ]
			}
		},

		methods: {
          tapnav(num){
              this.navselect=num;
           
          },
                    
         paramClick(e) {
         	let page, params;
         	if (e.type === 'friend') {
         		const {
         			id,
         			nickname,
         			avatar
         		} = e;
         		params = {
         			id,
         			nickname,
         			avatar
         		};
         		page = 'friend.detail';
         	} else if (e.type === 'room') {
         		page = 'group.chat';
         		params = e
         	}
   
         	this.$jump(page, params);
         },
			getMyGroup() {
           
                let data = {
                             
                   userid:this.userid
                }
                this.loading=true;
				api.getMyGroup(data).then(re => {
                    
					uni.setStorageSync(this.userid+'_groups', re.data)
					for (let i in re.data) {
						re.data[i].type = 'room'
					}
					this.groupData = re.data
                    this.loading=false;
			
				});
			},
          imgshow(image_url){
                 if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
                return this.image_cache(image_url)
          },
          gochat(m){
              this.$jump('group.chat', {
              	id: m.id,
              	nickname: m.name
              });
          },
          tapmenu(num){
              if(this.$action.loginTips('未登录用户，无法完成此操作','/pages/game/index') ==false) return false;
               if(this.$action.check_userlock()==false) return false;
            if(num==0){
           
              
              if(this.user.isvip==1){
                  
                  if(this.isadd==true){
                      uni.showModal({
                      	title: '提示',
                      	content:this.addtips,
                      	showCancel: true,
                      	cancelText: '取消',
                      	confirmText: '继续发布',
                      	success: res => { 
                      		if(res.confirm){
                                   this.$jump('plan.add',{gameid:this.gameid}); 
                              }
                      	}
                      });
                  }else{
                      uni.showToast({
                          title:this.addtips,
                          icon:'none'
                      })
                  }
                  
              }else{
                 if(this.user.mobile==''){
                   uni.showModal({
                   	title: '提示',
                   	content: "您还没有绑定手机号，不能申请计划员",
                   	showCancel: true,
                   	cancelText: '关闭',
                   	confirmText: '绑定手机号',
                   	success: res => { 
                   		if(res.confirm) {
                             uni.navigateTo({
                               url:"/pages/mine/mobile" 
                             })
                   		}
                   	}
                   });  
                 }
                 else{
                     this.$jump('plan.apply');
                 }
              }
            
            }  
            else if(num==1){
                /** tinymeng */
                if(this.user.iscreategroup != 1){
                    uni.showToast({
                        title: '您没有操作权限，请联系管理员',
                        icon: 'none',
                        duration: 2000
                    })
                    return false;
                }
                  if(this.user.nickname==''){
                    this.$action.profileTips('未设置昵称，不能创建群','/pages/group/create')   ;
                   return false;
                  }
                  else
                this.jump('group.create');
            }
            else if(num==2){
                this.jump('mine.recharge')
            }
            else if(num==3){
                this.jump('mine.cash')
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
                jump(url){
                 this.$jump(url);  
                },
          setrightmenu(){
              if(this.user.id>0){
            
                
              this.getaddtips();
              }
            var menuitem=[];
             if(this.user.isvip==1){
                  menuitem.push({'title':'发布计划','icon':'plusempty'});
                 
             }
             else{
                 
              menuitem.push({'title':'申请计划员','icon':'plusempty'});
             }
            menuitem.push({'title':'创建群组','icon':'personadd'});
              menuitem.push({'title':'我要充值','icon':'plus'});
               menuitem.push({'title':'我要提现','icon':'minus'});
               
               // #ifdef APP-PLUS
              menuitem.push({'title':'扫一扫','icon':'scan'});
                // #endif 
            
                            
            
            this.menuitem=menuitem;
          },
           getaddtips(){
           http.setWait(false).post('plan.php?act=addplantips',{from:'app',userid:this.user.id}).then(res=>{
             if(res.code==200){
                  this.isadd=res.isadd;
                  this.addtips=res.data;
                }      
             });
             
           },
			/** 获取用户信息 */
			getUserInfo(){
			   api.getUserInfo({friend_uid:uni.getStorageSync('access_token')})
			   .then(res=>{
				   if(res.code == 200){
					   uni.setStorageSync('userInfo',res.data)
				   }
				});
			}
		},
		
		onShow() {
			
			this.getMyGroup();   
           this.setrightmenu();

		this.getUserInfo()
		},
		onLoad(opts) {
		if(opts.method>0) this.navselect=opts.method;
		}
	}
</script>

<style lang="scss" scoped>
     @import "@/static/css/group.css";

    .item {
        height: 100upx;
    	border-bottom: 1px solid #F0F0F0;
    	overflow: hidden;
    	padding: $uni-spacing-col-lg 30upx;
    	display: flex;
    	flex-direction: row;
    	justify-content: flex-start;
    	align-items: center;
        background-color: #ffffff;
        border-radius: 20upx;
        
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
    }
    
    .rightContent,
    .topCont {
    	overflow: hidden;
    	line-height: 1.25;
    }
    
    .topCont {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    }
    
    .userName {
    	color: $uni-text-color;
    	font-size: 38upx;
    }
    
    .time {
    	color: #999999;
    	font-size: 30upx;
    }
    
    .bottomCont {
    	width: 100%;
    	font-size: 24upx;
    	color: #999999;
    
    	display: flex;
    	align-items: center;
    	justify-content: space-between;
    }
    
    .content {
        font-size: 28upx;
    	overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
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
</style>

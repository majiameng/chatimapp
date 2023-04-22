<template>
	<view class="content">
 
		<view class="login-bg">
			<view class="login-card">
				<view class="uni-media-image">
					<image  src="/static/logo.png" class="logo"  mode="heightFix" />
				</view>
			
				<view class="login-head">&nbsp;&nbsp;</view>
					<view  v-if="type=='login'">
						
					<label class="uni-list-cell uni-list-cell-pd" >
						<label class="label-2-text" >
						   <image src="../../static/img/icon_user.png" class="icons" style="width: 20px;height: 20px;" ></image>
						</label>
						<view >
							<input type="text" class="uni-input"  placeholder="ID\用户名\手机号" v-model="form.username"  />
						</view>
					
						
					</label>
					<label class="uni-list-cell uni-list-cell-pd" >
							<label class="label-2-text" >
							  <image src="../../static/img/icon_lock.png" class="icons" style="width: 16px;"></image>
							</label>				   
							<view >
							   <input class="uni-input" placeholder="请输入密码" :password="showPassword" v-model="form.password"/>
							</view>
							<uni-icons style="display: none;" class='tip-icons' type="eye-filled" :class="[showPassword ? '' : 'active']" @tap="changePassword"></uni-icons>
							
					</label>	
						<view  class="line" style="display: none;">
							<checkbox id="save" :checked="form.save" value="1">记住登录状态</checkbox>
						</view>
					</view>
					
					
					<view  v-if="type=='reg'">
					
						<label class="uni-list-cell uni-list-cell-pd" >
							<label class="label-2-text" style="width:100upx;" >
							   <image src="../../static/img/icon_user.png" class="icons" style="width: 20px;height: 20px;" ></image>
							</label>
							<view >
								<input class="uni-input" maxlength="11" placeholder="请输入用户名" v-model="form.username"  @blur="check_name($event.detail.value)" />
							</view>	
						
								<uni-icons :type="usernamemsg=='ok'?'checkbox-filled':'clear'" :class="{'tip-icons':true,'ok':usernamemsg=='ok','error':usernamemsg=='error'}" ></uni-icons>
						</label>
					
					<label class="uni-list-cell uni-list-cell-pd" >
							<label class="label-2-text" >
							  <image src="../../static/img/icon_lock.png" class="icons" style="width: 16px;"></image>
							</label>				   
							<view >
							   <input class="uni-input" placeholder="请输入登录密码" :password="showPassword" v-model="form.password"   @input="checkpwd($event.detail.value)"  @blur="check_other($event.detail.value,'password')"/>
							</view>
							<uni-icons :type="passwordmsg=='ok'?'checkbox-filled':'clear'" :class="{'tip-icons':true,'ok':passwordmsg=='ok','error':passwordmsg=='error'}" ></uni-icons>
							
					</label>
                    <view class="passwordtips" v-if="passwordtips">
                        密码强度：<view :class="passwordcolor">{{passwordtiphtml}}</view>
                        
                    </view>
                    <label class="uni-list-cell uni-list-cell-pd" >
                    		<label class="label-2-text" >
                    		<image src="../../static/img/icon_lock.png" class="icons" style="width: 16px;"></image>
                    		</label>				   
                    		<view >
                    		   <input class="uni-input" placeholder="请再次输入密码" :password="showPassword" v-model="form.password2" @blur="check_other($event.detail.value,'password1')"/>
                    		</view>
                    		<uni-icons :type="passwordmsg2=='ok'?'checkbox-filled':'clear'" :class="{'tip-icons':true,'ok':passwordmsg2=='ok','error':passwordmsg2=='error'}" ></uni-icons>
                    		
                    		
                    </label>
                    <label class="uni-list-cell uni-list-cell-pd" v-if="system.inviteopen==1">
                    	<label class="label-2-text" style="width:100upx;" >
                    	   <image src="../../static/img/icon-tip.png" class="icons" style="width: 20px;height: 20px;" ></image>
                    	</label>
                    	<view >
                    		<input class="uni-input" maxlength="6" placeholder="请输入邀请码" v-model="form.randcode"   />
                            <view class="getcode" @tap="getcode" v-if="system.invite_code!=''" >获取邀请码</view>
                    	</view>	
                    </label>
                    <label class="uni-list-cell uni-list-cell-pd" >
                    	<label class="label-2-text" style="width:100upx;" >
                    	<image src="../../static/img/icon-tip.png" class="icons" ></image>
                         
                    	</label>
                    	<view >
                    		<input class="uni-input captch" maxlength="4" placeholder="输入右侧验证码" v-model="form.captch" @blur="check_other($event.detail.value,'randcode')"   />
                    	</view>	
                    		<image :src="codeurl" class="captchimg" @tap="changecode()" ></image>
                            <uni-icons :type="captchmsg=='ok'?'checkbox-filled':'clear'" :class="{'tip-icons':true,'ok':captchmsg=='ok','error':captchmsg=='error'}" ></uni-icons>
                            
                    </label>
					
					</view>
				
			
		</view>
		<view class="login-btn">
            
            
			<button  v-if="type=='login'" class="landing_true"  :disabled="checkIn ? false : true" type="primary" @tap="click_login">立即登录</button> 
		<button  v-else class="landing_true"  :disabled="checkIn ? false : true"  type="primary" @tap="click_reg">确认并注册</button> 
		</view>
        
    <view class="line1">
        <view    style="color:#2319DC;"   v-if="type=='login'"  @tap="changetype('reg')">免费注册 </view>
            <view    style="color:#2319DC;"   v-else  @tap="changetype('login')">立即登录</view>
            
			<view  @click="go_forget">忘记密码</view>
					
				</view>
	  </view>
      <view style="text-align: center;margin-top: 30px;">
          <checkbox  v-bind:checked="isread"  @tap="isread=!isread" id="readrule" value="1">我已阅读并同意</checkbox>《<view class="rule" @tap="go_rule(0)">用户协议</view>》及《<view class="rule" @tap="go_rule(1)">隐私条款</view>》
          
          
      </view>
      
      <view class="modalhtml" v-if="showModal">
                
                <view class="modal">
                    <view class="title">
                       个人信息保护指南 
                    </view>
                    <view class="content">
                      请充分阅读并理解<br>  《<view class="rule" @tap="go_rule(0)">用户协议</view>》及《<view class="rule" @tap="go_rule(1)">隐私条款</view>》<br>
                      <view>
                         1.在您使用本应用时，我们可能会申请系统设备权限收集设备信息、日志信息，用于推送和安全风控，并申请存储权限，用于下载及缓存相关文件<br>
                         2.您使用发布视频、语音、图片等功能时候，我们会请求您授权相机、照片、麦克风的权限。您如果拒绝授权提供，将无法使用此功能，但不影响您使用本应用的其他功能。 <br>
                         3.在您使用本应用网络服务，本应用自动接收并记录您的设备信息，包括但不限于您的IP地址、使用的语言、访问日期和时间、软硬件特征信息等数据；
      
                      </view>
                    </view>
                    <view class="btns" @tap="readrule()">
                      好的
                   </view>
                </view>
                
      </view>
      <!-- #ifndef APP-PLUS -->
      <view class="downapp" v-if="showdown==true">
          <view @tap="showdown=false">
              <uni-icons type='close' color="#fff" style="font-size: 18px;font-weight: 700;"></uni-icons>
              
          </view>
          <view>下载APP，体验更多精彩</view>
          <view>
              <button @tap='downapp'>下载</button>
              
          </view>
          
      </view>
      <!-- #endif -->
   </view>
</template>

<script>
    import store from "../../store";
    import cache from '../../library/cache.js'
		import api from "../../library/index.js"
          import uniIcons from '../../components/uni-icons/uni-icons.vue'
          import config from "../../config.js";
              import http from '../../library/http.js'
               import headerline from '../../components/header.vue'
                var windowHeight= uni.getSystemInfoSync().windowHeight;	
                 var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
	export default {
        components: {
        uniIcons
        },
		data() {
			return {
                statusBarHeight: statusBarHeight+ 'px',
				showPassword: true,
				type: 'login',
                getCodeTime:60,
                				issend:false,
                				timer1:'',
                				method:'login',
                                system:uni.getStorageSync('system'),
                 codeurl:'',
                 passwordcolor:'color0',
                 passwordtiphtml:'',
                 passwordtips:false,
                 usernamemsg:false,
                 passwordmsg:false,
                 passwordmsg2:false,
                 captchmsg:false,
                name_status:false,
                 code_status:false,
                 checkIn:true,
                 title:'登录',
                 isread:true,
				form: {
					username: '',
					password: '',
                    password2:'',
					mobile:'',
					captch:'',
                    nickname:'',
                    save:true,
                    randcode:''
					
				},
				showModal:false,
               showdown:true,
                
			}
		},
		onLoad(opts) {
       if(opts.invite_code){
           this.changetype('reg');
           this.form.randcode=opts.invite_code;
       }     

	 this.changecode();
     // #ifdef APP-PLUS
     this.$action.bindcid();
            if(!uni.getStorageSync('readrule'))
                 this.showModal=true;   
     // #endif
     this.$action.init();
		},
        onShow() {
            this.changecode();
           //  var currentWebview = page.$getAppWebview();
            if(uni.getStorageSync('access_token')>0) {
            
                 this.$jump('index.index');
            }
          
        },
		computed: {
		
		},
		methods: {
            downapp(){
          
            window.open(this.system.downurl);
             
            },
        getcode(){
          this.form.randcode=this.system.invite_code; 
        },
        readrule(){
            uni.setStorageSync('readrule',1);
            this.showModal=false;
        },
            changecode(){
              this.codeurl=config.imgUri+'inc/checkcode.inc.php?rand='+Math.random()+'&agentid='+this.agentid();
            },
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUsernameText(){
				this.form.username = ''
			},
			delInputPasswordText(){
				this.form.password = ''
			},
            delInputMobileText(){
              this.form.mobile='';  
            },
            delInputCaptchText(){
                 this.form.captch='';  
            },
			agentid(){
			     if(uni.getStorageSync('agentid')) return uni.getStorageSync('agentid');
			     else{
			         var agentid=this.randomstr(18);
			         uni.setStorageSync('agentid',agentid);
			         return agentid;
			     }
			 },
			 randomstr(len){
			  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
			    var maxPos = chars.length;
			　　  var pwd='';
			  
			  for (var i = 0; i < len; i++) {
			  　　　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
			　　}
			　　return pwd;
			 },
            changetype(type){
                this.type=type;
                if(type=='login'){
                    uni.setNavigationBarTitle({
                        title: '登录'
                    });
                    this.title='登录'
                }else{
                    uni.setNavigationBarTitle({
                        title: '注册'
                    });
                    this.title='注册'
                }
                
            },
            
            login_success(res){
                //  console.log(res);
                var resdata=res.data;
                var id=resdata.id;
                uni.setStorageSync('access_token', id);
                uni.setStorageSync('userid', id);
                uni.setStorageSync(id+'_groups',res.groups);
                  uni.setStorageSync(id+'_frienddata',res.friends);
                uni.setStorageSync('shownote',true);
              
                this.$socket.send({type:'otherlogin',uid:id});
                 this.$socket.emit('no_auth');
              uni.setStorageSync('userInfo',resdata);
          //  this.$store.commit('update_userinfo', resdata);
             // console.log(res);
             //    api.getMyGroup({userid:id}).then(res => {
             //    	uni.setStorageSync(id+'_groups',res.data)
             //    })
                
                                   
             //    api.getMyFriend({userid:id}).then(resss => {
             //        uni.setStorageSync(id+'_frienddata',resss.data);
             //    })             
                     var data11 = {
                      token:id,
                      type:'setting'
                    }
                    this.$socket.send(data11);	
                    this.$action.bindcid();
                     var urls=  uni.getStorageSync('gourl');      
                        if(urls){
                            // console.log(urls);
                             uni.reLaunch({
                                 url:urls
                             })
                        }
                         else{
                             uni.reLaunch({
                             	url: '../index/index'
                             })
                         }
               
                
            },
			
			click_login(){
				let _this = this;
                
			if(this.isread==false){
			    uni.showToast({
			       icon:'none',
			       title:'请阅读《用户协议》及《隐私条款》',
			       duration:1000
			    })
			    return false;
			}
                    if(_this.form.username==''){
                        uni.showToast({
                           icon:'none',
                           title:'请输入登录账号',
                           duration:1000
                        })
                        return false;
                    }
                    
                    if(_this.form.password==''){
                        uni.showToast({
                           icon:'none',
                           title:'请输入登录密码',
                           duration:1000
                        })
                        return false;
                    }
				var data ={username:_this.form.username,password:_this.form.password};
                this.checkIn=false;
             
				api.login(data).then(res=>{
                   
                    this.checkIn=true;
                   
                   this.login_success(res);
                })
                var that=this;
               setTimeout(function(){
                     that.checkIn=true;
                   
               },2000)
				
			},
            
            check_name(value) {
                    var reg=/^[\d\w]+$/;
                    if(reg.test(value)){
                        if(value.length>5){
                           
                            http.setWait(false).post('user.php?act=checkname1',{username:value}).then(res=>{
                              
                             var data=res.data;
                             
                            if(res.status==200){
                           
                                this.name_status=true;
                                this.usernamemsg='ok';
                            }else{
                                
                                this.usernamemsg='error';
                                this.name_status=false;
                               uni.showToast({
                                  icon:'none',
                                  title:res.message,
                                  duration:1000
                               })
                            }
                            })
  
            
                        }else{

                            this.name_status=false;
                             this.usernamemsg='error';
            
                        }
            
            
                    }else{
                         this.usernamemsg='error';
                        this.name_status=false;
                        
            
                    }
                },
                checkpwd(pwd) {
                    
                    var p1 = (pwd.search(/[a-zA-Z]/) != -1) ? 1 : 0;
                    var p2 = (pwd.search(/[0-9]/) != -1) ? 1 : 0;
                    var p3 = (pwd.search(/[A-Z]/) != -1) ? 1 : 0;
                    var pa = p1 + p2 + p3;
            
                    if(pa>0){
            
                        var num=pa-1;
                       var arr=['弱','中','强'];
                        this.passwordtiphtml=arr[num];
                        this.passwordcolor='color'+num;
                       this.passwordtips=true;
            
                    }else{
                        this.passwordtips=false;
                    }
            
                },
                 check_other(value,name) {
            
                      
                       if(name=='password'){
                          if(value.length>0){
                                if(value.length>5){
                                    this.passwordmsg='ok';
                                
                                }   else{
                                    this.passwordmsg='error';
                                }
                                
                              
                            }
                            else{
                                this.passwordmsg=false;
                            }
                        }
                       
                        
                        
                            if(name=='password1'){
                                  if(value.length>0){
                                      if(value==this.form.password){
                                      this.passwordmsg2='ok';
                                      
                                      }   else{
                                          this.passwordmsg2='error';
                                      }
                                      
                                  }
                                  else{
                                      this.passwordmsg2=false; 
                                  }
                               
                            }
                            if(name=='randcode'){
                                
                                if(value.length>0){
                                    
                                if(value.length==4){
                                    http.setWait(false).post('user.php?act=checkcode1',{randcode:value}).then(res=>{
                                     var data=res.data;
                                     
                                    if(res.status==200){
                                                               
                                        this.code_status=true;
                                        this.captchmsg='ok';
                                    }else{
                                        
                                        this.captchmsg='error';
                                        this.code_status=false;
                                       uni.showToast({
                                          icon:'none',
                                          title:"验证码错误",
                                          duration:1000
                                       })
                                    }
                                    })
                                   
                                }else{
                                    this.code_status=false;
                                     this.captchmsg='error';
                                }    
                                    
                                }else{
                                    
                                   this.code_status=false;
                                    this.captchmsg=false; 
                                    
                                }
                             
            
                            }
     
            
                },
            click_reg() {
                var _this=this;
             
                if(this.isread==false){
                    uni.showToast({
                       icon:'none',
                       title:'请阅读《用户协议》及《隐私条款》',
                       duration:1000
                    })
                    return false;
                }
                
            if(_this.form.username==''){
                uni.showToast({
                   icon:'none',
                   title:'请输入用户名',
                   duration:1000
                })
                return false;
            }
            if(_this.form.username.length<6){
                uni.showToast({
                   icon:'none',
                   title:'用户长度不能小于6位',
                   duration:1000
                })
                return false;
            }

             if(_this.form.password==''){
                        uni.showToast({
                           icon:'none',
                           title:'请输入登录密码',
                           duration:1000
                        })
                        return false;
                    }
                    if(this.form.password.length<6){
                        uni.showToast({
                           icon:'none',
                           title:'密码长度不能小于6位',
                           duration:1000
                        })
                        return false;
                    }
                    
                    if(this.form.password!=this.form.password2){
                        uni.showToast({
                           icon:'none',
                           title:'两次密码输入不一致',
                           duration:1000
                        })
                        return false;
                    }
   if(this.system.inviteopen==1 && this.form.randcode==''){
                 uni.showToast({
                    icon:'none',
                    title:'请输入邀请码',
                    duration:1000
                 })
                 return false;    
                }
                    if(this.form.captch==''){
                               uni.showToast({
                                  icon:'none',
                                  title:'请输入验证码',
                                  duration:1000
                               })
                               return false;
                           }
                           if(this.form.captch.length!=4){
                               uni.showToast({
                                  icon:'none',
                                  title:'验证码长度不正确',
                                  duration:1000
                               })
                               return false;
                           }
                   if(this.name_status==false){
                     uni.showToast({
                        icon:'none',
                        title:'该账号已被注册',
                        duration:1000
                     })
                     return false;  
                   }
                   
                   if(this.code_status==false){
                     uni.showToast({
                        icon:'none',
                        title:'您输入的验证码不正确',
                        duration:1000
                     })
                     this.changecode();
                     return false;  
                   }
                   
                     this.checkIn=false;
                    api.register({username:this.form.username,password:this.form.password,randcode:this.form.captch,invite_code:this.form.randcode}).then(res=>{
                     this.checkIn=true;
                        if(res.code==200){
                             this.login_success(res); 
                             // var reg=res.data.reg;
                             //  var that=this;
                             //  var uid=id;
                             //  setTimeout(function(){
                             //      that.sendtips(reg,uid);
                             //  },500)
                        }else{
                            this.changecode();
                        }

                    })
                    var that=this;
                    setTimeout(function(){
                          that.checkIn=true;
                          that.changecode();
                    },2000)
                },
            sendtips(reg,uid){
                if(reg.kefu && reg.kefu_tips){
                   let data = {
                     userid: reg.kefu,
                     friend_uid:uid,
                     content:reg.kefu_tips,
                     msgtype:'text',
                     type:'chat'
                   }
                   
                   this.$socket.send(data);   
                }
                if(reg.admin && reg.admin_tips){
                   let data = {
                     userid: reg.admin,
                     friend_uid:uid,
                     content:reg.admin_tips,
                     msgtype:'text',
                     type:'chat'
                   }
                   this.$socket.send(data);   
                }
                
            },
            
			go_forget(){
				uni.navigateTo({
				    url: 'froget'
				})
			},
		
			go_rule(type){
			   console.log(type)
			    uni.navigateTo({
			        url: 'rule?type='+type
			    })
			},
		}
	}
</script>

<style>
    	@import '../../static/css/uni.css';
        .rule{
           color:#2319dc;
           display:inline-block ;
        }
        .downapp{
              position: fixed;
              bottom: 0px;
              left: 0px;width: 100%;
              height: 40px;
              line-height: 40px;
              background-color:rgba(0,0,0,0.6);
              color: #fff;
              font-size: 14px;;
              display: inline-block;
              width: 100%;
              
          }
          .downapp > view{
              display: inline-block;
              text-align: center;
          }
          .downapp > view:nth-child(1){
              
              width: 40px;
          }
          .downapp > view:nth-child(3){
              width:80px;
          }
          .downapp > view:nth-child(2){
              width: calc(100% - 125px);
          }
          .downapp   button{
            display: inline-block;
            width: 70px;
             height: 28px;line-height:28px;
            background-color: #FF4400;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            vertical-align: middle;
            margin-left: 5px;
         
            
        }
        .getcode{
            position: absolute;
            right:10px;
            top:8px;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            color:#666;
        }
        .passwordtips{
            width:calc(100% - 52px);
            padding-left: 52px;
            height: 16px;
            line-height: 16px;
            color:#666;
            text-align: left;
            display:block;
            font-size: 12px;
            margin-top: 5px;;
        }
        .passwordtips > view{
            display: inline-block;
        }
        
        .passwordtips .color0{
           color: #ff0000;
        }
        .passwordtips .color1{
            color: #1834ab;
        }
        .passwordtips .color2{
            color: #2FE30E;
        }
        .label-2-text{
            width: 40px;
            display: inline-block;
            text-align: center;
        }
        .icons{
            font-size: 26px !important;
            color: #1834AB !important;
            height: 23px;
            width: 23px;
            
        }
	.tip-icons {
	    position: absolute;
        right:5px;
        top:11px;
	    font-size: 22px !important;
        display: none;

	}
	.tip-icons.ok{
        color: #1D830D !important; 
        display: inline-block;
    }
    .tip-icons.error{
        color: #e7202a !important;
        display: inline-block;
    }
	.tip-icons.active {
	    color: #2319dc !important;
	}
    .captchimg{
        position: absolute;
        right: 30px;;
        height: 40px;top:3px;
        width: 80px;;
        border-radius: 5px;;
    }
            .line{
                text-align: left;display:block;
                margin: 0 auto;
                width: calc(100% - 30px);
                height: 30px;line-height: 30px;
                margin-top: 20px;;
            }
	.uni-media-image{
		padding: 10upx 10upx;
		margin-top: 70upx;
		text-align: center;
	}
	.logo {
	
		height:80px;
		border-radius: 10px;
	}
	.landing {
		height: 84upx;
		line-height: 84upx;
		color: #FFFFFF;
		font-size: 32upx;
		bordor: none;
		border-radius: 10upx;
	}
	.placeholdertext{
		/* #ifdef H5 */
		width: 40upx;
		/* #endif */
		
		/*#ifdef APP-PLUS */
		width: 40upx;
		/* #endif */
		
		height:24upx;
	}
	.landing_true {
		
	}
	.landing_false {
		background-color: #d8d8d8;
	}
	.uni-button[type=primary] {
		
	}
 
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 30upx;
		text-align: center;
       
	}
    .login-btn button{
         border-radius: 25px;
             background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
             background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
             background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
             background: linear-gradient(to bottom right, #3388ff , #2319dc);
    }
	.login-function{
		
		/* #ifdef H5 */
		margin-top:350upx;
		/* #endif */
		
		/*#ifdef APP-PLUS */
		margin-top: 260upx;
		
		
		/* #endif */
		
		color: #999;
		text-align: center;
	}
	.login-function-old{
		margin-top:60upx; 
		margin-right:30upx;
		color: red;
		text-align: center;
	}
	.login-forget{
		float: left;
		font-size: 26upx;
		color: #999;
	}
	.textspace {
		padding: 10upx 10upx;
	}
    
    .line1{
        width: calc(100% - 100px);
        margin: 10px auto;
        display: block;
        height: 20px;
        line-height: 20px;
        text-align: center;
    }
     .line1 view{
         color: #666;
         float: text-align;
         font-size: 28upx;
         width: calc(50% - 1px);
         display: inline-block;
         border-right: 0px solid #666;
         height: 20px;
         line-height: 20px;
     }
       .line1 view:last-child{
           border-right: 0px;;
       }
	.login-register{
		color: #666;
		float: text-align;
		font-size: 26upx;
        width: 50%;
        display: inline-block;
	}
	.login-input input{
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}
	.login-margin-b{
		margin-bottom: 25upx;
	}
	.login-input{
		padding: 20upx 20upx;
	}
	.login-head{
		font-size: 34upx;
		text-align: center;
		height: 30upx;
	}
	.login-card{
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		/* box-shadow: 0 6upx 18upx rgba(0,0,0,0.12); */
		position: relative;
		margin-top:30px;
	}
	.login-bg {
		/* height: 260upx;
		padding: 25upx;
		background: linear-gradient(#FF978D, #FFBB69); */
	}
	
	page {
		background-color: #FFFFFF;
	}
	.uni-input {

		font-size:28upx;
		background:#FFF;
		flex: 1;
        width: calc(100vw -  100px);
        text-align: left;
	}
	.uni-form-item .with-fun .uni-icon {
		text-align: left;
	}
    .modalhtml{
               position: fixed;
               z-index: 999;
               top:0px;
               width: 100%;
               left: 0px;height: 100vh;
               background-color: rgba(0,0,0,0.7);
           }
           .modalhtml .modal{
               background-color: #fff;
               border-radius: 10px;;
               top:30vh;
               width: 80vw;
               left: 10vw;
               position: fixed;
               border: 1px #ddd solid;
           }
           .modalhtml .modal .title{
               text-align: center;
               height: 35px;
               line-height: 35px;
               color: #000;;
               font-size: 16px;;
               font-weight: 600;
               margin-top: 5px;;
           }
           
            .modalhtml .modal .content{
                padding: 5px 10px;
                max-height: 160px;;
                min-height: 65px;
                line-height: 30px;;
                overflow-y: scroll;
                font-size: 14px;
            }
            .modalhtml .modal .btns{
                text-align: center;
                height: 35px;
                line-height: 35px;
                color: #000;;
                font-size: 16px;;
                font-weight: 600;
               border-top: #eee 1px solid;
            }
            
            
            .notehtml{
                       position: fixed;
                       z-index: 999;
                       top:0px;
                       width: 100%;
                       left: 0px;height: 100vh;
                       background-color: rgba(0,0,0,0.7);
                   }
</style>

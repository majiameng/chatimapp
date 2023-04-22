<template>
	<view class="content">
		<view class="login-bg">
            <view class="locked-head">
            	<uni-icons type='locked' style="font-size: 42px; color: #fff;"></uni-icons>
            </view>
			<view class="login-card">
				
                <block v-if="step==0">
                    <label class="uni-list-cell uni-list-cell-pd" >
                    	<label class="label-2-text" style="width: 15%;" >
                    	   <text>用户名</text>
                    	</label>
                    	<view style="width: 85%;">
                    		<input class="uni-input" placeholder="输入用户名或者ID" v-model="form.username" />
                    	</view>	
                    
                    </label>
                    
                    
                    
                </block>
                
                
                <block v-if="step==1">
                    <label class="uni-list-cell uni-list-cell-pd" >
                    	<label class="label-2-text" style="width: 25%;" >
                    	   <text>手机号</text>
                    	</label>
                    	<view  style="float: left;text-align: left;width: 75%;">
                    		{{mobileshow}}
                    	</view>	
                    
                    </label>
                    <label class="uni-list-cell uni-list-cell-pd" >
                    	<label class="label-2-text"  >
                    	   <text>验证码</text>
                    	</label>
                    	<view style="float: left;">
                    		<input class="uni-input captch" style="width:300upx;" placeholder="请输入验证码" v-model="form.captch" />
                    
                    		<button class="captchtext" v-if="issend"  style="font-size: 24rpx;">{{getCodeTime}}秒获取</button>
                    		<button class="captchtext" v-else @tap="send_sms" >获取验证码</button>
                    		</view>
                    </label>
                    
                    
                    
                </block>
                 <block v-if="step==2">
                     
                     <label class="uni-list-cell uni-list-cell-pd" >
                     	<label class="label-2-text" >
                     	   <text>新登录密码</text>
                     	</label>
                     	<view style="float: left;text-align: left;width: 70%;">
                     		 <input class="uni-input pass" style="width: 100%;" placeholder="输入新登录密码(6-16位)" maxlength="16" password="password" v-model="form.password"/>
                     	</view>
                     		
                     
                     </label>
                     
                     <label class="uni-list-cell uni-list-cell-pd" >
                     	<label class="label-2-text" >
                     	   <text>确认登录密码</text>
                     	</label>
                     	<view style="float: left;text-align: left;width: 70%;">
                     		 <input class="uni-input pass" style="width: 100%;" placeholder="再次输入登录密码(6-16位)" maxlength="16" password="password" v-model="form.password2"/>
                     	</view>
                     		
                     
                     </label>
                     
                     
                     
                 </block>
			
				
			</view>
		</view>
		<view class="login-btn">
			<button  
			:disabled="checkIn ? false : true" type="primary" @tap="subReg">下一步</button> 
		
		</view>
	</view>
</template>

<script>
	import store from "../../store";
	import cache from '../../library/cache.js'
		import api from "../../library/index.js"
         import http from '../../library/http.js'
           import uniIcons from '../../components/uni-icons/uni-icons.vue'
           
	export default {
        components: {
        uniIcons
        },
		data() {
         
			return {
				showPassword: true,
				form: {
                    username:'',
					captch: '',
					mobile: '',
					password: '',
                    password2:'',
				},
                userid:0,
                mobileshow:'',
                mobile:'',
                disabled:true,
				getCodeTime:60,
				issend:0,
				timer1:'',
				isok:0,
                step:0,
                checkIn:true
			}
		},
		onLoad() {

		},
        onShow(){
           if(uni.getStorageSync('access_token')){
               this.disabled=true;
               var userinfo=uni.getStorageSync('userinfo');
               console.log(userinfo);
               this.form.mobile=userinfo.name;
           } 
        },
		
		methods: {
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUEmailText(){
				this.form.mobile = ''
			},
			delInputCaptchText(){
				this.form.captch = ''
			},
			delInputPasswordText(){
				this.form.password = ''
			},
			send_sms(){
				 var reg =/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
				 if(reg.test(this.mobile)){
					 this.issend=1;
					this.timer1= setInterval(() => {
					 	this.getCodeTime--
					 	if (this.getCodeTime == 0){
						 this.getCodeTime = 60;
							 clearInterval(this.timer1);
							 this.issend=0;
						}
					 }, 1000)
                     
                     api.sendCode({mobile:this.mobile,type:'pwd'}).then(res=>{
                         
                         var data=res.data;
                         	if(data.method=='login') this.isok=1;
                         	else {
                         								 uni.showToast({
                         								     title: '手机号尚未注册',
                         								     duration: 1000,
                         								 	icon:'none'
                         								 });
                         								 this.isok=0;
                         								 this.getCodeTime = 60;
                         								 clearInterval(this.timer1);
                         								  this.issend=0;
                         	}
                     })
			 
				 }
			     else{
					
					uni.showToast({
					    title: '手机格式错误',
					    duration: 1000,
						icon:'none'
					});
					 return false;
				 }
				//console.log(,this.form.captch);
			},
			
			subReg(){
				let _this = this;
                
                if(this.step==0){
                    if(this.form.username==''){
                        uni.showToast({
                           icon:'none',
                           title:'请输入用户名',
                           duration:1000
                        })
                        return false;
                    }
                    http.setWait(false).post('user.php?act=findpwd0',{username:this.form.username}).then(res=>{
                     var data=res.data;
                
                    if(res.code==200){
                         this.step=1; 
                                this.mobile=data.mobile;
                              this.userid=data.id;
                               this.mobileshow=this.mobile.substr(0,3)+'****'+this.mobile.substr(this.mobile.length-3,3); 
                                  
                      
                    }else{
                        
                       
                    }
                    })
                }
               
               else if(this.step==1){
                   
                   if(this.form.captch==''){
                              uni.showToast({
                                 icon:'none',
                                 title:'请输入验证码',
                                 duration:1000
                              })
                              return false;
                          }
                          if(this.form.captch.length!=6){
                              uni.showToast({
                                 icon:'none',
                                 title:'验证码长度不正确',
                                 duration:1000
                              })
                              return false;
                          }
                          
                          http.setWait(false).post('user.php?act=findpwd1',{mobile:this.mobile,randcode:this.form.captch}).then(res=>{
                           var data=res.data;
                     
                          if(res.code==200){
                               this.step=2; 
                               
                            
                          }else{
                              
                             
                          }
                          })
                   
               }
              else if(this.step==2){
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
                  
                if(!(/^\w{1,18}$/.test(_this.form.password))){
                	uni.showModal({
                		content: '密码只能包括下划线、数字、字母,长度6-18位',
                	});
                	return;
                }  
                 http.setWait(false).post('user.php?act=findpwd2',{id:this.userid,pwd:this.form.password}).then(res=>{
                  var data=res.data;
                                      
                 if(res.code==200){
                    uni.showToast({
                       icon:'none',
                       title:'密码重置成功',
                       duration:1000
                    })
                    setTimeout(function(){
                        uni.reLaunch({
                        	url: '../login/index'
                        })
                    },800)
                   
                   
                 }else{
                     
                    
                 }
                 })
              }
                
              
	
              
			}
		}
	}
</script>

<style>
        	@import '../../static/css/uni.css';
	.landing {
		height: 84upx;
		line-height: 84upx;
		color: #FFFFFF;
		font-size: 32upx;
		
		bordor: none;
		border-radius: 10upx;
	}
	.landing_true {
		
	}
	.landing_false {
		background-color: #d8d8d8;
	}
	.uni-button[type=primary] {
		
	}
	.placeholdertext{
		/* #ifdef H5 */
		width: 48upx;
		/* #endif */
		
		/*#ifdef APP-PLUS */
		 width: 10upx;
		/* #endif */
		height:24upx;
	}
	.captch { 
		/* #ifdef H5 */
		width: 180upx;
		/* #endif */
		
	 /* #ifdef APP-PLUS */
	  width: 165upx;
	/* #endif */
	}
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 40upx;
		text-align: center;
	}
    .login-btn  button{
        border-radius: 25px;
            background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
            background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
            background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
            background: linear-gradient(to bottom right, #3388ff , #2319dc);
    }
    
	.uni-input{float: left;}
	.captchtext{font-size: 28upx; padding: 5upx 8upx;}
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
	.pass  .email {
		  /* #ifdef H5 */
			width: 320upx;
			/* #endif */
			
		 /* #ifdef APP-PLUS */
		  width: 420upx;
		/* #endif */
		}
	
	.login-input{
		padding: 20upx 20upx;
	}
	.locked {font-size: 100upx;
	  font-weight: 1000;
	   color:#ffffff;
	
	}
	.locked-head{
		background: #dcdcdc;
		text-align: center;
		border-radius: 50%;
		width:100px;
		height:100px;line-height: 100px;;
		margin: auto;
     
        margin-top: 30px;
	
	}
	.login-card{
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 25upx;
		/* box-shadow: 0 6upx 18upx rgba(0,0,0,0.12); */
		position: relative;
		margin-top: 70upx;
	}
	.login-bg {
		/* height: 260upx;
		padding: 25upx;
		background: linear-gradient(#FF978D, #FFBB69); */
	}
	
	page {
		background-color: #FFFFFF;
	}
</style>

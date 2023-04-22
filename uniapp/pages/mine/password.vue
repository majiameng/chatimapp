<template>
	<view class="page">
       <headerline shownav=true  isback="true" @tapnav="tapnav"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'  ></headerline>
 
         <view v-if="navselect==0">
      
                
                 <ul class="profile" v-if="!isfrist" >
                      <li>原始密码：</li>
                      
                      <li>
                          <input type="password" id="password" v-model="pwd0"  style="width: 150px;" class="input1" placeholder="请输入原始登录密码"  />
                           
                      </li>
                 </ul>
              <ul class="profile" >
                  <li>新登录密码：</li>
                  
                  <li>
                      <input type="password" id="password" v-model="pwd1" style="width: 150px;" class="input1" placeholder="请输入新登录密码"  />
                       
                  </li>
             </ul>
              
              <ul class="profile" >
                   <li>确认登录密码：</li>
                   
                   <li>
                       <input type="password" id="password" v-model="pwd2" style="width: 150px;" class="input1" placeholder="再次输入新登录密码" oninput="checkpwd(this.value);" onblur="check_other(this.value,'password');check_other($('#password2').val(),'password1');" />
                        
                   </li>
              </ul>
               
              
              
             
              <view style="margin:15px auto;display:block;width: 80%;">
              
              
                  <button class="button1" @tap="change_pwd()">确认修改</button>
              
              
              </view>
             
         </view>
         
         
         <view v-else>
             <ul class="profile" >
                        <li>手机号：</li>
                        <li>
                           
                   {{mobileshow}}
             
                        </li>
                    
                    </ul>
                    
             	
             
             		<ul class="profile" >
             		    <li>验证码：</li>
             		    <li><input type="text" class="input1" id="randcode" v-model="randcode" placeholder="短信验证码" maxlength="6"
                         style="width:80px;height:30px;line-height: 30px;display: inline-block;vertical-align: middle;" />
             		
             		        <span class="sendbtn" @tap="sendsms()" style="display: inline-block;margin-left: 5px;" v-if='!disabled'>发送短信</span>
                           <span class="sendbtn" style="display: inline-block;margin-left: 5px;" v-else>
                           <block v-if="issending">发送中...</block>
                           <block v-else>
                              {{getCodeTime}}秒后再获取 
                           </block>
                           </span>
                            
             		    </li>
             		
             		</ul>
             		
             	
          
                 <ul class="profile" >
                     <li>新登录密码：</li>
                     <li><input type="password" class="input1" id="pwd" v-model="pwd" placeholder="输入新的登录密码" />
            
                     </li>
             
                 </ul>
                 <view style="margin:15px auto;display:block;width: 80%;">
                              
                 
                     <button class="button1" @tap="reset_pwd()">
                         确认并提交
                     </button>
                              
                 
                 </view>
             
                
             
         </view>
    </view>
</template>

<script>
    import api from "../../library/index.js"
    import headerline from '../../components/header.vue'
    import http from "../../library/http.js"
       import uniIcons from '../../components/uni-icons/uni-icons.vue'
      var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    	export default {
       components: {
      uniIcons,
          headerline,
         
          },
       data() {    
            return {
                
              statusBarHeight: statusBarHeight+ 'px',
              navitem:['修改登录密码','忘记登录密码'],
              navselect:0,
              navstyle:"width:60%;left:20%",
              user: uni.getStorageSync('userInfo'),
              system: uni.getStorageSync('system'),
              isfrist:false,
              pwd0:'',
              pwd1:'',
              pwd2:'',
              pwd:'',
              step:1,
              mobile:'',
              mobileshow:'',
              type:'pwd',
              timer:null,
              getCodeTime:60,
              disabled:false,
              issending:false,
              randcode:'',
             
            }
        },
        methods: {
           tapnav(num){
              
                if(num==1 && this.user.mobile==''){
                  uni.showModal({
                  	title: '提示',
                  	content: "绑定手机号,才可以重置密码",
                  	showCancel: true,
                  	cancelText: '关闭',
                  	confirmText: '绑定手机号',
                  	success: res => { 
                  		if(res.confirm) {
                            uni.redirectTo({
                              url:"/pages/mine/mobile" 
                            })
                  		}
                  	}
                  });  
                }
                else{
                    this.navselect=num;
                    if(num==1){
                        this.setuserdata();
                         this.getuserinfo();
                    }
                }
           },
           change_pwd() {
           
                   if(!this.isfrist && this.pwd0==''){
                       uni.showToast({
                          icon:'none',
                          title:'请输入原始登录密码',
                          duration:1000
                       })
                      
                       return false;
                   }
           
           
                   if(this.pwd1==''){
                       uni.showToast({
                          icon:'none',
                          title:'请输入新登录密码',
                          duration:1000
                       })
                     
                       return false;
                   }
           
                   if(this.pwd1.length<6){
                       uni.showToast({
                          icon:'none',
                          title:'新密码长度不能小于',
                          duration:1000
                       })

                       return false;
                   }
                   if(this.pwd1!=this.pwd2){
                     uni.showToast({
                        icon:'none',
                        title:'两次密码输入不一致',
                        duration:1000
                     })
                       return false;
                   }
           
                
                http.setWait(true).post('user.php?act=change_pwd',{method:'login',id:this.user.id,password:this.pwd1,oldpwd:this.pwd0,isfrist:this.isfrist}).then(res=>{
               
               this.pwd0=this.pwd1=this.pwd2='';
                uni.showToast({
                   icon:'none',
                   title:'登录密码已修改成功',
                   duration:1000
                })
                         })
                 
           
           
               },
               sendsms() {
               	        var mobile=this.mobile;
               	        var reg =/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
               	        if(reg.test(mobile)){
               	
                this.disabled=true;	
                this.issending=true;
               http.setWait(true).post('user.php?act=sendCode',{mobile:mobile,type:this.type}).then(res=>{
                    this.issending=false;
                   if(res.data.method!='error'){
                   
                  var that=this;
                  clearInterval(that.timer);
                  that.timer=setInterval(function () {
                      that.getCodeTime--;
                      that.disabled=true;	
                      if(that.getCodeTime<=0){
                         that.disabled=false;
                          that.getCodeTime=60;
                          clearInterval(that.timer);
                      }
                  },1000)
                   			
                   }else{
                         var that=this;
                       that.disabled=false;
                        that.getCodeTime=60;
                   clearInterval(that.timer);
                               uni.showToast({
                                  icon:'none',
                                  title:'短信发送失败',
                                  duration:1000
                               })
                   }
                 
                        })
               
               	        }else{
                               uni.showToast({
                                  icon:'none',
                                  title:'手机号码格式错误',
                                  duration:1000
                               })
               	           
               	            return false;
               	        }
               	
               	    },
               setuserdata(){
                   if(this.user.mobile){
                    this.mobile=this.user.mobile;
                      this.mobileshow=this.mobile.substr(0,3)+"*****"+this.mobile.substr(this.mobile.length-3,3);
                
                     
                   }
                
               },
               getuserinfo(){
                   var postdata={
                            	id: uni.getStorageSync('access_token')
                               };
                   http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
                                   this.user=res.data;
                                   uni.setStorageSync('userInfo',this.user)
                                   this.setuserdata();
                            })
               },
               reset_pwd() {
  var mobile=this.mobile;
                      if(mobile==''){
                          uni.showToast({
                             icon:'none',
                             title:'手机号不能为空',
                             duration:1000
                          })
                   
                          return false;
                      }
                      var reg =/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
                      if(!reg.test(mobile)){
                          uni.showToast({
                             icon:'none',
                             title:'手机号码格式错误',
                             duration:1000
                          })
                          
                          return false;
                      }
                      if(this.randcode==''){
                          uni.showToast({
                             icon:'none',
                             title:'短信验证码不能为空',
                             duration:1000
                          })
                  
                          return false;
                      } 
                      if(this.pwd==''){
                          uni.showToast({
                             icon:'none',
                             title:'请输入新登录密码',
                             duration:1000
                          })
                        
                          return false;
                      }
                                 
                      if(this.pwd.length<6){
                          uni.showToast({
                             icon:'none',
                             title:'新密码长度不能小于6',
                             duration:1000
                          })
                      
                          return false;
                      }
                    
                    http.setWait(true).post('user.php?act=reset_pwd',{id:this.user.id,mobile:mobile,randcode:this.randcode,pwd:this.pwd,method:'login'}).then(res=>{
                    
                    this.pwd=this.randcode='';
                     uni.showToast({
                        icon:'none',
                        title:'登录密码已重置成功',
                        duration:1000
                     })
                              })
                     
               
               
                   }
        },
        onLoad(opts) {
            var pwd=this.user.pwd;
           if(pwd==undefined || pwd==null || pwd=='' ){
               this.isfrist=true;
               
           }
           else {
               this.isfrist=false;
           }
           
        }
    }
</script>

<style lang="scss" scoped>
  @import "@/static/css/user.css";
  .page{
      background-color: #fafafa;
  }
  .profile,.login-lines1{
      background-color: #fff;
      margin: 10px auto;
      width: 100%;
     vertical-align: middle; 
  }
  .profile li{
      vertical-align: middle;
  }
  .profile li:first-child{
      width:120px
  }
  .profile li:last-child{
      width:calc(100% - 130px)
  }
</style>

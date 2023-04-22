<template>
	<view class="page" style="padding-top: 10px;">
        
        <ul class="profile" v-if="user.mobile && step==1">
            <li>手机号：</li>
            <li>
               
       {{mobileshow}}
 
            </li>
        
        </ul>
        
		<ul class="profile" v-else >
		    <li>新手机号：</li>
		    <li>
 <input type="text" class="input1" v-model="mobile" placeholder="输入新手机号码"  style="width: 150px;" />

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
		
		 <view style="margin:15px auto;display:block;width: 80%;">

		
		    <button class="button1" @tap="click_mobile()">
                <block v-if="user.mobile && step==1">更换手机号</block>
                <block v-else>确认绑定</block>
            </button>

		
		</view>
	</view>
</template>

<script>

        import http from "../../library/http.js"
    	import config from "../../config.js"
        import uniIcons from '../../components/uni-icons/uni-icons.vue'
          
    export default {
        components: {
        uniIcons
      
        },
		data() {
			return {
			user: uni.getStorageSync('userInfo'),
			system: uni.getStorageSync('system'),	
            step:1,
            mobile:'',
            mobileshow:'',
            type:'bind',
            timer:null,
            getCodeTime:60,
            disabled:false,
            issending:false,
            randcode:'',
			}
		},
		methods: {
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
                           title:'该手机号已经被其他用户使用',
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
        click_mobile(){
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
          http.setWait(true).post('user.php?act=mobile',{id:this.user.id,mobile:mobile,randcode:this.randcode}).then(res=>{
               if(res.code=='200'){
                  
                               if(this.type=='change'){
                                    this.step=2;
                                    this.type='new';
                                    this.mobile='';
                                    this.randcode='';
                                    uni.setNavigationBarTitle({
                                        title:'设置新手机号'
                                    })
                               }else{
                                  this.getuserinfo();
                                  uni.showToast({
                                     icon:'none',
                                     title:'手机绑定成功',
                                     duration:1000
                                  })
                                 
                               }
               
               
                           }else{
               uni.showToast({
                  icon:'none',
                  title:res.message,
                  duration:1000
               })
                              
                           }
          
                   })
          
          },
          setuserdata(){
              if(this.user.mobile){
               this.mobile=this.user.mobile;
                 this.mobileshow=this.mobile.substr(0,3)+"*****"+this.mobile.substr(this.mobile.length-3,3);
                 this.type='change';
                 uni.setNavigationBarTitle({
                     title:'更换手机号'
                 })
              }
              else{
                  this.type='bind';
                  uni.setNavigationBarTitle({
                      title:'绑定手机号'
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
                              this.setuserdata();
                       })
          },
		},
        onShow() {
          this.setuserdata();
           this.getuserinfo();
        }
	}
</script>

<style>
     @import "@/static/css/user.css";
     .page{
         background-color: #fafafa;
     }
     .profile{
         background-color: #fff;
         margin: 10px auto;
         width: 100%;
     }
     .profile li{
         vertical-align: middle;
     }
</style>

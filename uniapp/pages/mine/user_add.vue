<template>

    <view class="page">
    
  
  <ul class="profile" >
       <li>登录账号：</li>
       
       <li style='position: relative;'>
        <input type="text" style="width: 150px;" maxlength="10" class="input1" placeholder="请输入登录账号" v-model="form.username" @blur="check_name($event.detail.value)" />
        
        <uni-icons :type="usernamemsg=='ok'?'checkbox-filled':'clear'" :class="{'tip-icons':true,'ok':usernamemsg=='ok','error':usernamemsg=='error'}" ></uni-icons>
       </li>
  </ul>
  <ul class="profile" >
       <li>登录密码：</li>
       
       <li>
        <input type="password" style="width: 150px;" maxlength="10" class="input1" placeholder="默认密码:123456" v-model="form.password"/>
       </li>
  </ul>
         <ul class="profile" >
                  <li>用户类型：</li>
                  
                  <li>
                    <radio :checked="form.isdaili==true"   @tap="set_daili(true)" >代理</radio>
                    <radio style="margin-left: 10px;" :checked="form.isdaili!=true"   @tap="set_daili(false)" >用户</radio>    
                  </li>
             </ul>
             
          <ul class="profile" style='display: none;' >
              <li>返点比例：</li>
              
              <li>
                  <picker @change="change_rebate" :value="rebate_index" :range="rebates" :disabled="rebate_disabled" style="display: inline-block;">
                      <view class="uni-input">{{form.rebate}}%</view>
                  </picker>
                   <span style="margin-left:10px;color:#666;">
                      (
                      <block v-if="form.isdaili">
                        打赏分润占比   
                           
                       </block>
                       <block v-else>
                           用户账号无分润  
                       </block>
                       
                       
                       </span>
                      )
              </li>
         </ul>
         
            
           
           <view style="margin:15px auto;display:block;width: 80%;">
      
               <button class="button1" @tap="click_sub()">确认并提交</button>
           </view>
         
         
         
         <view class="modalhtml" v-if="showModal">
                   
                   <view class="modal">
                       <view class="title">
                          开户成功 
                       </view>
                       <view class="content">
                       登录账号：{{form.username}}<br>
                        登录密码：{{form.password}}<br>
                        账号类型：<block v-if="form.isdaili">代理</block><block v-else>用户</block><br>
                        
                        访问网址：{{loginurl}}
                       </view>
                       <view class="btns" >
                           <span @tap="showModal=false;">关 闭</span>
                         <span style="color:#2319DC;font-weight: 600;" @tap="copyinfo()">复 制</span>
                      </view>
                   </view>
                   
         </view>
         
    <tabbar></tabbar>
    </view>
</template>

<script>
	import http from "../../library/http.js"
    import config from "../../config.js"
     
        import uniIcons from '../../components/uni-icons/uni-icons.vue'
            import tabbar from '../../components/tabbar.vue'
          var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    export default {
        components:{
                 uniIcons,
           tabbar
        },
        data() {
        	return {
            
                list:[],
				user:uni.getStorageSync('userInfo'),
                rebates:[],
                rebate_disabled:false,
                rebate_index:0,
                form:{
                    username:'',
                    rebate:'',
                    isdaili:true,
                    userid:uni.getStorageSync('access_token'),
                    password:'',
                    
                },
                showcode:false,
                qrcode:'',
                qrcode_id:'',
                usernamemsg:false,
                name_status:false,
                showModal:false,
                loginurl:config.imgUri
                
                
        	}
        },
        methods: {
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
            set_daili(type){
                this.form.isdaili=type;
                if(type==true){
                      this.form.rebate= this.rebates[this.rebate_index];
                      this.rebate_disabled=false;
                }
                else{
                      this.form.rebate=0;
                       this.rebate_disabled=true;
                }
            },
            change_rebate(e){
                var index=e.detail.value;
               this.rebate_index=index;
                this.form.rebate= this.rebates[this.rebate_index];
              
    
            },
            click_sub(){
                this.form.userid=this.user.id;
                this.form.isdaili=this.form.isdaili?1:0;
             
                if(this.form.username==''){
                    uni.showToast({
                       icon:'none',
                       title:'请输入用户名',
                       duration:1000
                    })
                    return false;
                }
                if(this.form.username.length<6){
                    uni.showToast({
                       icon:'none',
                       title:'用户长度不能小于6位',
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
                        if(this.form.password=='') this.form.password='123456';
                                 if(this.form.password.length<6){
                                     uni.showToast({
                                        icon:'none',
                                        title:'密码长度不能小于6位',
                                        duration:1000
                                     })
                                     return false;
                                 }
                                 
                           
               http.setWait(true).post('user.php?act=user_add',this.form).then(res=>{
                 
                 if(res.code==200){
                
                  this.showModal=true;
         
                 }
               }) 
            },
           copyinfo(){
             var str="登录账号："+this.form.username+"\n";  
              str+="登录密码："+this.form.password+"\n";  
              str+="账号类型：";
              if(this.form.isdaili) str+="代理";
              else str+="用户";
              str+="\n";
             str+="返点比例："+this.form.rebate+"\n";  
              str+="访问网址："+this.loginurl+"\n";  
             this.copy(str);
             this.showModal=false;
           },
            timestampToTime(timestamp) {
                    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var Y = date.getFullYear() ;
                    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
                    var D = date.getDate();
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    if(D<10) D='0'+D;
                     if(h<10) h='0'+h;
                      if(m<10) m='0'+m;
                       if(s<10) s='0'+s;
                    return Y+'-'+M+'-'+D;
            },
            copy(data){
                uni.setClipboardData({
                    data:data,
                    success() {
                        uni.showToast({
                            title:'复制成功',
                             icon:'none'
                        })
                    },
                    fail: () => {
                        uni.showToast({
                            title:'复制失败',
                            icon:'none'
                        })
                    }
                })
            },
           
        },
        onLoad(opts) {
            this.user = uni.getStorageSync('userInfo');
      this.form.rebate=this.user.rebate-0.5;
      this.rebates=[];
      for(var i=this.form.rebate;i>=0;i=i-0.5){
          this.rebates.push(i.toFixed(1));
      }
           
        },
        onNavigationBarButtonTap() {
            
        }
    }
</script>

<style lang="scss" scoped>
  @import "@/static/css/user.css";
  .page{
      background-color: #fafafa;
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
             .modalhtml .modal .btns >span{
                 display: inline-block;
                 width: calc(50% - 1px);
                 height: 35px;
                 line-height: 35px;
             }
             .modalhtml .modal .btns >span:last-child{
                 border-left: #eee 1px solid;
             }
          
  .tip-icons {
      position: absolute;
      left:180px;
      top:-8px;
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
   .nodata{
       height: 40px;
       line-height: 40px;
       text-align: center;
   }
   
   .lists{
       background-color: #fff;
       margin-top: 10px;
       padding: 5px 10px;
       line-height: 25px;
       clear: both;
       display:  inline-block;
       width: calc(100% - 20px);
   }
   .lists > view{
       clear: both;
   }
   .lists > view > span{
       display: inline-block;
   }
   .lists > view > span:first-child{
       text-align: left;
       float: left;
   }
   .lists > view > span:last-child{
       text-align: right;
       float: right;
   }
     .lists > view .title1{
         color: #666;
     }
     .btn1{
         display: inline-block;
         height: 22px;
         line-height: 22px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         border-radius: 5px;
     }
     
     .btn2{
         display: inline-block;
         height: 28px;
         line-height: 28px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #2319dc;
         border: 1px #2319dc solid;
         color:#fff;
         border-radius: 5px;
         padding: 0px 10px;
         margin: 0px 15px;
     }
     .btn2.delete{
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         color:#222;
          padding: 0px 10px;
     }
      .lists > view.btns{
          height: 30px;line-height: 30px;text-align: center;
      }
      
      .qrcode{
        background-color: rgba($color: #000000, $alpha: 0.5);  
        position: fixed;
        left: 0px;
        width: 100%;
        height: 100vh;
        top:0px;
      }
      .qrcode .code{
          height: 200px;
          width: 200px;
          top:calc(50% - 150px);
          left: calc(50% - 100px);
          position: fixed;
      }
       .qrcode .close{
           bottom: 80px;;
           left: calc(50% - 20px);
           position: fixed;
           height: 40px;width: 40px;
       }
</style>

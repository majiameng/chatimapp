<template>
    
    <view  class="page">

         <view class="content">
             
             <image src="../../static/img/ie.png"></image>
             
             <view  class="tips">
                 PC网页端登录确认
             </view>
         </view>
         
         <view class="btns">
             <view class="ok" @tap="login(2)">确认登录</view>
             
             <view class="cancle" @tap="quit()">取消登录</view>
         </view>
	</view>
</template>

<script>
import http from "../../library/http.js"
	export default {
		data() {
			return {
				agent:''
			}
		},
		onLoad(opts) {
          this.agent=opts.agent;
        this.login(1)
		},
        onUnload() {
           this.login(0)
        },
     
		methods: {
		    login(step){
                var data={uid: uni.getStorageSync('access_token'),step:step,agent:this.agent};
       
                http.setWait(false).get('index.php?act=qrcode_sublogin',data).then(res=>{
                      if(res.code==200){
                          if(step==2){
                              
                              uni.showToast({
                                  title:'登录成功',
                                  icon:'none'
                              })
                              setTimeout(function(){ uni.navigateBack();},1000)
                             
                          }
                      }
                })  
            },
            quit(){
                this.login(0);
                uni.navigateBack();
            }
            }
	}
</script>

<style>
        	@import '../../static/css/uni.css';
	     .content{
             margin-top: 120px;
             text-align: center;
         }
           .content image{
               height: 100px;
               width: 100px;
               vertical-align: top;
           }         
           .content .tips{
               height: 30px;
               line-height: 30px;
               font-size: 12px;
                   color: #666;
                   margin-top: 10px;
                    }
        .btns{
            position: fixed;
            z-index: 1;
            left: 0px;width: 100%;
            bottom: 0px;
            
        } 
        .btns > view{
            height: 40px;
            line-height: 40px;
            margin-bottom: 20px;;
            display: block;
            text-align: center;
            
        }
         .btns .ok{
             width: 180px;
             background-color: #3388ff;
             border-radius: 5px;
             color: #fff;
             font-size: 16px;
             margin: 20px auto;
             
         }
          .btns .cancel{
              color: #666;
              font-size: 14px;
          }
</style>

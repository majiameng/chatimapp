<template>
	<view class="content">
        
        
       <image src="../../static/img/banner.png" mode="widthFix" />
	<view class="img-skip" @tap="goindex()" v-if="showtime">
        跳过{{time}}
      
    </view>
	</view>
</template>

<script>

		export default {
        data(){
          return {
              time:5,timer:null,
              showtime:false,
          }  
        },
      methods: {
          
          daojishi(){
              var that=this 
            this.timer=  setInterval(function(){
                 
                  that.time--;
                  if(that.time<=0){
                      clearInterval(that.timer);
                     that.goindex();
                  }
              },1000)
          } ,
           goindex(){
               clearInterval(this.timer);
               
            
              
                   var userid=uni.getStorageSync('access_token');
                   if(userid>0){
                 uni.reLaunch({
                     url:'../index/index'
                 })      
                 
                   }
                   else{
                       uni.reLaunch({
                           url:'../login/index'
                       })
                   }
               
             
           }
          
        },
        onLoad() {

        },
        onShow() {
            this.$action.init();
            this.goindex();
        //     // #ifdef APP-PLUS
        //     var that=this;
             
        //        plus.runtime.getProperty(plus.runtime.appid, function(info) {
              
        //          if(uni.getStorageSync('app_version')==info.version){
                    
        //              that.goindex();
        //          }else{
        //             that.showtime=true;
        //              that.daojishi();
        //           uni.setStorageSync('app_version', info.version);
                  
        //           if( uni.getStorageSync('access_token')){
        //               uni.setStorageSync('shownote',true);
        //           }
        //          }
                 
        //        });
            
        //        // #endif
        // // #ifndef APP-PLUS
        //    this.goindex()
        
        //    // #endif
     
        }
	}
</script>

<style lang="scss" scoped>
	.img-skip{
        position: absolute;
        width: 60px;
        height: 30px;
        padding: 5px 5px;
     background-color: rgba(0,0,0,0.6);
     color:#fff;
        border-radius:5px;
		z-index: 100;
        top:30px;
        right: 10px;;
         text-align: center;
         line-height: 30px;
         font-size: 14px;
	}
	.img-skip > .title {
		color: #666;
        height: 18px;
	}
    	.img-skip > .title2{
            color: #999;
             height: 18px;
        }

    .content,,image {
        overflow: hidden;
        width: 100vw;
       vertical-align: middle;
    }
</style>

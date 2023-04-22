<template>

    <view class="page">
        
        <view style="text-align: center;height: 320px;width: 260px;margin: 0px auto;padding-top:30px;vertical-align: top;">
             <div class="info">
                 <li>
                 <image :src="user.avatar" style="height: 50px;width: 50px;border-radius: 5px;vertical-align: middle;"></image>
                 </li>
        
                 <li style='padding-left: 5px;line-height: 25px;;'>
                    {{user.nickname}}<br>
                      账号：{{user.name}}
        
                 </li>
             </div>
        
        <view class="qrbg">
        
            <image class="qrcode" :src="img" style="width: 180px;height:180px;" />
        
        </view>
        <view class="nodata" style="color: #666;;">扫描二维码,添加好友</view>
        
        
        </view>
    
    </view>
</template>

<script>
	import api from "../../library/index.js"
    import config from "../../config.js"
    export default {
        data() {
        	return {
                img: '',
				user:'',
        	}
        },
        methods: {
            
        },
        onLoad(opts) {
            this.user = uni.getStorageSync('userInfo');
            if(this.user.avatar.indexOf('http')<=-1){
                
        
                this.user.avatar=config.imgUri+this.user.avatar;
            }
			api.getMyQrcodeCard({id:this.user.id,'type':'qr_user'}).then(res=>{
                var img=res.data;
                if(img.indexOf('http')<=-1){
                    img=config.apiUri+img;
                }
                
				this.img = img
			})
            
           
        },
        onNavigationBarButtonTap() {
            var that=this;
         uni.showActionSheet({
         	itemList:['保存图片'],
         	success: function (res) {

            uni.saveImageToPhotosAlbum({
                        filePath:that.img,
                        success: function () {
                           uni.showToast({
                               title:'图片已保存到相册',
                               icon:'none'
                           })
                        }
                    });    
       
         }
          })   
        }
    }
</script>

<style lang="scss" scoped>
  @import "@/static/css/group.css";
  .page{
      background-color: #fff;
  }
   .info{
        width: 100%;
    display: table;
    table-layout: fixed;
    height: 50px;
    line-height: 50px;
    text-align: left;
    }
    .info > li{
        display: table-cell;
        vertical-align: middle;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .info > li:first-child{
        width: 60px;
      
    }
    .info > li:first-child img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 5px;
    }
    .info > li:nth-child(2){
        line-height: 25px;
    }
    .qrbg{
        display: block;
        margin: 15px auto;
        width: 200px;
        height: 180px;
        padding: 10px 0px;
        background-image:url(../../static/img/qrbg.png);
        background-size: 100% 100%;
        margin-top: 30px;
    }
</style>

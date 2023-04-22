<template>
	<view class="page">
        
        <view style="text-align: center;height: 320px;width: 260px;margin: 0px auto;padding-top:30px;vertical-align: top;">
             <div class="info">
                 <li>
                 <image :src="group.avatar" style="height: 50px;width: 50px;border-radius: 5px;vertical-align: middle;"></image>
                 </li>
        
                 <li style='padding-left: 5px;line-height: 25px;;'>
                    {{group.name}}<br>
                      ID：{{group.id}}
        
                 </li>
             </div>
        
        <view class="qrbg">
        
            <image class="qrcode" :src="img" style="width: 150px;height:150px;" />
        
        </view>
        <view class="nodata" style="color: #666;;">用浏览器扫描二维码</view>
        
        
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
                group:''
        	}
        },
        methods: {
            
        },
        onLoad(opts) {
		      this.group = uni.getStorageSync('group_'+opts.id)
            api.getMyQrcodeCard({id:opts.id,'type':'qr_group'}).then(res=>{
                var img=res.data;
                if(img.indexOf('http')<=-1){
                    img=config.apiUri+img;
                }
                
            	this.img = img
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
            height: 150px;
            padding: 25px 0px;
            background-image:url(../../static/img/qrbg.png);
            background-size: 100% 100%;
            margin-top: 30px;
        }
</style>

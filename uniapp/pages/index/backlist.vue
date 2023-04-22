<template>
	<view class="page">
        <block v-if="list.length>0">
    <view class="friends" v-for="(item,index) in list" :key='index' @tap="open_detail(item)">
        
        <view class="avatar">
            <image :src="image_cache(item.avatar)"></image>
        </view>
        <view class="showname">
            {{item.nickname}}     
        </view>
    </view>    
        
        </block>
	<block v-else>
        <view style="height: 50px;line-height: 50px;text-align: center;color: #666;">
            您还没有拉黑任何人
        </view>
    </block>
	</view>
</template>

<script>
      	import http from "../../library/http.js"
	export default {
		data() {
			return {
				list:  uni.getStorageSync('backlist')
			}
		},
		methods: {
			getbacklist(){
                
                http.setWait(false).get('user.php?act=getbacklist',{userid:uni.getStorageSync('access_token')}).then(res=>{
                    
                         console.log(res);     
                  this.list=res.data;
                  uni.setStorageSync('backlist',res.data);
               
                })
            },
            open_detail(item){
            
                 this.$jump('friend.detail',{id:item.id});
            },
		},
        onShow() {
            this.getbacklist();
        }
       
	}
</script>

<style lang="scss">
    .page{
        font-size:14px ;
    }
 .friends{
        padding: 5px 0px;
       
        height: 35px;
        line-height: 35px;
        display: table;
        table-layout: fixed;
        width: calc(100% - 0px);
 
        margin-bottom: 1px;
    }
    .friends .avatar{
        display: table-cell;
        width: 60px;
        text-align: center;
    }
    .friends .avatar  image{
        height: 35px;
        width: 35px;
        border-radius: 5px;;
        vertical-align: middle;
    }
     .friends .showname {
         text-align:left;
         display: table-cell;
         font-size: 16px;
   
         color: #333;
         line-height: 35px;;
         vertical-align: middle;
          margin: 0px 0px;
          padding: 0px 0px;
                border-bottom: 1upx #EFEFEF solid;
      }
</style>

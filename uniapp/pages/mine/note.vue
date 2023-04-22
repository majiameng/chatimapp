<template>
	<view class="page">
		<view class="cell-wrapper">
         
         <view class="cell" style="font-size: 14px;height: 35px;line-height: 35px;color: #666;">
             
           群组通知  
         </view>
			<view class="cell" >
			    <view class="cell-hd">声音</view>
			    <switch @change="noteChanage(1)" :checked="shownote(user.note1)" />
			</view>
			<view class="cell" >
			    <view class="cell-hd">震动</view>
			    <switch @change="noteChanage(2)" :checked="shownote(user.note2)" />
			</view>
            
            
            
            
            
            <view class="cell" style="font-size: 14px;height: 35px;line-height: 35px;color: #666;">
                
              私信通知  
            </view>
            			<view class="cell" >
            			    <view class="cell-hd">声音</view>
            			    <switch @change="noteChanage(3)" :checked="shownote(user.note3)" />
            			</view>
            			<view class="cell" >
            			    <view class="cell-hd">震动</view>
            			    <switch @change="noteChanage(4)" :checked="shownote(user.note4)" />
            			</view>
       
		</view>
			
	</view>
</template>

<script>

	import http from "../../library/http.js"

	export default {
		data() {
			return {
				user: uni.getStorageSync('userInfo'),
				note1:true,
                note2:true
                    
			}
		},
		methods: {
			
            shownote(note){
              if(note==1) return true;
                else return false;
            },
            noteChanage(num){
                if(num==1){
                   var note=this.user.note1==1?0:1;
                 
                  var  data={id:this.user.id,note1: note};
                }
                if(num==2){
                   var note=this.user.note2==1?0:1;
                  var  data={id:this.user.id,note2: note};
                }  
                if(num==3){
                   var note=this.user.note3==1?0:1;
                  var  data={id:this.user.id,note3: note};
                }  
                if(num==4){
                   var note=!this.user.note4==1?0:1;
                  var  data={id:this.user.id,note4: note};
                }
           http.setWait(false).post('user.php?act=profile',data).then(res=>{
                    this.user=res.data;
                    uni.setStorageSync('userInfo',this.user)
                        
                    })
                      
            },
        
            
		},
		onLoad() {
        
            
       
		}
	}
</script>
<style lang="scss" scoped>
	.cell-wrapper {
		margin-top: 0;
	}

	.avatar {
		line-height: 1;
		padding-top: $uni-spacing-col-base;
		padding-bottom: $uni-spacing-col-base;

		.cell-hb {
			display: flex;
			flex-direction: column;
		}

		image {
			width: 140upx;
			height: 140upx;
			border-radius: $uni-border-radius-base;
			background-color: #eee;
		}
	}

	.fromInput {
		text-align: right;
		font-size: 32upx;
		color: #777;
        border: 1px sold #eee !important;padding: 0px 5px;;
        
	}
	.uploadBtn{
        width: 90%;
		margin-top: 100upx;
	}
</style>

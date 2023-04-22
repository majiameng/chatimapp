<template>
	<view v-if="isshow">
		<image :src="image_cache(item.avatar)" class="leftImg" />
		
	</view>
</template>

<script>
     import config from "../config.js"
	export default {
        props: {
            msg: {
                required: true,
            },
        
        },
		data() {
			return {
				item:[],
                isshow:false,
			};
		},
        mounted() {
               var msg=this.msg.msg;
          if(msg.avatar.indexOf('http')<=-1) msg.avatar=config.imgUri+msg.avatar;
                
               this.item=msg;
              this.isshow=true;
        }
	}
</script>


<style lang="scss">
	.item {
        height: 100upx;
		border-bottom: 1px solid #F0F0F0;
		overflow: hidden;
		padding: $uni-spacing-col-lg 30upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
    .item:hover{
        background-color: #eee;
    }

	.leftImg {
		width: 100upx;
		height: 100upx;
		margin-right: $uni-spacing-row-base;
		border-radius: $uni-border-radius-base;
		display: flex;
		flex-flow: wrap;
		justify-content: center;
		background-color: #eee;
		align-items: center;

		&:not(image) {
			padding: 1upx;
		}

		view,
		image {
			width: (76upx-2upx*4)/3;
			height: (76upx-2upx*4)/3;
			margin: 1upx;
		}
	}

	.rightContent {
		flex: 1;
	}

	.rightContent,
	.topCont {
		overflow: hidden;
		line-height:50upx;
	}

	.topCont {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
        vertical-align: top;
	}

	.userName {
		color: $uni-text-color;
		font-size: 32upx;
	}

	.time {
		color: #999999;
		font-size: 30upx;
	}

	.bottomCont {
		width: 100%;
		font-size: 24upx;
		color: #999999;

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.content {
        font-size: 28upx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
	}

	.badge {
		background-color: red;
		color: #fff;
		border-radius: 40upx;
		line-height: 40upx;
		width: 40upx;
		height: 40upx;
		font-size: 24upx;
		text-align: center;
		flex-shrink: 0;
	}
</style>

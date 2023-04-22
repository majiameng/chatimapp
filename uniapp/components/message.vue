<template>
	<view>
		<view :class="{item:true,'item-reverse':m.sender.id==userInfo.id}">
			<view class="avatar">
				<image :src="m.sender?m.sender.avatar:m.receiver?m.receiver.avatar:''" mode=""></image>
			</view>
			<view v-if="m.message.type == 'text'" :class="{'text': true,'reverse blueBg':m.sender.id==userInfo.id}">
				{{m.message.content}}
			</view>
			<view v-if="m.message.type == 'image'" :class="{'text': true,'reverse blueBg':m.sender.id==userInfo.id}">
				<image :src="m.message.content" mode="widthFix" style="max-width: 300upx;" @click="showImages"></image>
			</view>
			<view v-if="m.message.type == 'redpack'" :class="{'redpack': true,'reverse':m.sender.id==userInfo.id,'redpack-open':m.message.content.hasget||hasget}" @click="grab">
				<view class="redpack-body">
					<view class="redpack-body-image"></view>
					<view class="redpack-body-content">
						<view>{{m.message.content.money}}</view>
						<view class="description">{{m.message.content.note||'恭喜发财，大吉大利！'}}</view>
					</view>
				</view>
				<view class="redpack-footer">
					红包
				</view>
			</view>
			<view v-if="m.message.type == 'voice'" :class="{'voice': true,reverse:m.sender.id==userInfo.id,'voice-play':msgId == $store.state.currentVoiceId}" @click="showVoice">
				<view :class="{'box': true,'mybox':m.sender.id==userInfo.id}">
					<view class="wifi-symbol">
						<view class="wifi-circle first"></view>
						<view class="wifi-circle second"></view>
						<view class="wifi-circle third"></view>
					</view>
				</view>
				<view :class="{'voice-text': true,'voice-text-right':m.sender.id==userInfo.id}">
					{{m.message.content.time}}''
				</view>
			</view>
			<view v-if="m.message.type == 'face'" :class="{'text': true,'reverse blueBg':m.sender.id==userInfo.id}">
				<image :src="m.message.content" :style="{width:(faceSize.width/2) + 'px', height: (faceSize.height/2) + 'px'}" @load="setEmoji"></image>
			</view>
		</view>
	</view>
</template>
<script>
	import api from "../library/index.js"
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data(){
			return{
				userInfo:  uni.getStorageSync('userInfo'),
				hasget:false,
				onVoice:false,
				faceSize: {width:'',height:''}
			}
		},
		props: {
			m: {
				type: Object,
				require: true
			},
			msgId:  {
				type: [Number, String],
				require: true
			}
		},
		methods:{
			setEmoji(e){
				this.faceSize = e.detail
			},
			grab(){
				if(this.m.group_id>0){
					let group = uni.getStorageSync('group_'+this.m.group_id)
					let index = this.m.message.content.id
					for(let i in group){
						if(group[i].message.content.id==index){
							group[i].message.content.hasget=true
						}
					}
					uni.setStorageSync('group_'+this.m.group_id,group)
					this.hasget = true
					api.grab({id:this.m.message.content.id}).then(res=>{
						this.$emit('getPick',{content:this.m.message.content,data:res,sender: this.m.sender})
					}).catch(data=>{
						this.$emit('getPick',{content:this.m.message.content,data:data,sender: this.m.sender})
					})
				}else{
					let chat = uni.getStorageSync('chat_'+this.m.receiver.id);
                    console.log(JSON.stringify(chat));
					let index = this.m.message.content.id
					for(let i in chat){
						if(chat[i].message.content.id==index){
							chat[i].message.content.hasget=true
						}
					}
					uni.setStorageSync('chat_'+this.m.receiver.id,chat)
					this.hasget = true
					api.grab({id:this.m.message.content.id}).then(res=>{
						this.$emit('getPick',{content:this.m.message.content,data:res,sender: this.m.sender})
					}).catch(data=>{
						this.$emit('getPick',{content:this.m.message.content,data:data,sender: this.m.sender})
					})
				}
				
			},
			showVoice(){
				if(innerAudioContext.paused) {
					this.$store.state.currentVoiceId = this.msgId;
					innerAudioContext.play()
				} else {
					this.$store.state.currentVoiceId = -1;
					innerAudioContext.stop()
				}
			},
			showImages(){
				uni.previewImage({
					urls:[this.m.message.content]
				})
			}
		},
		created() {
			innerAudioContext.src = this.m.message.content.url
			innerAudioContext.onCanplay(function(){
				innerAudioContext.pause();
			})
			innerAudioContext.onEnded(()=>{
				this.$store.state.currentVoiceId = -1;
			})
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		display: flex;
		font-size: 28upx;
		padding: 20upx;
		&-reverse{
			flex-direction: row-reverse;
			
		}
		.avatar {
			width: 90upx;
			height: 90upx;
			border-radius: 12upx;
			background: #fff;
			overflow: hidden;

			image {
				width: 90upx;
				height: 90upx;
			}
		}

		.text,
		.redpack,
		.voice {
			margin: 0 20upx;
			border-radius: 12upx;
			max-width: 70%;
			position: relative;
			&:before {
				display: block;
				content: "";
				position: absolute;
				left: -12upx;
				top: 39upx;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 12upx 12upx 12upx 0;
			}
			&.reverse:after {
				display: block;
				content: "";
				position: absolute;
				right: -12upx;
				top: 39upx;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 12upx 0upx 12upx 12upx;
			}
			&.reverse:before{
				display: none;
			}
		}

		.text {
			line-height: 35upx;
			padding: 30upx 20upx;
			background: #fff;
			color: #000;
			word-wrap: break-word;
			&:before{
				border-color: transparent #fff transparent transparent;
			}
			&.reverse:after{
				border-color: transparent transparent transparent #007aff;
			}
		}

		.redpack {
			background: #EF9638;
			color: #fff;
			&:before{
				border-color: transparent #EF9638 transparent transparent;
			}
			&.reverse:after{
				border-color: transparent transparent transparent #EF9638;
			}
			&-open{
				background: #FDE1C3;
				.redpack-body-image{
					background: #FB998A;
				}
				.redpack-body-image::before{
					background: #FFF3E7;
					top: -110upx;
				}
				&:after{
					border-color: transparent transparent transparent #FDE1C3 !important;
				}
			}
			&-body {
				padding: 20upx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				&-image {
					background: #CD3D35;
					width: 70upx;
					height: 90upx;
					overflow: hidden;
					position: relative;
					border-radius: 6upx;

					&:before {
						content: "";
						display: block;
						width: 140upx;
						height: 140upx;
						border-radius: 50%;
						position: absolute;
						top: -90upx;
						left: 50%;
						transform: translateX(-50%);
						background: #FA5151;
					}

					&:after {
						position: relative;
						display: block;
						content: '￥';
						width: 28upx;
						height: 28upx;
						background-color: #f2d252;
						color: #E08B34;
						border-radius: 28upx;
						line-height: 32upx;
						font-size: 24upx;
						transform: scale(.8);
						margin: 36upx auto;
						text-align: center;
					}
				}

				&-content {
					padding-left: 20upx;
					
				}
			}

			&-footer {
				font-size: 24upx;
				padding: 10upx 20upx;
				background: #fff;
				color: #999;
				border-bottom-left-radius: 12upx;
				border-bottom-right-radius: 12upx;
			}
		}

		.voice {
			width: 30%;
			position: relative;
			background: #007aff;
			color: #fff;
			&:before{
				border-color: transparent #007aff transparent transparent;
			}
			&.reverse:after{
				border-color: transparent transparent transparent #007aff;
			}
			&-text{
				margin-left: 60upx;
				line-height: 90upx;
				margin-right: 60upx;
			}
			&-text-right{
				text-align: right;
			}
			&-play{
				.second {
					animation: fadeInOut 1s infinite 0.2s;
				}
				
				.third {
					animation: fadeInOut 1s infinite 0.4s;
				}
			}
		}
	}

	.box {
		position: absolute;
		top: 50%;
		transform: translate(30upx,-50%);
	}
	.mybox{
		transform: rotateY(180deg);
		top: 25%;
		right: 15%;
	}

	.wifi-symbol {
		border: 1px solid red;
		width: 25px;
		height: 25px;
		box-sizing: border-box;
		overflow: hidden;
		transform: rotate(135deg);
		position: relative;
	}

	.wifi-circle {
		border: 2px solid #fff;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 2px;
		height: 2px;
		background: #fff;
		top: 22px;
		left: 22px;
	}

	.second {
		width: 12px;
		height: 12px;
		top: 17px;
		left: 17px;
	}

	.third {
		width: 20px;
		height: 20px;
		top: 12px;
		left: 12px;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
	.blueBg{
		background: #007aff!important;
		color: #fff!important;
	}
	.description{
		min-width: 250upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>

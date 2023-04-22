<template>
	<view class="page" @touchstart="touchStart" @touchend="touchEnd">
		<form>
			<view class="uni-textarea">
				<textarea placeholder="这一刻的想法..." v-model="input_content"/>
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
										<view class="close-view" @click="close(index)">x</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show="imageList.length < 9">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>			
		</form>
	</view>
</template>

<script>
	import helper from "../../../library/helper.js"
	import api from "../../../library/index.js"
    import action from "../../../library/action.js"
	import config from "../../../config.js"
    import _data from "../../../library/_data.js"
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				// title: 'choose/previewImage',
				input_content:'',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//end
				
				send_status: false,
			}
		},
		onShow(){
			
		},
		onUnload() {
			this.imageList = [],
			this.sourceTypeIndex = 2,
			this.sourceType = ['拍照', '相册', '拍照或相册'],
			this.sizeTypeIndex = 2,
			this.sizeType = ['压缩', '原图', '压缩或原图'],
			this.countIndex = 8;
		},
		methods: {
			publish(){
        
				if (!this.input_content && this.imageList.length==0) {
					uni.showToast({ title: '内容不能为空', icon:'none', });
					return;
				}
				if(this.send_status){
					return;
				}
				
				this.send_status = true;
				
				let _this = this;
				
				uni.showLoading({title:'发布中'});
				
				// #ifndef H5
				//var location = await this.getLocation(); //位置信息,可删除
				// #endif
				
			
					let content = {
						text: this.input_content,
						value: [],
					};
					if(_this.imageList.length){
                     
						for(var i = 0,len = _this.imageList.length; i < len; i++){
                            
                            helper.uploadFiles([ _this.imageList[i]], 'images', {
                            	type: 'images'
                            }).then(res => {
                                res= res.replace(config.imgUri,'');
                                content.value.push(res);
                                
                                if(content.value.length==len){
                                  _this.save(content);  
                                }
                            });
                            
					
						}
						return;
					}
                    else{
                        _this.save(content);
                    }
				
			},
            
            save(content){
                api.sendCircle({userid:uni.getStorageSync('access_token'),data:JSON.stringify(content)}).then(res=>{
                    
                    uni.hideLoading();
                    this.send_status = false;
                    if(res.data>0){
                        uni.showToast({
                        	icon: 'success',
                        	title: '发布成功',
                        	success(){
                        	let circle_data1 = _data.localData('circle_data');
                            var postdata={userid:uni.getStorageSync('access_token'),time:(circle_data1.length ? circle_data1[0].time: 0)};
                        		api.getCircleList(postdata).then(res=>{
                                    console.log(res.data);
                                 let   circle_data=_data.addData('circle_data',res.data)
                                 
                                   uni.$emit('data_circle_data',circle_data);
                                    
                                })
                                
                        		uni.redirectTo({
                        			url: '../../circle/circle'
                        		});
                        	}
                        });
                    } 
                })
            },
            
			// #ifndef H5
			getLocation(){ 
				// h5中可能不支持,自己选择
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							resolve(res);
						},
						fail: (e) => {  
							reject(e);
						}
					});
				});
			},
			// #endif
			close(e){
			    this.imageList.splice(e,1);
			},
			chooseImage: async function() {
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
                        
                        console.log(this.imageList);
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				// 					var current = 'https://i.loli.net/2019/02/18/5c6a6e2623448.jpg'
				// 					this.imageList = ['https://i.loli.net/2019/02/18/5c6a6e2623448.jpg','https://i.loli.net/2019/02/18/5c6a6e49829ea.jpg']
				console.log(current);
				console.log(this.imageList);
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			touchStart: function(e) {
				this.startX = e.mp.changedTouches[0].pageX;
			},
			
			touchEnd: function(e) {
				this.endX = e.mp.changedTouches[0].pageX;
				if (this.endX - this.startX > 200) {
					uni.navigateBack();
				}
			}
		},
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				this.publish();
			}
		},
	}
</script>

<style scoped>
    	@import url("../../../static/css/uni.css");
		@import url("../../../static/css/circle.css");
	.cell-pd {
		padding: 20upx 30upx;
	}

	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
	}
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
		margin-bottom: 80upx;
	}
	.close-view {
	    text-align: center;
		line-height:22upx;
		height: 24upx;
		width: 24upx;
		border-radius: 50%;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 6upx;
		right: 8upx;
		font-size: 24upx;
	}
	.page {
		width: 750upx;
		height: 100%;
	}
</style>

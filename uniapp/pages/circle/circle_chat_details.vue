<template>
	<view id="moments">
		
		<view class="moments__post1" v-for="(post,index) in posts" :key="index" :id="'post-'+index">
			<view class="moments__post">
                <view class="post-left">
                	<image class="post_header" :src="photo(post.user.avatar)" @tap="goDetails(post.uid)" :lazy-load="true"/>
                </view>
                
                <view class="post_right">
                	<text class="post-username" @tap="goDetails(post.from_uid)">{{post.user.nickname}}</text>
                	<view id="paragraph" class="paragraph" >
                    <view v-if="post.type=='like'">
                       	<image src="../../static/push/circle/liked.png" :lazy-load="true" style="height:40upx;width: 40upx;"/> 
                    </view>
                    <view v-else> {{post.content}}</view>
                   
                    </view>
                	
                
                	
                	<!-- 资料条 -->
                	<view class="toolbar">
                		<view class="timestamp">{{ timestamp(post.time) }}</view>
                
                	</view>
                	
                </view>
                <view class="post-info">
                  
                    <view v-if="post.info.type=='delete'" class="text">该说说已删除</view>
                    <view v-else-if="post.info.type=='text'" class="text">{{post.info.content}}</view>
                       <view v-else>
                           
                           <image :src="photo(post.info.content)" style="width: 140upx;height: 140upx;vertical-align: middle;"></image>
                           
                       </view>
                </view>
                
            </view>
           
			<!-- 结束 post -->
		</view>

		<view class="foot" v-show="showInput">
			<chat-input @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
	
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>

</template>

<script>
	import chatInput from './circle/chat_input.vue'; //输入消息框
	import _data from "../../library/_data.js"
  
		import api from "../../library/index.js"
        import action from "../../library/action.js"
        import config from "../../config.js"
        	import helper from "../../library/helper.js"
	export default {
		components: {
			chatInput
		},
		data() {
			return {
				user_id: 0,
				posts: [],//模拟数据
				index: '',
				comment_index: '',
				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				loadMoreText: "加载中...",
				showLoadMore: true,
				is_more: false,
				my_data: {},
                page:1
			}
		},
		computed:{
			staticPath(){
				return _data.staticCircle();
			},
			staticPhoto(){
				return _data.staticPhoto();
			},
		},
		onLoad(option) {
			let _this = this;
			
			_this.my_data = _data.data('user_info');
			
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					_this.screenHeight = res.screenHeight;
					_this.platform = res.platform;
				}
			});
		},
		onShow() {
	
			let _this = this;
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
			this.pullDownRefresh();
			/** 监听新的个人数据 */
			uni.$on('data_user_info',function(data){
				_this.my_data = data;
			});
            uni.setStorageSync('data_circle_tips',0);
            action.setStatusTips();
		},
		onUnload() {
			uni.$off('data_user_info');
			uni.offWindowResize(); //取消监听窗口尺寸变化
			this.max = 0,
			this.data = [],
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
		onReachBottom() { //监听上拉触底事件
			this.showLoadMore = true;
			if(this.is_more){
				return;
			}
			let time = 0,
			is_length = this.posts.length;
			if(is_length){
				time = this.posts[is_length - 1].time;
			}
			this.getCircleList({
				time,
				type: 1,
				user_id: this.user_id,
				chat: 1,
			});
		},
		onPullDownRefresh() { //监听下拉刷新动作
			this.pullDownRefresh();
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			if (e.index == 0) {
				this.navigateTo('./circle/send')
			}
		},
		methods: {
			photo(path){
                if(path.indexOf('http')<=-1) path=config.imgUri+path;
				return path;
			},
            timestamp(time){
              return action.timestampFormat(time);  
            },
			pullDownRefresh() {
				//初始化数据
				let time = 0;
				if(this.posts.length){
					time = this.posts[0].time;
				}					
				this.getCircleList({
					time,
					type: 0,
					user_id: this.user_id,
					chat: 1,
				});
				uni.stopPullDownRefresh(); // 停止下拉刷新
			},
			getCircleList(send_data){
				let _this = this;
                var data={userid:uni.getStorageSync('access_token'),page:this.page};
               // console.log(this.page);
          
               api.getCircleMsg(data).then(res=>{
                 
                 if(res.data.length){
                 		
                 		_this.posts.push(...res.data);
                 		this.page++
                 		}else{
                            if(this.page==1)
                            _this.loadMoreText = '暂无通知';
                            else 
                 			_this.loadMoreText = '没有数据了';
                 			_this.is_more = true;
                 		}
                   
               })
              },
			goDetails(user_id){
				this.navigateTo('../friend/detail?id=' + user_id);
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						
						// console.log("data:" + JSON.stringify(data));
						// console.log("手机屏幕高度:" + this.screenHeight);
						// console.log("竖直滚动位置" + scrollTop);
						// console.log("节点离页面顶部的距离为" + data.top);
						// console.log("节点高度为" + data.height);
						// console.log("窗口高度为" + this.windowHeight);

						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			
			blur: function() {
				//this.init_input();
			},
			
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.input_placeholder = '评论';
				this.is_reply = false;
			},
			previewImage(index, image_index) {
				let data = this.posts[index],
				images_all = [];
				for(let i = 0,j = data.content.value.length;i<j;i++){
					images_all.push(this.staticPath + data.post_id + '/' + data.content.value[i].replace('_thumb',''));
				}
				var current = images_all[image_index];
				uni.previewImage({
					current: current,
					urls: images_all
				});
			},
			goPublish() {
				uni.navigateTo({
					url: './circle/send',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		watch: {
		},
	}
</script>

<style scoped>
	@import url("../../static/css/circle.css");
	.new_msg {
		text-align: center;
		color: #36648B;
		font-weight: bold;
	}
</style>
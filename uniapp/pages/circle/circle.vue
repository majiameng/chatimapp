<template>
	<view id="moments" class="page">
			
		<view class="home-pic">
		<image :src="photo(my_data.circle_img)" @tap="upload" style="width: 100vw;height:65vw;"></image>
			<view class="home-pic-base">
				<view class="top-pic">
					<image class="header" :src="image_cache(myPhoto)"  @tap.stop="goDetails(my_data.id)" :lazy-load="true" />
				</view>
				<view class="top-name">{{ my_data.nickname }}</view>
			</view>
		</view>
		
		<view class="new_msg" style="color: #333333;" @tap="goCircleChat" v-if="no_reader_msg">你有<view style="color: #ff0000;display: inline;">{{no_reader_msg}}条</view>新的消息</view>
         
		<view class="moments__post1" v-for="(post,index) in posts" :key="index" :id="'post-'+index">
			<view class="moments__post">
              <view class="post-left">
              	<image class="post_header" :src="image_cache(post.header_image)" @tap="goDetails(post.userid)" :lazy-load="true"/>
              </view>
              
              <view class="post_right">
              	<view class="post-username" @tap="goDetails(post.uid)">{{post.username}}</view>
              	<view id="paragraph" class="paragraph" @tap="init_input()">{{post.content.text}}</view>
              	
              	<!-- 相册 -->
              	<view class="thumbnails" v-if="post.type == 0" @tap="init_input()">
              		<view :class="post.content.value.length === 1 ? 'my-gallery' : 'thumbnail' " 
              		v-for="(image, index_images) in post.content.value" 
              		:key="index_images">
              			<image class="gallery_img"
              			:lazy-load="true"
              			mode="aspectFill"
              			:src="image_cache(staticPath  + image)"
              			:data-src="image"
              			@tap="previewImage(index,index_images)"
                        
              			/>
              		</view>
              	</view>
              	
              	<!-- 资料条 -->
              	<view class="toolbar">
              		<view class="timestamp">{{ post.timestamp }}
                    <view class="delete" v-if="post.userid==myid" @tap="circle_delete(index)">删除</view>
                    </view>
              		<view class="like" @tap="like(index)">
              			<image :src="post.islike === 0 ? '../../static/push/circle/islike.png' : '../../static/push/circle/like.png'" :lazy-load="true"/>
              		</view>
              		<view class="comment" @tap="comment(index)">
              			<image src="../../static/push/circle/comment.png" :lazy-load="true"></image>
              		</view>
              	</view>
              	<!-- 赞／评论区 -->
              	<view class="post-footer">
              		<view class="footer_content" v-if="post.like.length">
              			<image class="liked" src="../../static/push/circle/liked.png" :lazy-load="true"></image>
              			<view class="nickname" 
              			v-for="(user,index_like) in post.like" 
              			:key="index_like"
              			@tap="goDetails(user.uid)"
              			>
              				{{(index_like ? ',' : '' ) + user.username}}
              			</view>
              		</view>
              		<view class="footer_content" 
              			v-for="(comment,comment_index) in post.comment" 
              			:key="comment_index" 
              			@tap="reply(index,comment_index)">
              			
              			<view class="comment-nickname" style="word-break:break-all;line-height: 40upx;">
              				{{comment.username + comment.reply + ': '}}
              				<text class="comment-content">
              					{{comment.content}}
                                
                                 
              				</text>
                              <view class="delete" style="float: right;" v-if="comment.uid==myid" @tap="comment_delete(index,comment_index)">删除</view>
              			</view>
              			
              		</view>
                      
                    
              	</view>
                      
              </view>  
                
                
            </view>
            
    
			<!-- 结束 post -->
		</view>
 <view class="foot" style="z-index: 999999;" v-show="showInput">
     
     	<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
     	<!-- <chat-input @send-message="send_comment" @blur="blur" :placeholder="input_placeholder"></chat-input> -->
     </view>
		<view class="loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>

</template>

<script>
    
    import {
    	mapState
    } from 'vuex';
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
				my_data: {
				},
				user_id: 0,
				
			    posts:[],
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
				showLoadMore: false,
				is_more: false,
				no_reader_msg: uni.getStorageSync('data_circle_tips')?uni.getStorageSync('data_circle_tips'):0,
                loaddata:[],
                myid:uni.getStorageSync('access_token'),
                userinfo:uni.getStorageInfoSync('userInfo'),
                page:1,             
			}
		},
        created() {
            this.my_data= {
					id: uni.getStorageSync('access_token'),
					nickname: this.userinfo.nickname,
					photo: '../../static/logo.png',
					circle_img: '../../static/img/default_circle_img.jpg',
				}
        },
		computed:{
			myPhoto(){
				return this.my_data.photo ;
			},
			circleImg(){
              
				return this.my_data.circle_img;
			},
			staticPath(){
				return config.imgUri;
			},
			
			imgRan(){
				return Math.random();
			},
          
		},
		onLoad(option) {
			// let _this = this;
			
			// uni.getSystemInfo({ //获取设备信息
			// 	success: (res) => {
			// 		_this.screenHeight = res.screenHeight;
			// 		_this.platform = res.platform;
			// 	}
			// });
            //this.onGetData();
			this.onshowlisten();
		},
		onShow() {
		
		
			var _this = this;
                this.getUserInfo();
			var circle_data =_data.cache('circle_data');
            
   
           // console.log('onshow');
			/** 加载本地缓存数据，让页面秒速渲染出来 */
			if(circle_data){
              setTimeout(function(){_this.setCircleData(circle_data);},10);	
				_this.pullDownRefresh();
				
			}
			else{
                _this.setCircleData([]);
				_this.pullDownRefresh();
			}
			
			
			console.log('+++');
		},
		onUnload() {
			this.$socket.off('data_circle_tips');
            this.$socket.off('circle_push');
			uni.offWindowResize(); //取消监听窗口尺寸变化
			this.max = 0,
			this.data = [],
			this.loadMoreText = "加载更多",
			this.showLoadMore = false;
		},
        
     
		onReachBottom() { //监听上拉触底事件
			let _this =this;
			_this.showLoadMore = true;
			if(_this.is_more){
				return;
			}
			this.page++;

          this.onGetData();
		},
		onPullDownRefresh() { //监听下拉刷新动作
			if(_data.data('no_reader_circle') || _data.data('no_reader_circle_chat_num')){
				this.posts = [];
				_data.data('circle_data',[]);
			}
			this.pullDownRefresh();
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			if (e.index == 0) {
				this.navigateTo('./circle/send');
			}
		},
		methods: {
            photo(path){
                if(path.indexOf('http')<=-1) return path;
                else  return this.image_cache(path)
         
            },
            onshowlisten(){
                this.no_reader_msg = uni.getStorageSync('data_circle_tips') ?  uni.getStorageSync('data_circle_tips') : 0;
                action.setStatusTips();
                _data.data('no_reader_circle',0);
                
                // 监听窗口尺寸变化,窗口尺寸不包括底部导航栏
                uni.onWindowResize((res) => { 
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
                        
                        
                   this.$socket.on('circle_push', (res) => {//更新朋友圈消息
                        action.circleUpate(res.data);
                       this.posts =_data.cache('circle_data');
                    })    
                        
                
                
                /** 监听朋友圈动态提示 */
                this.$socket.on('data_circle_tips',function(res){
                	if(!isNaN(res.data)){
                		_this.no_reader_msg = res.data;
                	};
                    uni.setStorageSync('data_circle_tips',res.data);
                    action.setStatusTips();
                });
            },
			upload(e){
                
             
                uni.chooseImage({
                	success: (chooseImageRes) => {
                          uni.showLoading();
                		const tempFilePaths = chooseImageRes.tempFilePaths;
                		helper.uploadFiles(tempFilePaths,'image',{type:'avatar'}).then(res=>{
                              
                			this.my_data.circle_img= res;
                          //  console.log(res);
                             var  avatar= res.replace(config.imgUri,'');         
                              api.changeProfile({circle_img:avatar,id:this.my_data.id}).then(res => {
                                  uni.hideLoading()
                                  this.$toast('更新成功').then(() => {
                                 
                                  });
                                
                              
                              });
                		})
                	}
                });

			},
            onGetData(){
                let time = 0;
                    let circle_data11 = _data.localData('circle_data');
                  
                if(circle_data11.length>0){
                	time = circle_data11[0].time;
                }
                let that =this;
            
               // _data.localData('circle_data',[])
                api.getCircleList({userid:uni.getStorageSync('access_token'),page:this.page}).then(res=>{
                         
                                if(this.page==1)_data.addData('circle_data',res.data)
                                //  console.log(circle_data);
                    				that.setCircleData(res.data);
                    			//	uni.$emit('data_circle_data',circle_data);
                                    if(res.data.length < 10){
                                    	this.loadMoreText = '没有更多数据了';
                                    	this.is_more = true;
                                        this.showLoadMore=true;
                                    }
                    
                })
                
            },
            
            setCircleData(data){
               var list11=[];
               var len=data.length;
               let circle_data11 = _data.localData('circle_data');
                
               if(circle_data11.length>0 && this.page>1){
               	var time = circle_data11[circle_data11.length-1].time;
               }
         
               
              // if(len>20) len=20;
               for(var i=0;i<len;i++){
                   var item=data[i];
                  if(item.like==false) item.like=[];
                  if(item.comment==false) item.comment=[];
                 item.timestamp=action.timestampFormat(item.time);
                 item.islike=this.setisLike(uni.getStorageSync('access_token'),item.like);
                 if(item.time<time || this.page==1)  list11.push(item);  
               }
                 if(this.page==1) {
                this.posts=list11;        
                 }
             
                else this.posts.push(...list11);
            },
            
            setisLike(id,data){
                if(data.length==0 || data==[]) return 0;
                for(var i=0;i<data.length;i++){
                    if(data[i].uid==id) return 1;
                }
                 return 0;
            },
            
            
			goCircleChat(){
				_data.data('no_reader_circle_chat_num',0);
				this.navigateTo('./circle_chat_details');
			},
            getUserInfo(){
                let _this=this;
                api.getUserInfo({friend_uid:uni.getStorageSync('access_token')}).then(res=>{
                _this.my_data.id=res.data.id;
                  _this.my_data.nickname=res.data.nickname;
                  var photo=res.data.avatar;
                  if(photo.indexOf('http')<=-1)photo=config.imgUri+photo;
                    _this.my_data.photo=photo;
                    if(res.data.circle_img!=null){
                        this.my_data.circle_img=this.image_cache(res.data.circle_img);
                      
                    }
                    
                })
            },
            
			pullDownRefresh() {
				var  _this = this;
				//初始化数据
            
            
               // this.onGetData();
               
                setTimeout(function(){_this.onGetData();},100);
                
	
				uni.stopPullDownRefresh(); //停止下拉刷新
				/** 取消好友动态提示 */
				_data.data('no_reader_circle',0);
			},
			goDetails(user_id){
				this.navigateTo('../friend/detail?id=' + user_id);
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				});
			},
            socket_push(id,action,userid,issend){
                let data={
                    type:'circle_push',
                    id:id,
                    action:action,
                    fromid:uni.getStorageSync('access_token'),
                    userid:userid,
                    issend:issend
                }
                this.$socket.send(data);
            },
            circle_delete(index){
                let _this = this
               uni.showModal({
               	title: '提示',
               	content: '确定要删除吗？',
               	showCancel: true,
               	cancelText: '取消',
               	confirmText: '删除',
               	success: res => {
               		if(res.confirm) {
                       var id=_this.posts[index].id;
                       api.CircleDelete({id:id}).then(res=>{
                           if(res.data==1){
                               _this.posts.splice(index, 1);
                                 _data.localData('circle_data',_this.posts);
                             _this.socket_push(_this.posts[index].id,'delete',_this.posts[index].userid,0);
                           }else{
                               uni.showModal({
                                   title:'网络连接失败'
                               })
                           }
                       })
               		}
               	} });
            },
            
            comment_delete(index,index1){
                let _this = this
                    var id=_this.posts[index].id;
                console.log(id);
                uni.showModal({
                	title: '提示',
                	content: '确定要删除吗？',
                	showCancel: true,
                	cancelText: '取消',
                	confirmText: '删除',
                	success: res => {
                		if(res.confirm) {
                    
                        api.CommentDelete({id:id,index:index1}).then(res=>{
                            if(res.data==1){
                                  this.socket_push(_this.posts[index].id,'delete',_this.posts[index].userid,0);
                                _this.posts[index].comment.splice(index1, 1);
                                
                                 _data.localData('circle_data',_this.posts);
                             
                            }else{
                                uni.showModal({
                                    title:'网络连接失败'
                                })
                            }
                        })
                		}
                	} });
            },
			like(index) {
              
				let _this = this,
				is_like = (_this.posts[index].islike ? 0 : 1);
                 // console.log( _this.posts[index]);
                var data={id:_this.posts[index].id,userid:uni.getStorageSync('access_token')};
                
                api.setCircleLike(data).then(res=>{
                    var data=res.data;
                    _this.posts[index].islike=data.action;
                    if (data.action) {
                        
                    			_this.posts[index].like.push({
                    				"uid": _this.my_data.id,
                    				"username": _this.my_data.nickname,
                    			});
                    		} else {
                    			let likes = [];
                    			for(let i = 0,j = _this.posts[index].like.length;i < j; i ++){

                    				if(parseInt(_this.posts[index].like[i].uid) ==parseInt(uni.getStorageSync('access_token'))){
                    					_this.posts[index].like.splice(i, 1);
                    					break;
                    				}
                    			}
                    			
                    		}
                            _data.localData('circle_data',_this.posts);
                            this.socket_push(_this.posts[index].id,'like',_this.posts[index].userid,data.action);
                })
                
                
				
			},
			comment(index) {
				if(this.showInput){
					this.showInput = false;
					this.focus = false;
					this.index = '';
				}else{
					this.showInput = true; //调起input框
					this.focus = true;
					this.index = index;
				}
			},
			adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo

			
			},
			reply(index, comment_index) {
				this.is_reply = true; //回复中
				this.showInput = true; //调起input框
				let replyTo = this.posts[index].comment[comment_index].username;
				this.input_placeholder = '回复' + replyTo;
				this.index = index; //post索引
				this.comment_index = comment_index; //评论索引
				this.focus = true;
			},
			blur: function() {
				//this.init_input();
			},
			send_comment: function(message) {
				let _this = this,
				is_posts_obj = this.posts[this.index],
				chat_user_id = is_posts_obj.userid,
				reply = '';
                if(chat_user_id==undefined) chat_user_id=0
				if (this.is_reply) {
					let is_reply_obj = is_posts_obj.comment[this.comment_index];
					chat_user_id = is_reply_obj.uid;
					if(is_posts_obj.userid != chat_user_id){
						reply = '回复' + is_reply_obj.username;
					}
				}
                var data={
						message,
						id: is_posts_obj.id,
						chat_user_id,
                        reply:reply,
                        uid:uni.getStorageSync('access_token')
					}
               
                    
                    api.setCircleComment(data).then(res=>{
                        is_posts_obj.comment.push({
                        	"uid": _this.my_data.id,
                        	'reply': reply,
                        	"username": _this.my_data.nickname,
                        	"content": message
                        });
                        _this.init_input();
                        _data.localData('circle_data',_this.posts);
                        this.socket_push(_this.posts[this.index].id,'comment',_this.posts[this.index].userid,1);
                    })
                
			
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
					images_all.push(this.image_cache(data.content.value[i]));
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
		color: #333333;
		font-size: 32upx;
	}
    .inputbox{
        clear: both;
        width: 100%;
        display: flex;
    }
    .delete{
        display: inline-block;
        padding: 0px 20upx;
        color: #2319dc;
        font-size: 24upx;
    }

</style>
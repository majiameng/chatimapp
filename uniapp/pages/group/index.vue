<template>
	<view class="page page--divider">
  <headerline shownav=true   @tapnav="tapnav" :isback="true"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'
  issearch="false" @clicksearch="clicksearch" :showsearch="showsearch" searchtips='请输入关键字'></headerline>
    
          
	

         
         <view class="lotterybox"  >
             <view  class="grouplist" v-if="!onseach">
                 <block v-for="(m,index) in groupData" :key='index'>
                   <li   @tap="gochat(m)" >
                       <div class="avatar">
                          
                          <image :src="imgshow(m.avatar)"></image>
                          </div>
                           <div class="info">
                                   <div class="title">
                                   {{m.name}}
                                   </div>
                                   <div>
                                       <uni-icons type='person' style="font-size: 16px;font-weight: 700;"></uni-icons>
                                   {{m.people_count}}/{{m.people_max}}人</div>
                                   <div class="tag">{{m.tags}}</div>
                       </div></li>  
                     
                     
                 </block>
                 <view class="loading" v-if="loading && loadstatus=='loading'" >
                 	<view class="spinner">
                 		<view class="rect1"></view>
                 		<view class="rect2"></view>
                 		<view class="rect3"></view>
                 		<view class="rect4"></view>
                 		<view class="rect5"></view>
                 	</view>
                 </view>
                   <view v-if="loading && loadstatus=='nomore'" style="text-align: center;height: 30px;line-height: 30px;" >
                     亲爱的到底了
                     </view>
             </view>
             
             <view class="grouplist" v-else>
                <block v-if="searchData.length>0">
                <block v-for="(m,index) in searchData" :key='index'>
                  <li   @tap="gochat(m)" >
                      <div class="avatar">
                         
                         <image :src="imgshow(m.avatar)"></image>
                         </div>
                          <div class="info">
                                  <div class="title">
                                    <rich-text :nodes="m.name"></rich-text>
                                </div>
                                  <div>
                                      <uni-icons type='person' style="font-size: 16px;font-weight: 700;"></uni-icons>
                                  {{m.people_count}}/{{m.people_max}}人</div>
                                  <div class="tag">
                                       <rich-text :nodes="m.tags"></rich-text>
                                  </div>
                      </div></li>  
                    
                    
                </block>
                
                </block>
                <view v-else-if="subsearch" style="text-align: center;height: 30px;line-height: 30px;margin-top: 10px;color: #666;" >
                  没有搜索到任何相关群组
                  </view>
                   
                 
             </view>

      </view>

	</view>
</template>

<script>

	import api from "../../library/index.js"
import headerline from '../../components/header.vue'
import http from "../../library/http.js"
   import uniIcons from '../../components/uni-icons/uni-icons.vue'
          import tabbar from '../../components/tabbar.vue'
     var windowHeight= uni.getSystemInfoSync().windowHeight;	
  var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
  var contenttop=statusBarHeight+45;
  var conentheight=windowHeight-contenttop;
  var lottHeight= conentheight;
	export default {
   components: {
  uniIcons,
      headerline,
      tabbar
     
      },
		data() {
			return {
                   statusBarHeight: statusBarHeight+ 'px',
                   contenttop:contenttop+'px',
                   contentheight:conentheight+'px',
                    lottHeight:lottHeight+'px',
				newfriendNotify: false,
				showMenu: false,
				initializing: true,
                groupData: uni.getStorageSync('groups_top'),
                searchData:[],
                subsearch:false,
           navitem:['推荐','最新'],
           navselect:0,
           navstyle:"width:50%;left:25%",
           userid:uni.getStorageSync('access_token'),
           page:1,
           act:'top',
           loading:true,
           loadstatus:'loading',
           onseach:false,
           showsearch:false,
          
			}
		},

		methods: {
          tapnav(num){
              this.navselect=num;
              if(num==0) this.act='top';
              else this.act='new'
            this.page=1;
             this.getGroupList();
          },
          
			getGroupList() {
           var postdata={act:this.act,page:this.page};
           var that=this;
           that.loading=true;
              that.loadstatus='loading';
           http.setWait(false).post('group.php?act=group_list',postdata).then(res=>{
             if(res.code==200){
                
                
                   that.loading=false;
              if(that.page==1){
                  this.groupData=res.data;
                 uni.setStorageSync('groups_'+that.act,res.data);
              } 
              else{
                  for(var i=0;i<res.data.length;i++){
                      
                   this.groupData.push(res.data[i]);
                  } 
                  
                  if(res.data.length<10) {
                      that.loading=true;
                      that.loadstatus='nomore';
                  }
              }
          
             }else{
              uni.showToast({
                  title:'网络错误，请稍后再试',
                  icon:'none'
              })     
             }
                            
           
           })
           
    
			},
          imgshow(image_url){
                 if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
                return this.image_cache(image_url)
          },
          gochat(m){
              this.$jump('group.detail', {
              	id: m.id,
              	from:'index'
              });
          }
		,
           gamenextpage(){
               if(!this.onseach){
                   this.page++;
                   this.getGroupList();
               }
         
           },
           clicksearch(e){
               this.onseach=e;
               this.showsearch=e;
           },
           go_search(e){
           var postdata={keyword:e};
           var that=this;
           that.loading=true;
              that.loadstatus='loading';
              that.subsearch=false;
           http.setWait(false).post('group.php?act=group_search',postdata).then(res=>{
             if(res.code==200){
                
                 that.subsearch=true;
                 that.loading=false;
                 that.searchData=[];
                 for(var i=0;i<res.data.length;i++){
                    var item=res.data[i];
                    item.name=item.name.replace(e,'<span style="color: #ff0000">'+e+'</span>');
                   item.tags=item.tags.replace(e,'<span style="color: #ff0000">'+e+'</span>');
                     that.searchData.push(item);
                 }
                 
               
                     
             }else{
              uni.showToast({
                  title:'网络错误，请稍后再试',
                  icon:'none'
              })     
             }
                            
           
           })
           
             console.log(e);  
           },
           
           
		},
		onReachBottom() {
		   this.gamenextpage(); 
		},
		onShow() {
			
			
var userid=parseInt(uni.getStorageSync('access_token'));
     if(userid>0) {
   this.getGroupList();   
       this.$action.setStatusTips();
     }else{
     
         uni.setStorageSync('gourl','/pages/group/index');
        
         this.$jump('login.index');
     }

		},
		onLoad(opts) {
		    if(opts.method>0) this.navselect=opts.method;
		}
	}
</script>

<style lang="scss" scoped>
     @import "@/static/css/group.css";

    .item {
        height: 100upx;
    	border-bottom: 1px solid #F0F0F0;
    	overflow: hidden;
    	padding: $uni-spacing-col-lg 30upx;
    	display: flex;
    	flex-direction: row;
    	justify-content: flex-start;
    	align-items: center;
        background-color: #ffffff;
        border-radius: 20upx;
        
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
    	line-height: 1.25;
    }
    
    .topCont {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    	align-items: center;
    }
    
    .userName {
    	color: $uni-text-color;
    	font-size: 38upx;
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
    	overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
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
    .loading {
    	//loading动画
    	display: flex;
    	justify-content: center;
    padding-bottom: 20px;
    	@keyframes stretchdelay {
    
    		0%,
    		40%,
    		100% {
    			transform: scaleY(0.6);
    		}
    
    		20% {
    			transform: scaleY(1.0);
    		}
    	}
    
    	.spinner {
    		margin: 20upx 0;
    		width: 60upx;
    		height: 25px;
    		display: flex;
    		align-items: center;
    		justify-content: space-between;
    
    		view {
    			background-color: #ff9800;
    			height: 25px;
    			width: 3px;
    			border-radius: 3px;
    			animation: stretchdelay 1.2s infinite ease-in-out;
    		}
    
    		.rect2 {
    			animation-delay: -1.1s;
    		}
    
    		.rect3 {
    			animation-delay: -1.0s;
    		}
    
    		.rect4 {
    			animation-delay: -0.9s;
    		}
    
    		.rect5 {
    			animation-delay: -0.8s;
    		}
    	}
    }
    .lotterybox {
     
        -webkit-overflow-scrolling: touch;
        overflow-x: hidden;
        display: inline-block;
        transition: all .3s;
         transform: translate(0,0);
         width: 100%;
    }
</style>

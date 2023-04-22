<template>
	<view class="page page--divider">
         <view class="menu" :style="{top:menutop}">
             <block v-if='showsearch'>
                 
                 <view class="seacrchitem" >
                    <span class="back"  @tap="showsearch=!showsearch">
                           <uni-icons type='arrowleft' color="#000" style="font-weight: 600;" size="28" class="icons"></uni-icons>
                    </span>
                     <span><input class="input1" id="keyword" :placeholder="searchtips" v-model="keyword" /> </span>
                 
                     <span  @tap="go_search();">
                         <div class="btn"><uni-icons style="font-size: 16px;color:#fff;margin-right:2px;font-weight: 600;" type="search"></uni-icons>搜索</div>
                     </span>
                 
                 </view>
                 
                 
             </block>
             <block v-else>
                 
                 <li v-for="(m,index) in navitem" :key='index' :class="{'active':navselect==index}" @tap="tapnav(index)" >
                     {{m}}
                 </li>
               
             </block>
          
         </view>
        
         <scroll-view class="lotterybox"  :style="{height:lottHeight,top:contenttop}"  scroll-y="true" lower-threshold='80' @scrolltolower="gamenextpage()">
             <view  class="grouplist" v-if="!showsearch">
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
                  没有搜索到任何相关聊天室
                  </view>
                   
                 
             </view>
            
 <!-- #ifdef H5 -->
 <view style="height: 10px;"></view>
           <!-- #endif -->
      </scroll-view>

	</view>
</template>

<script>

	import api from "../library/index.js"

import http from "../library/http.js"
   import uniIcons from '../components/uni-icons/uni-icons.vue'
     
     var windowHeight= uni.getSystemInfoSync().windowHeight;	
  var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    var menutop=statusBarHeight+45;
  var contenttop=menutop+41;
  var conentheight=windowHeight-contenttop;
  
  // #ifndef APP-PLUS
        var conentheight=conentheight - 50;
        // #endif
  var lottHeight= conentheight;
	export default {
   components: {
  uniIcons,

     
      },
		data() {
			return {
                   statusBarHeight: statusBarHeight+ 'px',
                   menutop:menutop+'px',
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
           searchtips:'请输入要搜索的群组名称',
           keyword:''
           
          
			}
		},
          mounted() {
            this.tapnav(0)  
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
     
           go_search(){
               var e=this.keyword;
               if(e==''){
                   uni.showToast({
                       title:"请输入群组关键",
                       icon:'none'
                   })
                   this.searchData=[];
                   return false;
               }
           var postdata={keyword:this.keyword};
          
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
     .menu{
         position: fixed;
         left: 0px;
         width: 100%;
         height: 30px;
          padding: 5px 0px;
          background-color: #fff;
         text-align: center;
         border-bottom: 1px solid #eee;
     }
     .menu  li{
         display: inline-block;
         height: 28px;
         line-height: 28px;
         margin: 0px 10px;
         border:1px #666 solid;
         border-radius: 5px;
         width: 80px;
         text-align: center;
         color:#000000;
         
     }
      .menu  li.active{
          background-color: #2319DC;
           border:1px #2319dc solid;
           color: #fff;
           font-weight: 600;
      }
       .menu  .right{
           position: absolute;
           right: 0px;
           padding-right:5px;
           top:0px;
           padding-top: 5px;;
       }

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
       position: fixed;
       left: 0px;
      width: 100%;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        overflow-x: hidden;
        display: inline-block;
        transition: all .3s;
         transform: translate(0,0);
    }
    
    .seacrchitem{
   
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
            display: table;
        padding-top:0px;
        table-layout: fixed;
    }
    .seacrchitem > span{
        display: table-cell;
        text-align: center;
        vertical-align: top;
    }
    .seacrchitem > span:first-child{
    
        width: 50px;
        padding-top:3px;
    }

    .seacrchitem > span:nth-child(2){
        width: calc(100% - 108px) !important;
        text-align: right;
    }
    .seacrchitem > span:last-child{
        width: 68px;
        padding-right: 10px;
        text-align: left;
    }
    .seacrchitem > span .input1{
        width:calc(100% - 12px);
        height: 28px;
        line-height: 28px;
    
        padding: 0px 5px;
        font-size: 14px;
        
        color: #222;
     
        border-bottom:1px solid #ccc;
        border-right: 0px;
        text-align: left;
        vertical-align: top;
 
    }
      .seacrchitem > span .input1::placeholder{
          color:#999;
          font-size: 12px;
      }
    .seacrchitem > span .btn{
        background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
        background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
        background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
        background: linear-gradient(to bottom right, #3388ff , #2319dc);
        height: 30px;line-height: 30px;
       width: 100%;
        text-align: center;
        padding: 0px 0px;
        display: inline-block;
        color: #fff;
        border: 0px;
        cursor: pointer;

             vertical-align: top;
    }
    
</style>

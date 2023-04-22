<template>
	<view  class="page" >
        
      <scroll-view class="scroll" :style="'height:'+scrollheight+';top:'+top" lower-threshold='50' scroll-y="true" @scrolltolower="scrolltolower">
		<block v-if="user.length>0">
              <view class="more" style="text-align: left;padding-left: 10px;" v-if="type=='all'">人</view>
            <view  v-for="(item, index) in user" :key="index" class="lines"  @tap="user_detail(item)">
                
                <view class="avatar">
                    <image  :src="image_cache(item.avatar)"></image>
                </view>
                <view class="showname">
                    <view>
                 
                      <rich-text :nodes="item.nickname" style="display: inline-block;"></rich-text>
                      <span class='id'>(Id：{{item.id}})    </span> 
                    </view>
                    <view>
                   <image src="../static/img/vip1.png" class="icon" v-if="item.vip>0"></image>
                      
                        <view v-if="item.iskefu==1" class="btn_green">客服</view>
                        <view v-if="item.iskefu==2" class="btn_blue">官方</view>   
                       
                    </view>
                   
                </view>
            </view>
            
            <view class="more"  v-if="user.length>=3 && type=='all'" @tap="showmore('user')">查看更多</view>
        
        </block>
        
        
        <block v-if="group.length>0">
              <view class="more" style="text-align: left;padding-left: 10px;" v-if="type=='all'">群组</view>
            <view  v-for="(item, index) in group" :key="index" class="lines"  @tap="group_detail(item)">
                
                <view class="avatar">
                    <image  :src="image_cache(item.avatar)"></image>
                </view>
                <view class="showname">
                    <view>
                 
                      <rich-text :nodes="item.name" style="display: inline-block;"></rich-text>
                       <span class='id'>(ID：{{item.id}})    </span> 
                    
                    </view>
                    <view>
                  <uni-icons type='person' style="font-size: 16px;font-weight: 700;"></uni-icons>
                  {{item.people_count}}/{{item.people_max}}人
                 
                       
                    </view>
                   
                </view>
            </view>
            
            <view class="more" v-if="group.length>=3  && type=='all'" @tap="showmore('group')">查看更多群组</view>
               </block>
               
           
                <view class="loading" v-if="loading==true" >
                	<view class="spinner">
                		<view class="rect1"></view>
                		<view class="rect2"></view>
                		<view class="rect3"></view>
                		<view class="rect4"></view>
                		<view class="rect5"></view>
                	</view>
                </view>
                </scroll-view>
	</view>
</template>

<script>
      import uniIcons from '../components/uni-icons/uni-icons.vue'
        var windowHeight= uni.getSystemInfoSync().windowHeight;
          var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
          var top=statusBarHeight+50;
        var scrollheight=windowHeight - top ;
        // #ifndef APP-PLUS
         scrollheight=scrollheight - 50;
        // #endif
	export default {
        components:{
           uniIcons 
        },
        props: {
            data: {
                
            },
            type:{
                default:'all'
            },
            keyword:{
                default:''
            },
            loading:{
                default:false
            }
        },
		data() {
			return {
				user:[],
                plan:[],
                group:[],
                plan_status:['未开始','进行中','已完结'],
                scrollheight:scrollheight+'px',
                top:top+'px'
			};
		},
        watch:{
            data(val){
                this.init();
            }
        },
       mounted() {
           
          this.init();
           uni.$once('onReachBottom',function(data){  
                      console.log('触底了！');  
                  })  
       },
   
       methods:{
           init(){
             this.user=this.data.user;
             for(var i=0;i<this.user.length;i++){
                    this.user[i].nickname=this.user[i].nickname.replace(this.keyword,'<span style="color: #ff0000">'+this.keyword+'</span>');
                 
             }
             
               this.plan=this.data.plan;
               for(var i=0;i<this.plan.length;i++){
                
                      this.plan[i].title=this.plan[i].title.replace(this.keyword,'<span style="color: #ff0000">'+this.keyword+'</span>');
                        }
               this.group=this.data.group;
               for(var i=0;i<this.group.length;i++){
                      this.group[i].name=this.group[i].name.replace(this.keyword,'<span style="color: #ff0000">'+this.keyword+'</span>');
                     }
               
           },
           showmore(type){
             this.$emit('showmore',type);  
           },
           user_detail(item){
           
                this.$jump('friend.detail',{id:item.id});
           },
           plan_detail(item){
           
                this.$jump('plan.detail',{id:item.id});
           },
           group_detail(m){
               this.$jump('group.detail', {
               	id: m.id,
               	from:'search'
               });
           },
           
           scrolltolower() {
               console.log(this.type,1)
              if(this.type!='all'){
                  this.$emit('getnext',this.type);
              } 
           },
       }
	}
</script>

<style lang="scss">
   .page{
   font-size: 14px;
       background-color: #FAFAFA;
   } 
   .page .scroll{
       position: fixed;
       left: 0px;
       width: 100%;
       z-index: 1;
   }
    
 .lines{
        padding: 5px 0px;
       
        height: 50px;
        line-height: 50px;
        display: table;
        table-layout: fixed;
        width: calc(100% - 0px);
        background-color: #fff;
        margin-bottom: 10px;
    font-size: 14px;
    }
    .lines .avatar{
        display: table-cell;
        width: 70px;
        text-align: center;
    }
    .lines .avatar  > image{
        height: 50px;
        width: 50px;
        border-radius: 5px;;
        vertical-align: middle;
    }
     .lines .showname {
         text-align:left;
         display: table-cell;
         font-size: 14px;
   
         color: #333;
         line-height: 25px;;
         vertical-align: middle;
          margin: 0px 0px;
          padding: 0px 0px;
            
               }
               
  .lines .id{
      font-size: 12px;
      color: #666;
      margin-left: 5px;
  }  
             .lines .icon{
                   margin: 0px 2px;
                   height: 20px;
                   width: 20px;
                   display: inline-block;
             }
               .btn_yellow{
                   background-color: yellow;
                   color: #000;
                   font-size: 12px;
                   display: inline-block;
                   height:18px;
                   line-height: 18px;
                   padding: 0px 5px;
                   border-radius: 5px;
                   text-align: center;
                    margin: 0px 2px;
               }
               .btn_green{
                   background-color: #0aad6c;
                   color: #fff;font-size: 12px;
                   display: inline-block;
                   height: 18px;
                   line-height: 18px;
                   padding: 0px 5px;
                   border-radius: 5px;
                   text-align: center;
               
                   margin: 0px 2px;
               }
               .btn_blue{
                   background-color: #2319dc;
                   color: #fff;font-size: 12px;
                   display: inline-block;
                   height: 18px;
                   line-height: 18px;
                   padding: 0px 5px;
                   border-radius: 5px;
                   text-align: center;
                margin: 0px 2px;
               }
               
               .btn_grey{
                   background-color: #ddd;
                   color: #000;font-size: 12px;
                   display: inline-block;
                   height: 18px;
                   line-height: 18px;
                   padding: 0px 5px;
                   border-radius: 5px;
                   text-align: center;
                    margin: 0px 2px;
               }
               .nodata{
                   height: 35px;
                   line-height: 35px;
                   color: #666;
                   font-size: 12px;
                   text-align: center;
               }
               
               .more{
                   height: 25px;
                   line-height: 25px;
                   color: #333;
                   font-size: 14px;
                   text-align: center;
               }
               .color-0{
                   color: #666;
               }
               .color-1{
                   color: #0aad6c;
               }
               .color-2{
                   color:#ff6600;
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
</style>

<template>

    <view class="page">
     
     
           <view class="nodata" v-if="list.length<1" >{{opts.nickname}}没有任何直属下级</view>
           <block v-else>
               <view v-for="(m,index) in list" :key='index' class="lists" >
                   <view >
                     <image :src="image_cache(m.avatar)"></image>
                       
                   </view>
                   <view>
                       <view class="title" >{{m.nickname}}
                 <span style="float:right;text-align: right;font-size: 14px;">
                    返点：{{m.rebate}}%
                    <view class="btn_green" v-if="m.isdaili==1">代理</view>
                    <view class="btn_yellow" v-else>用户</view>
                 </span>
                  
                  </view>
                  <view class="info">
                      <span style="color: #666;font-size: 12px;">
                          注册:{{timestampToTime(m.regtime)}}
                      </span>
                       
                       <view v-if="m.isvip==1" class="btn_blue">计划员</view>
                       
                       <span style="float:right;color: #666;font-size: 12px;text-align: right;">
                       
                          <view  class="btn_green" @tap="user_invite(m)">查看下级</view>
                       </span>
                       
                       </view>
                   </view>
                   
                   
               </view>
               <view class="loading" v-if="loading" >
               	<view class="spinner">
               		<view class="rect1"></view>
               		<view class="rect2"></view>
               		<view class="rect3"></view>
               		<view class="rect4"></view>
               		<view class="rect5"></view>
               	</view>
               </view>
               <view class="nodata" v-if="nodate">{{opts.nickname}}共{{list.length}}个直属下级</view>
               <view class="nodata" v-else @tap="getnextpage">加载下一页</view>
           </block>
           
        
           
       </block>
       
 <tabbar></tabbar>
    
    </view>
</template>

<script>
	import http from "../../library/http.js"
    import config from "../../config.js"
          import tabbar from '../../components/tabbar.vue'
        import uniIcons from '../../components/uni-icons/uni-icons.vue'
          var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    export default {
        components:{
           uniIcons,
           tabbar
        },
        data() {
        	return {
                statusBarHeight: statusBarHeight+ 'px',
               
                list:[],
                opts:'',
				user:uni.getStorageSync('userInfo'),
                page:1,
                nodate:false,
                loading:false,
                
              
        	}
        },
        methods: {
        
            user_invite(m){
              uni.navigateTo({
                  url:'user_invite?id='+m.id+'&nickname='+m.nickname
              })  
            },
        
            set_rebate(m){
                if(m.rebate<this.user.rebate - 0.5){
                    var itemlist=[]
                   
                   for(var i=this.user.rebate - 0.5;i>m.rebate;i=i-0.5){
                       itemlist.push(i.toFixed(1)+'%');
                   }
                   var that=this;
                   uni.showActionSheet({
                   	itemList:itemlist,
                   	success: function (res) {
                   	var str=itemlist[res.tapIndex].replace('%','');
                    str=parseFloat(str);
                  
                    http.setWait(false).post('user.php?act=set_rebate',{userid:m.id,rebate:str}).then(res=>{
                      
                      if(res.code==200){
                      that.get_invite();
                      uni.showToast({
                          title:'设置成功',
                          icon:'none'
                      })
                      }
                    }) 
                    
                   }
                    })
                }else{
                    uni.showToast({
                        title:'该用户返点已是最高，无需提升',
                        icon:'none'
                    })
                }
            },
        
            get_invite(){
                http.setWait(false).get('user.php?act=my_invite',{userid:this.opts.id,page:this.page}).then(res=>{
                  
                  if(res.code==200){
               this.loading=false;
               if(res.data.length>0){
                   if(this.page==1){
                     this.list=res.data;
                      uni.setStorageSync('my_invite',this.list);  
                   } 
                   else{
                      this.list.push(...res.data); 
                   }
                   if(res.data.length<10) this.nodate=true;
                   else 
                   this.nodate=false;
               }
               else{
                   this.nodate=true;
               }
                  }
                }) 
            },
            timestampToTime(timestamp) {
                    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var Y = date.getFullYear() ;
                    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
                    var D = date.getDate();
                    var h = date.getHours();
                    var m = date.getMinutes();
                    var s = date.getSeconds();
                    if(D<10) D='0'+D;
                     if(h<10) h='0'+h;
                      if(m<10) m='0'+m;
                       if(s<10) s='0'+s;
                    return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s ;
            },
            open_detail(id){
                uni.navigateTo({
                    url:'../friend/detail?from=invite&id='+id
                })
            },
            getnextpage(){
                //if(this.nodate==false){
                    //this.page++; 
                   // this.get_invite();
                ///s}  
            },
        
         
        },
        onLoad(opts) {
            this.user = uni.getStorageSync('userInfo');
            
              this.opts=opts;
             this.get_invite();
             uni.setNavigationBarTitle({
                 title:opts.nickname+"的直属下级"
             })
        },
        onReachBottom() {
      
        },
        onNavigationBarButtonTap() {
            
        }
    }
</script>

<style lang="scss" scoped>
  @import "@/static/css/user.css";
  .page{
      background-color: #fafafa;
  }

   .nodata{
       height: 40px;
       line-height: 40px;
       text-align: center;
   }
   
   .lists{
       background-color: #fff;
       margin-top: 10px;
       padding: 5px 10px;
       line-height: 25px;
       clear: both;
       display:  inline-block;
       width: calc(100% - 20px);
       height: 50px;
   }
   .lists > view{
     display: inline-block;
        padding-top: 0px;margin-top: 0px;
           vertical-align: top;
   }

   .lists > view:first-child{
       text-align: center;
       width:70px;
   }
   .lists > view:first-child image{
       height: 50px;
       width: 50px;
       vertical-align: top;
       border-radius: 5px;
   }
   .lists > view:last-child{
       text-align: left;
       width: calc(100% - 70px);
     
   }
     .lists > view:last-child .title{
         font-size: 16px;;
        
     }
     .lists > view:last-child .info{
         font-size: 12px;
         color: #666;
     }
     .btn1{
         display: inline-block;
         height: 22px;
         line-height: 22px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         border-radius: 5px;
     }
     
     .btn2{
         display: inline-block;
         height: 28px;
         line-height: 28px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #2319dc;
         border: 1px #2319dc solid;
         color:#fff;
         border-radius: 5px;
         padding: 0px 10px;
         margin: 0px 15px;
     }
     .btn2.delete{
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         color:#222;
          padding: 0px 10px;
     }
      .lists > view.btns{
          height: 30px;line-height: 30px;text-align: center;
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

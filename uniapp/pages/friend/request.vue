<template>
	<view class='page'>
		<headerline   navstyle="left:25%;width:50%;" :reditem='unreadnum' :isback="true"  :shownav="true"  :navitem="navitem"  :navselect="navselect" @tapnav="tapnav" :statusbarheight='statusBarHeight'   :islogo="false" ></headerline>
			
        <block v-if="isloading==false">
            <block v-if="navselect==0">
                <block v-if="friend_lists.length>0">
                  
                  <block  v-for="(m,index) in friend_lists" :key='index'>
                    
                    <view class="lines" style="margin-top: 10px;">
                        <view>
                            <image @tap='openuser(m.user)' :src="image_cache(m.user.avatar)" class="avatar"></image>
                        </view>
                        <view>
                            <view >
                                <span class='nickname' @tap='openuser(m.user)'>{{m.user.nickname}}</span>申请添加您为好友
                                
                                  <view style='float: right;display: inline-block;color: #999;padding-right: 10px;'>{{timestampFormat(m.addtime)}}</view>
                            </view>
                           <scroll-view scroll-y="true" :scroll-top="m.mark.length*20" v-if="m.mark.length>0" style="max-height:32px;">
                               <view v-for="(m1,index1) in m.mark" :key='index1' class="mark">
                                   {{m1}}
                                   
                               </view>
                           </scroll-view>
                            <view  v-if="m.status==0">
                      
                                    <button class="btns ok" @tap="deal_userapply(m.id,1,index)">
                                        <uni-icons type='checkmarkempty' style="color:#FFF"></uni-icons>
                                        同意</button>   
                                    <button class="btns clear" @tap="deal_userapply(m.id,2,index)">
                                        <uni-icons type='closeempty'></uni-icons>拒绝</button>
                            
                                
                            </view>
                            <view v-else style="color:#666;font-size: 14px;">
                               <block v-if="m.status==1">已同意</block>
                                <block v-else>已拒绝</block>
                            </view>
                        </view>
                    </view>  
                      
                  </block>
                  </block>
                <view class="nodata" v-else >
                    暂无好友验证消息
                    
                </view>
                
            </block>
            
            
            <block v-else>
                <block v-if="group_lists.length>0">
                  
                  <block  v-for="(m,index) in group_lists" :key='index'>
                      <view class="times">{{timestampFormat(m.addtime)}}</view>
                    <view class="lines">
                        <view>
                            <image @tap='openuser(m.user)' :src="image_cache(m.user.avatar)" class="avatar"></image>
                        </view>
                        <view>
                            <view >
                                <span class='nickname' @tap='openuser(m.user)'>{{m.user.nickname}}</span>申请加入<span class='nickname' @tap='opengroup(m.group)'>{{m.group.nickname}}</span>
                            </view>
                            <scroll-view scroll-y="true" :scroll-top="m.content1.length*20" v-if="m.content1.length>0" style="max-height:32px;">
                                <view v-for="(m1,index1) in m.content1" :key='index1' class="mark">
                                    {{m1}}
                                    
                                </view>
                            </scroll-view>
                            <view  v-if="m.status==0">
                      
                                    <button class="btns ok" @tap="deal_apply(m.id,1,index)">
                                        <uni-icons type='checkmarkempty' style="color:#FFF"></uni-icons>
                                        同意</button>   
                                    <button class="btns clear" @tap="deal_apply(m.id,2,index)">
                                        <uni-icons type='closeempty'></uni-icons>拒绝</button>
                            
                                
                            </view>
                            <view v-else style="color:#666;font-size: 14px;">
                                <block v-if="m.apply_uid!=userid">其他人</block>
                                <block v-if="m.status==1">已同意</block>
                                <block v-else>已拒绝</block>
                            </view>
                        </view>
                    </view>  
                      
                  </block>
                  </block>
                <view class="nodata" v-else >
                    暂无群组验证消息
                    
                </view>
            </block>
            
        </block>
        
        <view class="loading" v-else style="padding-top: 70px;" >
        	<view class="spinner">
        		<view class="rect1"></view>
        		<view class="rect2"></view>
        		<view class="rect3"></view>
        		<view class="rect4"></view>
        		<view class="rect5"></view>
        	</view>
        </view>
      <layer v-if="showlayer" title="确定要拒绝申请？" placeholder="请输入拒绝理由" isradio=true radiotext="同时设置为黑名单"  btn_ok="确认" @close="showlayer=false;"  @sub="layer_sub" ></layer>
      
	</view>
</template>

<script>
 	import api from "../../library/index.js"
    	import http from "../../library/http.js"
      	import config from "../../config.js"
           import uniIcons from '../../components/uni-icons/uni-icons.vue'
           import headerline from '../../components/header.vue'
            import layer from '../../components/layer.vue'
               var windowHeight= uni.getSystemInfoSync().windowHeight;	
               var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
               var contenttop=statusBarHeight+45;
               var conentheight=windowHeight-contenttop;
               var lottHeight= conentheight-30;
               var lottTop= contenttop + 30;
	export default {
        components: {
        uniIcons,
        headerline,
        layer
        },
		data() {
			return {
                statusBarHeight: statusBarHeight+ 'px',
                contenttop:contenttop+'px',
                contentheight:conentheight+'px',
                 lottHeight:lottHeight+'px',
                 lottTop:lottTop+'px',
                 shownav:true,
                 navitem:['好友','群组'],
                 navselect:0,
				system:uni.getStorageSync('system'),
              
                userid:uni.getStorageSync('access_token'),
                   user:uni.getStorageSync('userInfo'),
                group_lists:uni.getStorageSync('group_applylist'),
                friend_lists:uni.getStorageSync('friend_applylist'),
                isloading:true,
                page:1,
                showlayer:false,
                senddata:{},
                index:0,
                applytype:'friend',
                unreadnum:[0,0],
                num1:0,
                num2:0,
                
			}
		},
		methods: {
          timestampFormat( timestamp ) {
          	let curTimestamp = parseInt(new Date().getTime() / 1000), //当前时间戳
          	timestampDiff = curTimestamp - timestamp, // 参数时间戳与当前时间戳相差秒数
          	curDate = new Date( curTimestamp * 1000 ), // 当前时间日期对象
          	tmDate = new Date( timestamp * 1000 ),  // 参数时间戳转换成的日期对象
          	Y = tmDate.getFullYear(), 
          	m = tmDate.getMonth() + 1, d = tmDate.getDate(),
          	H = tmDate.getHours(), i = tmDate.getMinutes(), 
          	s = tmDate.getSeconds();
          	if ( timestampDiff < 60 ) { // 一分钟以内
          		return "刚刚";
          	} else if( timestampDiff < 3600 ) { // 一小时前之内
          		return Math.floor( timestampDiff / 60 ) + "分钟前";
          	} else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
          		return '今天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
          	} else {
          		var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
          		if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
          			return '昨天 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
          		} else if ( curDate.getFullYear() == Y ) {
          			return  ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
          		} else {
          			return  Y + '年' + ((String(m).length == 1 ? '0' : '') + m) + '月' + ((String(d).length == 1 ? '0' : '') + d) + '日 ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
          		}
          	}
          },
            openuser(m){
                this.$jump('friend.detail',m);
            },
            opengroup(m){
                this.$jump('group.detail',m);
            },
            layer_sub(e){
                
                var data=this.senddata;
               
                if(this.applytype=='group'){
                     data['apply']=e;
                  this.$socket.send(data);
                  this.group_lists[this.index].status=this.senddata.status;
                  this.group_lists[this.index].apply_uid=this.user.id;
                  this.showlayer=false;  
                }
                else
                {
                   this.friend_lists[this.index].status=this.senddata.status;
                    data['apply']=JSON.stringify(e);
                   http.setWait(false).post('user.php?act=handleFriendApply',data).then(res=>{
                     if(res.code==200){
                        this.getFriendData();
                      this.showlayer=false;  
                     }else{
                      uni.showToast({
                          title:'网络错误，请稍后再试',
                          icon:'none'
                      })     
                     }
                                    
                   
                   })  
                              
                    
                    
                }
                
                
            },
            deal_apply(applyid,status,index) {
            if(status==1){
                
                this.senddata={type:'deal_group_apply',userid:this.user.id,applyid:applyid,status:status}
                this.index=index;
                this.$socket.send(this.senddata);
                this.group_lists[this.index].status=this.senddata.status;
                this.group_lists[this.index].apply_uid=this.user.id;
                
            }else{
                this.showlayer=true;
                this.senddata={type:'deal_group_apply',userid:this.user.id,applyid:applyid,status:status}
                this.index=index;
                this.applytype='group';
            }
         
            
                   
                },
                
                deal_userapply(applyid,status,index) {
                    
                    if(status==1){
                        
                        this.friend_lists[index].status=status;
                      
                        http.setWait(false).post('user.php?act=handleFriendApply',{userid:this.user.id,id:applyid,status:status}).then(res=>{
                          if(res.code==200){
                             this.getFriendData();
                         
                          }else{
                           uni.showToast({
                               title:'网络错误，请稍后再试',
                               icon:'none'
                           })     
                          }
                                         
                        
                        })  
                        
                    }
                    else{ 
                    this.showlayer=true;
                    this.senddata={userid:this.user.id,id:applyid,status:status};
                      this.index=index;
                      this.applytype='friend';      
                    }
                       
                     
                    },
            tapnav(e){
               this.navselect=e; 
               this.page=1;
               if(e==1) this.getGroupData();
               else this.getFriendData();
            },
            getFriendData(){
                
                try{
                   if(this.friend_lists.length>0)
                     this.isloading=false;
                    else 
                    this.isloading=true; 
                }catch(e){
                    //TODO handle the exception
                    this.isloading=true; 
                }
        
                
              http.setWait(false).get('user.php?act=getFriendApply',{userid:this.user.id,page:this.page}).then(res=>{
                if(res.code==200){
                  this.isloading=false;
                
                  if(this.page==1){
                     this.friend_lists=res.data;            
                     uni.setStorageSync('friend_applylist',res.data);   
                       var num=0;
                     for(var i=0;i<res.data.length;i++){
                         var item=res.data[i];
                         if(item.status==0){
                             num=1;
                             break;
                         }
                     }
                     this.setunread(0,num); 
                  }
                  else {
                      this.friend_lists.push(...res.data)
                      this.page++;
                  }
                 
                }else{
                 uni.showToast({
                     title:'网络错误，请稍后再试',
                     icon:'none'
                 })     
                }
                               
              
              })  
              
            },
            
            setunread(index,num){
             if(index==0) this.num1=num;
             else this.num2=num;
                
                this.unreadnum.splice(0,2);
                 this.unreadnum.push(this.num1);
                    this.unreadnum.push(this.num2);
                this.$forceUpdate();
            },
            getGroupData(){
                  try{
                     if(this.group_lists.length>0)
                       this.isloading=false;
                      else 
                      this.isloading=true; 
                  }catch(e){
                      //TODO handle the exception
                      this.isloading=true; 
                  }
          
              http.setWait(false).get('group.php?act=applylist',{userid:this.user.id,page:this.page}).then(res=>{
                if(res.code==200){
                  this.isloading=false;
                  if(this.page==1){
                     this.group_lists=res.data;            
                     uni.setStorageSync('group_applylist',res.data); 
                     var num=0;
                     for(var i=0;i<res.data.length;i++){
                         var item=res.data[i];
                         if(item.status==0){
                             num=1;
                             break;
                         }
                     }
                     this.setunread(1,num);
                     
                  }
                  else {
                      this.group_lists.push(...res.data);
                      this.page++;
                  }
                 
                }else{
                 uni.showToast({
                     title:'网络错误，请稍后再试',
                     icon:'none'
                 })     
                }
                               
              
              })  
              
            }
			
		},
        onReachBottom() {
            if(this.page==1)this.page++;
            if(this.navselect==1)this.getGroupData();
            else this.getFriendData();
        },
        
        onPullDownRefresh() {
          this.page=1;  
          if(this.navselect==1)this.getGroupData();
          else this.getFriendData();
        },

        onLoad(opts) {
            if(opts.type=='group') this.navselect=1;
            else this.navselect=0;
            
       
           
              this.getGroupData();
             this.getFriendData();
             this.$socket.on('deal_response', (res) => {
                 
                  uni.showToast({
                      title:res.data.message,
                      icon:'none'
                  })
                   this.page=1;
             if(this.navselect==1) this.getGroupData();
             else this.getFriendData();
                      
                   
               })  
        },
        onUnload() {
            this.$socket.off('deal_response')
        }
    
        
	}
</script>

<style lang="scss">
  @import "@/static/css/group.css";
    .page{
         background-color: #FAFAFA;
    }
    .nodata{
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #666;
    }
    .lines{
      margin: 0px auto;
        background-color: #FFF;
        padding: 5px 0px;
        width: 100%;
        display: table;
        table-layout: fixed;
    }
    .lines > view{
        display: table-cell;
    }
    .lines > view:first-child{
        width: 60px;
        text-align: right;
    }
   .lines > view:nth-child(2){
     
       text-align: left;
       padding-left: 10px;;
       line-height: 20px;
       vertical-align: top;
   } 
      .lines .avatar{
          height: 50px;
          width: 50px;
          border-radius: 5px;
          vertical-align: middle;
      }
      .lines .nickname{
          color: #2319DC;
          display: inline-block;
      }
    .lines .btns{
         padding: 0px 10px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        border-radius: 5px;
        font-size: 14px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      margin-right: 20px;
    }
    .lines .btns.clear{
        border: 1px solid #666;
        color: #666;
        background-color: #fff;

    }
     .lines .btns.ok{
        background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
        background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
        background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
        background: linear-gradient(to bottom right, #3388ff , #2319dc);
        color: #fff;
    }
      .lines .mark{
          color: #666;
          font-size: 12px;;
          height: 16px;
          line-height: 16px;;
      }
      .times{
          height: 25px;
          line-height: 25px;
          text-align: center;
          color: #999;
          font-size: 12px;
      }
   .loading {
   	//loading动画
   	display: flex;
   	justify-content: center;
   
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

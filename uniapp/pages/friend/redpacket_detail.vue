<template>
	<view class="page">
		<image src="../../static/img/repacket-top.png" class="topimg" ></image>
        <view class="topmenu" :style="'top:'+statusBarHeight">
            <uni-icons type='arrowleft' style="font-size: 34px;color: #fff;font-weight: 600;" @tap='goback()' ></uni-icons>
        </view>
        <view class="info">
            <view class="redpick-info">
            	<view class="redpick-info-avatar">
            		<view >
                        <image :src="image_cache(item.sender.avatar)" style="border-radius: 12upx;" />
                       <view class="redpick-info-nickname">{{item.sender.nickname}}</view> 
                          <view class="redpick-info-nickname">的红包</view> 
                     </view>
            		
            	</view>
            	<view class="redpick-info-title" v-if="redpacket.money>0">
                   
                        <view  class="money" style="color:#d0ac72;">
              <span style='font-size: 52px;font-weight: 600;'>{{redpacket.money}}</span>
                         <span style='font-size: 16px;'>元</span>
                        </view>
                     <view style="color:#d0ac72;margin-top: 10px;font-size: 14px;text-decoration: underline;" @tap='gomoneylog'>已存到可用余额</view>
            	</view>
            </view>
            
            
            <scroll-view scroll-x="false" scroll-y="true" class="scrollview">
                <view v-if="redpacket.isgroup==1 && redpacket.status==2" class='tips' >
                    
                    共有<span class='num'>{{userlists.length}}</span>个红包,
                    <span class='num'>{{lasttime}}</span>被抢光
                </view>
                
                <view class="friends" v-for="(m,index) in userlists" :key='index'>
                  
                    <view class="avatar">
                        <image :src="image_cache(m.avatar)"></image>
                    </view>
                    <view class="showname">
                        <view >
                           {{m.nickname}}
                           
                           <span v-if="redpacket.isgroup==1 && redpacket.status==2 && m.money==max" style='color: #FF4400;margin-left: 5px;font-size: 14px;' >最佳</span>
                           <view class="money">{{m.money}}元</view> 
                        </view>
                        
                        <view class="time">
                            
                            {{timestampToTime(m.time)}}
                        </view>
                       
                    </view>
                    
                </view>
                
            </scroll-view>
           
        </view>
	</view>
</template>

<script>
      import uniIcons from '../../components/uni-icons/uni-icons.vue'
      import http from '../../library/http.js'
        var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 20 ;
	export default {
        components:{
          uniIcons  
        },
		data() {
			return {
                statusBarHeight:statusBarHeight+'px',
				msg_id:0,
                storekey:'',
                user:uni.getStorageSync('userInfo'),
                item:{},
                redpacket:'',
                userlists:[],
                max:0,
                timeshow:0,
                info:'',
                lasttime:'',
			};
		},
        methods:{
            goback(){
              uni.navigateBack();  
            },
            gomoneylog(){
             uni.navigateTo({
                 url:'../mine/order'
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
                    return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
            },
            setuserinfo(){
                this.userlists=uni.getStorageSync('redpacket_users_'+this.redpacket.id)?uni.getStorageSync('redpacket_users_'+this.redpacket.id):[];
              this.info=uni.getStorageSync('redpacket_info_'+this.redpacket.id)?uni.getStorageSync('redpacket_info_'+this.redpacket.id):[];
                var endtime=0;
                 for(var i=0;i<this.userlists.length;i++){
                     if(this.userlists[i].money>this.max) this.max=this.userlists[i].money;
                     if(this.userlists[i].time>this.max) endtime=this.userlists[i].time; 
                 }  
        
                  if(this.redpacket.isgroup==1 && this.redpacket.status==2 && endtime>this.info.addtime){
                      var lasttime=endtime-this.info.addtime;
                      if(lasttime<60) this.lasttime=lasttime+'秒';
                      else if(lasttime<3600){
                          this.lasttime=parseInt(lasttime/60)+'分';
                          if(lasttime%60>0) this.lasttime+=lasttime%60+'秒';
                      }else if(lasttime<86400){
                          this.lasttime=parseInt(lasttime/3600)+'小时';
                          lasttime=lasttime%3600;
                         this.lasttime+=parseInt(lasttime/60)+'分';
                         if(lasttime%60>0) this.lasttime+=lasttime%60+'秒';
                      }
                      else{
                        this.lasttime=parseInt(lasttime/86400)+'天';
                         lasttime=lasttime%86400;
                        this.lasttime+=parseInt(lasttime/3600)+'小时';
                         lasttime=lasttime%3600;
                        this.lasttime+=parseInt(lasttime/60)+'分';
                        if(lasttime%60>0) this.lasttime+=lasttime%60+'秒';  
                      }
                  }          
            },
            getinfo(){
                  this.setuserinfo();
                http.setWait(false).get('group.php?act=redpacket_users',{id:this.redpacket.id}).then(res=>{
                              
                   if(res.code==200){

                      uni.setStorageSync('redpacket_users_'+this.redpacket.id,res.data);
                       uni.setStorageSync('redpacket_info_'+this.redpacket.id,res.info);
                      this.setuserinfo();
                   }
                   else{
                       
                        uni.showToast({
                            title:'网络异常，请稍后再试',
                            icon:'none'
                        })
                   }
                
                })
            },
        },
        onLoad(opts) {
            this.msg_id=opts.msg_id;
            this.storekey=opts.storekey;
            var msgkey=this.user.id+"_chat_"+this.storekey;
            var msglist=uni.getStorageSync(msgkey);
            for(var i=0;i<msglist.length;i++){
                var msg=msglist[i];
                if(msg.msg_id==this.msg_id){
                    this.item=msg;
                    this.redpacket=msg.message.content
                    try{
                        this.redpacket=JSON.parse(this.redpacket)
                    }catch(e){
                        //TODO handle the exception
                    }
                    this.getinfo();
                    
                    break;
                }
            }
        }
	}
</script>

<style lang="scss">
.page{
  padding: 0px 0px;
  font-size: 14px;
  background-color: #FFF;
}
.topimg{
    position: fixed;
    width: 100%;
    height: 33vw;
    display: inline-block;
    left: 0px;
    top:0px;
}
.topmenu{
  position: fixed;
  width: calc(100% - 20px);
  height:50px;
  line-height: 50px;
  display: inline-block;
  left: 0px;
 padding-left: 10px;
 z-index: 1;
 text-align: left;
}
.info{
    position: fixed;
    width: 100%;
    height: auto;
    display: inline-block;
    left: 0px;
    top:34vw;
    z-index: 1;
  text-align: center;
}

.scrollview{
    position: fixed;
      width: calc(100% - 20px);
      height: 50vh;
      display: inline-block;
      left: 10px;
      bottom:0px;
      z-index: 2;
    text-align: center;
}
.tips{
    height: 30px;
    line-height: 30px;
    color: #666;
    font-size: 14px;
    padding-left: 10px;
    text-align: left;
}
.tips .num{
    color:#2319dc;
    font-weight: 600;
    margin: 0px 2px;
}

 .friends{
        padding: 5px 0px;
       
        height: 35px;
        line-height: 35px;
        display: table;
        table-layout: fixed;
        width: calc(100% - 0px);
    
    }
    .friends .avatar{
        display: table-cell;
        width: 70px;
        text-align: center;
    }
    .friends .avatar  image{
        height: 50px;
        width: 50px;
        border-radius: 5px;;
        vertical-align: middle;
    }
     .friends .showname {
         text-align:left;
         display: table-cell;
         font-size: 16px;
   
         color: #111;
         line-height: 25px;;
         vertical-align: middle;
          margin: 0px 0px;
          padding: 0px 0px;
                border-bottom: 1upx #EFEFEF solid;
               }
.friends .showname .money{ 
    display: inline-block;float: right;
    
}

 .friends .showname > view{
     width: 100%;
     height: 25px;
     line-height: 25px;
 }
  .friends .showname .time{
      color: #666;
      text-align: left;
      font-size: 12px;
  }
.redpick-info{
	
			width: 100%;
		    display: inline-block;
			color: #000;
			&-avatar{
				display: block;
				align-items: center;
				justify-content: center;
				margin-top: 10px;
				font-size: 28upx;
				image{
					width: 60upx;
					height:60upx;
                    vertical-align: middle;
                    margin-right: 5px;
				}
			}
			&-nickname{
                display: inline-block;
                max-width: 100px;
			max-width: 80%;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
            vertical-align: middle;
			}
			&-title{
				margin-top:10px;
				font-size: 40upx;
			}
		}
		.redpick-over{
            
			max-width: 80%;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			display: block;
            margin: 0px auto;
		}
</style>

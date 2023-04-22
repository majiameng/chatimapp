<template>
	<view>
		<view class="mask">
		<view class="redpick-close" @click="closeMask">
			<image src="../static/close.png" mode="widthFix"></image>
		</view>
			<view class="bag" >
               
                    <view class="redpick-info">
                    	<view class="redpick-info-avatar">
                    		<view >
                                <image :src="image_cache(item.sender.avatar)" style="border-radius: 12upx;" />
                               <view class="redpick-info-nickname">{{item.sender.nickname}}</view> 
                                  <view class="redpick-info-nickname">的红包</view> 
                             </view>
                    		
                    	</view>
                    	<view class="redpick-info-title" >
                            <block v-if="isopen==0">
                               	{{item.message.content.title || '恭喜发财，大吉大利'}} 
                               
                            </block>
                            <block v-else>
                                <view v-if="money>0" class="money">
                                 <span style='font-size: 16px;'>￥</span><span style='font-size: 52px;font-weight: 600;'>{{money}}</span>
                                </view>
                                <block v-else>
                                    手慢了，红包派完了
                                    
                                </block>
                            </block>
                    	
                    	</view>
                    </view>
                    
                    <view v-if="isopen==0" :class="{'stick':true,'opening':opening}" @click="goDetail" >
                    	<span class="rmb">開</span>
                    </view>
                    <view v-else class="error-text" @tap="opendetail()">
                    	看看大家的手气
                    </view>
                    
                 
			</view>
            
            
            
			
		</view>
	</view>
</template>
<script>
    import http from "../library/http.js"
	export default {
		data() {
			return {
				user: uni.getStorageSync('userInfo'),
                status:1,
                opening:false,
                timer:null,
                isopen:false,
                isget:false,
                msg:'',
                money:0,
                id:0,
			}
		},
		props: {
            item:{
                
            },
			
		},
		methods: {
			closeMask() {
				this.$emit('closePick')
			},
			goDetail() {
                
                if(this.user.banknum<1){
                    uni.showModal({
                    	title: '提示',
                    	content: "绑定银行卡后才可以枪红包",
                    	showCancel: true,
                    	cancelText: '关闭',
                    	confirmText: '立即绑定',
                    	success: res => { 
                    		if(res.confirm) {
                              uni.navigateTo({
                                url:"/pages/mine/bank" 
                              })
                    		}
                    	}
                    });  
                    return  false;
                }
				this.opening=true;
                var that=this;
                clearInterval(this.timer)
              this.timer=  setInterval(function(){
                 that.opening=!that.opening;
                    
                },500)
                
          
                var postdata={userid:this.user.id,id:this.id}
                
               http.setWait(false).get('group.php?act=get_redpacket',postdata).then(res=>{
              
                  if(res.code==200){
                      this.getover(res.data);
                  }
                  else{
                      clearInterval(this.timer)
                       uni.showToast({
                           title:'网络异常，请稍后再试',
                           icon:'none'
                       })
                  }
               
               })
			},
            getover(money){
          clearInterval(this.timer)
              this.status=2;
              this.money=money;
              this.isopen=true;
              this.updatemsg(money);
              if(money>0){
                  if( this.item.sender.id!=this.user.id){
                      if(this.item.message.content.isgroup==1){
                          var data = {
                                  user_id: this.item.sender.id,
                                  tip_uid: this.item.sender.id,
                                  type: 'sendtips',
                                  group_id: this.item.group_id,
                                  content: this.user.nickname+'领取了您的红包',
                          
                              };
                      }else{
                          var data = {
                                  fromid: this.user.id,
                                  touid: this.item.sender.id,
                                  tip_uid: this.item.sender.id,
                                  type: 'sendtips',
                                  content: this.user.nickname+'领取了您的红包',
                              };
                      }
                       this.$socket.send(data);
                  }
                  
              }
              
             
           
              
               
            },
            
            updatemsg(money){
                //更新聊天记录中的红包打开状态
                var msgkey=this.user.id+"_chat_"+this.item.cache_key;
                var msglist=uni.getStorageSync(msgkey);
                for(var i=0;i<msglist.length;i++){
                    var msg=msglist[i];
                    if(msg.msg_id==this.item.msg_id){
                        try{
                            msglist[i].message.content=JSON.parse(msglist[i].message.content);
                        }catch(e){
                            //TODO handle the exception
                        }
                       
                       msglist[i].message.content.isopen=1;
                       msglist[i].message.content.money=money;
                       msglist[i].message.content=JSON.stringify(msglist[i].message.content);
                          uni.setStorageSync(msgkey,msglist);
                         this.$emit('fresmsg',msglist[i]);
                       
                        break;
                    }
                }
            },
            opendetail(){
                uni.navigateTo({
                    url:'../friend/redpacket_detail?msg_id='+this.item.msg_id+'&storekey='+this.item.cache_key
                })
            }
            
		},
		created() {
            this.status=this.item.message.content.status;
            this.id=this.item.message.content.id;
            this.money=this.item.message.content.money;
            
            this.isopen=this.item.message.content.isopen;
                
              
       // uni.getStorageSync(this.userid+"_chat_"+this.storeKey)
           
        }
	}
</script>

<style lang="scss" scoped>
	.mask {
		width: 100%;
		height: 100vh;
		overflow: hidden;
		z-index: 10;
		position: fixed;
		background: rgba(255,255,255,0.5);
		left: 0;
		top: 0;
	}

	.bag {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 500upx;
		height: 800upx;
		margin: 0 auto;
		overflow: hidden;
		text-align: center;
		background-color: #F25542;
		border-radius: 12upx;
		transform: translate(-50%,-50%);
	}

	.redpick-close {
		position: absolute;
		left: 50%;
		bottom: 10%;
		width: 60upx;
		height: 60upx;
		z-index: 100;
		transform: translateX(-50%);
		image {
			width: 60upx;
			height: 60upx;
		}
	}

	.bag:before {
		content: '';
		position: absolute;
		top: -20%;
		left: 50%;
		z-index: 0;
		width: 200%;
		height: 100%;
		border-radius: 100%;
		background-color: #F45E4D;
		box-shadow: 0px 4upx 10upx 0px rgba(0,0,0,0.2);
		transform: translateX(-50%);
	}

	.bag .header {
		position: absolute;
		left: 0;
		top: 45%;
		width: 100%;
		text-align: center;
		z-index: 1;
		color: #fff;
		font-size: 80upx;
		opacity: .9;
	}

	.bag .header .subtitle {
		font-size: 32upx;
	}

	.bag .header .num {
		color: #FEED4C;
	}

	.bag .stick {
		position: relative;
		z-index: 1;
		width: 140upx;
		height: 140upx;
		margin: 0 auto;
		margin-top: 112%;
		border-radius: 9999px;
		background-color: #EBCD99;
		box-shadow: 0 0 10upx 0 rgba(0,0,0,0.4);
	}

	.bag .stick .rmb {
		font-size: 70upx;
		line-height: 150upx;
		color: #3B3A37;
	}
	
	.bag .detail-btn {
		display: block;
		font-size: 32upx;
		color: #fff;
	}

	.message {
		font-size: 28upx;
		text-align: center;
		color: #eee;
	}

	.bag .money{
        color:#fff;
    }
	
	.error-text{
		position: absolute;
		left: 50%;
		bottom: 4%;
		transform: translateX(-50%);
		color: #f4e4ae;
		font-size: 28upx;
		width: 100%;
	}


.opening {
		animation: openboom 0.5s;
	}

	@keyframes openboom {

		/*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
		0% {
		 transform: rotateY(0deg);
		}

		
	

		100% {
		 transform: rotateY(360deg);
		}
		}

		.redpick-info{
			position: absolute;
			left:0;
			top: 0;
			width: 100%;
		
			color: #F4E4AE;
			&-avatar{
				display: block;
				align-items: center;
				justify-content: center;
				margin-top: 25%;
				font-size: 28upx;
				image{
					width: 60upx;
					height:60upx;
                    vertical-align: middle;
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
				margin-top:30px;
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

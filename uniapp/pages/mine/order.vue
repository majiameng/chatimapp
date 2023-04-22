<!-- 我的 -->
<template>
	<view class="page">
	<ul class="user_list">
	

	    <li  v-for="(value,index) in orderlist" :key="index">
	
	        <div   >
	
	            <span  style="color: #666; ">类型：</span>{{recharge_type_arr[value.type]}}
	            <span style="float: right;font-weight: 600" >
	                   
	            <span style="color:#F73E54" v-if="value.money>0">+{{value.money}}元</span>
	              
	            <span style="color:green" v-else>{{value.money}}元</span>
	
	           
	
	            </span>
	
	
	        </div>
	        <div style="color: #666; ">
	          时间：{{$action.timestampToTime(value['time'])}}
	
	        </div>
	
	        <div  style="color: #666; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
	            说明：{{value.content}}
	        </div>
	
	    </li>

	</ul>

    
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
</template>

<script>

    import http from "../../library/http.js"
   
    export default {
		data(){
			return {
	         recharge_type_arr:{recharge:"充值",plat:'提现',yongjin:'佣金',reward:'打赏',sign:'签到',task:'任务','redpacket':'红包','buy':'消费'},
             userid:uni.getStorageSync('access_token'),
             page:1,
             type:'',
             loading:true,
             loadstatus:'loading',
             orderlist:uni.getStorageSync('orderlist'),
			}
		},
		onShow() {
			this.getList()
		},
		methods:{
			getList(){
                this.loading=true;
              
				http.setWait(false).post('user.php?act=orderlist',{page:this.page,userid:this.userid}).then(res=>{
				    
                    this.loading=false;
                    
                    if(this.page==1){
                                 uni.setStorageSync('orderlist',this.orderlist);
                                 this.orderlist= res.data;
                    }
           
                    else{
                
                            for(var i=0;i<res.data.length;i++){
                                
                             this.orderlist.push(res.data[i]);
                            } 
                           
                                if(res.data.length<20) {
                                    this.loading=true;
                                    this.loadstatus='nomore';
                                }
                                                       
                            
                          
                    }
    
				})
				
			}
		},
		onReachBottom() {
			this.page++;
            this.getList();
		}
    }
</script>

<style lang="scss" scoped>
    ul,li,table,td,th{
        margin: 0px 0px;
        padding: 0px 0px;
    }
.user_list{
    display: inline-block;
    width:100%;
    height: auto;
    line-height: 25px;

}
.user_list li{
     background-color: #fff;
    line-height: 25px;
    width: calc(100% - 20px);
    padding: 5px 10px;
    border-bottom: 1px #ddd dashed;
       border-top: 1px #ddd dashed;
    display: inline-block;
  margin-top: 10px;
}

.user_list li > div{
    display: inline-block;
    width: 100%;
    height: 25px;
    line-height: 25px;
    text-align: left;
}



	.page{
	    background-color: #fafafa;
        font-size: 14px;
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

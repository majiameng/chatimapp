<!-- 钱包 -->
<template>
	<view class="page page--viewider">
		<view class="widget">
			<view class="moneybox widget-inner">
            <view class="balance1">
            	<image class="moneyimage" src="../../static/money/money.png" alt="">
            </view>    
            
            <view class="balance2">
            	我的余额
            </view>   
                
				<view class="moneys">
                <view class="rmb">￥</view>
                {{user.money||0.00}}
                </view>
				<view class="balance" @click="$jump('mine.order')">
					查看账单
				</view>
			</view>
			<view class="widget-inner1">
				<view class="submitBtn btn btn-primary" @click="$jump('mine.recharge')">充值</view>
                <view class="submitBtn btn btn-error" @click="cash()">提现</view>
			</view>
		</view>
	</view>
</template>

<script>
    import {mapState} from 'vuex'
	import http from '../../library/http.js'
	export default {
		data(){
			return{
				user:uni.getStorageSync('userInfo')
			}
		},
        methods:{
            getuserinfo(){
                var postdata={
                         	id: uni.getStorageSync('access_token')
                            };
                http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
                         this.user=res.data;
                         uni.setStorageSync('userInfo',this.user)
                         })
                     
            },
            cash(){
                
              if(this.user.banknum>0){
                    this.$jump('mine.cash',{});
              }  
              else{
                 uni.showModal({
                 	title: '提示',
                 	content: "请先绑定银行卡，才能申请提现",
                 	showCancel: true,
                 	cancelText: '关闭',
                 	confirmText: '绑定银行卡',
                 	success: res => { 
                 		if(res.confirm) {
                           uni.navigateTo({
                             url:"/pages/mine/bank" 
                           })
                 		}
                 	}
                 });  
              }
            },
        },
        
		onShow() {
			this.getuserinfo();
		}
	}
</script>

<style scoped>
	.page{
		overflow: hidden;
	}
	.moneyIcon{
        width: 0.75rem;
		height: 0.75rem;
        align-items: center;
		margin-right: 0.3125rem;
	}
	.widget-inner {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: inherit;
	}
    .balance1{
        display: flex;
        align-items: center;
   
    
    	margin-bottom: 1rem;
  
    }
    .balance2{
        display: flex;
        align-items: center;
    
        font-size: 14px;
        margin-top: 1rem;
       
      
    }
    .moneyimage{
        width: 4rem;
        height: 4rem;
        align-items: center;
        
    }
	.moneybox {
		padding: 120upx 20upx;
		text-align: center;
		background-color: inherit;
	}
	.moneys{
		color: #333333;
		font-size: 2.8rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
           font-weight: 600;
           line-height: 3.2rem;
           height: 3.2rem;
	}
    .moneys .rmb{
        font-size: 1.6rem;
        margin-right: 5px;
    
        
    }
    
    
	.balance{
        display: flex;
        align-items: center;
		color: #FF7600;
		font-size: 14px;
		margin-top: 5px;
		line-height: 20px;
	}
    .widget-inner1 {
    	display: flex;
    	flex-direction: row;
    	justify-content: center;
    	align-items: center;
    	background-color: inherit;
    }
	.submitBtn{
		width: 38%;
       justify-content: center;
       align-items: center;
       margin-left: 5%;
       color: #1aae61;
       background-color:#f2f2f2 ;
       height: 40px;
       line-height: 40px;
       border-radius: 5px;
       padding: 0px 0px !important;
       
	}
    .btn-primary{
        background-color: #07c160;
        color: #fff;
    }
	.withdraw{
		width: 80%;	
	}
</style>

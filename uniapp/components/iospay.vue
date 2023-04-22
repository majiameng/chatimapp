<template>
	<view>
		
	</view>
</template>

<script>
    import http from "../library/http.js"
	export default {
        props:{
          type:{
              default:'recharge'
          },
          money_select:{
              default:0
          },
          money:{
              default:0
          }
           
        },
		data() {
			return {
				iapChannel:null,
				productId:'vip_month',//默认苹果内购商品ID
				productIds: ['vip_month'],
                user:uni.getStorageSync('userInfo'),
                system:uni.getStorageSync('system'),
			};
		},
        mounted() {
           
            this.plusReady();
        },
        methods:{
            errorMsg(title){
                uni.showToast({
                    icon:'none',
                    title:title
                })
                this.cancel_pay();
            },
            cancel_pay(){
              this.$emit('cancel_pay',false);  
            },
            plusReady() { 
                
                if(this.type=='recharge'){
                   this.productIds=this.system.iospay_recharge.split('|');
                   
                }else{
                   this.productIds=this.system.iospay_vip.split('|');
                }
                this.productId=this.productIds[this.money_select];
                  // console.log(this.productId);        
        
                var that=this;
               plus.payment.getChannels((channels) => {
                        for (var i in channels) {
                            var channel = channels[i];
                            //苹果支付
                            if (channel.id === 'appleiap') {
                                this.iapChannel = channel;
                                this.requestOrder();//关键
                            }
                        }
                        if(!this.iapChannel){
                            that.errorMsg('未获取到ios内购通道')
                        }
                        else{
                            var that1=that;
                           // setTimeout(function(){ that1.pay_start();},300)
                           
                        }
                       // console.log(this.iapChannel);
            
                    }, (error) => {
                        that.errorMsg('iOS内购通道获取失败')
            
                    });  
                        }  ,
                        
             requestOrder() {
                          uni.showLoading({
                                 title:'正在请求支付通道...'
                              })
          
                         this.iapChannel.requestOrder(this.productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
                              uni.hideLoading();
                                 this.pay_start()
                         }, (e) => {
                          uni.hideLoading();
                        
                           this.errorMsg('支付通道请求失败')
                      });
                        
                     },
                        
                                
                  pay_start(){
                      let that = this;
                         uni.showLoading({
                              title: '正在调起支付...'
                           });
                      uni.requestPayment({
                           provider:'appleiap',
                           orderInfo:{
                               productid: that.productId,
                               username: that.user.id 
                            },
                            success: (e) => {
                                 this.pay_ok(e);
                                   },
                            fail: (e) => {
                                  uni.hideLoading();
                                this.errorMsg('支付失败，请重试')
                                },
                            complete: (e) => {
                                     uni.hideLoading();
                                   }
                                   
                                  })

                                },
                                
                 pay_ok(e){
                 
                     var postdata={type:this.type,money:this.money,userid:this.user.id,money_select:this.money_select}
                                                          
                     http.setWait(false).post('pay.php?act=iospay',postdata).then(res=>{
                        uni.showToast({
                            icon:'none',
                            title:res.message
                        })
                            this.getuserinfo();
                        if(this.type=='recharge'){
                           uni.showModal({
                           	title: '提示',
                           	content: "充值已到账",
                           	showCancel: true,
                           	cancelText: '关闭',
                           	confirmText: '查看账单',
                           	success: res => { 
                           		if(res.confirm) {
                                     uni.redirectTo({
                                       url:"/pages/mine/order" 
                                     })
                           		}else{
                                   this.cancel_pay();  
                                   }
                           	}
                           });  
                        }
                        else{
                            setTimeout(function(){
                            uni.navigateBack();       
                            },800)
                         
                        }
                       
                         
                          
                     })
                  
                 },
                 getuserinfo(){
                     var postdata={
                              	id: uni.getStorageSync('access_token')
                                 };
                     http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
                              this.user=res.data;
                              uni.setStorageSync('userInfo',this.user)
                              })
                          
                 },
                                
                                
        }
	}
</script>

<style lang="scss">


</style>

<template>
	<view class="page">
        
       
   
    
     
	<ul class="profile"  v-if="user.vip>0" >
	     <li>VIP类型：</li>
	     
	     <li>
	      <block v-if="user.vip==3">团队VIP</block>
          <block v-else>个人VIP</block>
	          
	     </li>
	</ul>
    <ul class="profile"  v-if="user.vip>0" >
         <li>当前VIP：</li>
         
         <li>
           <span style="color:#666"> {{timestampToTime(user.vip_time)}}</span>  到期
              
         </li>
    </ul>
    
     <block v-if="user.isdaili==1  && user.vip<=1">
           
           <ul class="profile">
                <li>购买类型：</li>
                
                <li>
                  <radio :checked="type==0" @tap="change_tab(0)">
                      <block v-if="user.vip>0">续费</block><block v-else>个人</block>VIP
                  </radio>
                     <radio :checked="type==1" @tap="change_tab(1)" style="margin-left: 20px;">
                         <block v-if="user.vip>0">升级为团队</block><block v-else>团队</block>VIP
                     </radio>
                        
                </li>
           </ul>
        
        </block>
        
        <ul class="profile" >
             <li>购买时长：</li>
             
             <li>
               <view :class="{'money':true,'active':buytime==1}" @tap="set_time(1)">一月</view>
               <view :class="{'money':true,'active':buytime==12}" @tap="set_time(12)">一年</view>   
             </li>
        </ul>
        <ul class="profile" >
             <li>需要支付：</li>
             
             <li>
                <view style="color: #FF2600;font-size: 16px;font-weight: 600;">
                    {{money}}
                    元
                    
                </view>
                  
             </li>
        </ul>
        <view style="margin:15px auto;display:block;width: 80%;">
        
        
            <button class="button1" @tap="click_pay()">确认支付</button>
        
        
        </view>
        
        <view style="margin-top:30px auto;display:block;width: 100%;text-align: center;color: #666;">
            注：开通团队版vip可免费给<span style='color: #2319DC;'>{{system.vip1_max}}</span>个下级开通个人版vip
        </view>
        
        
        <view  @tap="vipinfo" style="margin:15px auto;display:block;width: 80%;text-align: center;color: #2319DC;text-decoration: underline;">
        
        查看VIP特权介绍
          
        </view>
             <payment v-if="showpay" :getmoney="money" title="确认支付" type="vip" :payinfo="payinfo" :fix="fix"  @close="showpay=false;" @payresult="payresult"></payment>
             <iospay v-if="submit_iospay" type="vip" :money_select="money_select" :money="money" @cancel_pay="submit_iospay=false;"></iospay>           
	</view>
</template>

<script>
    import payment from '../../components/payment.vue'
          import iospay from "../../components/iospay.vue"
	export default {
        components:{
          payment,
          iospay
        },
        computed:{
         
        },
		data() {
			return {
				system:uni.getStorageSync('system'),
                user:uni.getStorageSync('userInfo'),
                buytime:12,
                showpay:false,
                payinfo:{},
                fix:true,
                type:0,
                money:0,
                money_select:0,
                is_iospay:false,
                submit_iospay:false,
			};
		},
        methods:{
            
            set_time(num){
                this.buytime=num;
                var vip=this.user.vip;
                var type=this.type;
                var buytime=this.buytime;
                var money=0;
                if(vip==0){
                        if(type==0){
                            if(buytime==1)
                            {
                                money=this.system.vip_month;
                            }else{
                                money=this.system.vip_year;
                            }
                        }else{
                            if(buytime==1)
                            {
                                money=this.system.vip1_month;
                            }else{
                                money=this.system.vip1_year
                            }
                        }
                       
                
                    }
                    else if(vip==1){
                        if(type==0){
                          if(buytime==1)
                          {
                              money=this.system.vip_month;
                          }else{
                              money=this.system.vip_year;
                          }
                        }else{
                            var lasttime=this.user.vip_lasttime;
                            if(lasttime>30){
                                var  lastmoney=parseInt(lasttime*this.system.vip_year/365);
                            }
                            else {
                              var   lastmoney=parseInt(lasttime*this.system.vip_month/30);
                            }
                
                
                            if(lastmoney>this.system.vip_month && buytime==1){
                                buytime=12;
                                this.buytime=12;
                            }
                            if(buytime==1)
                            {
                                money=parseInt(this.system.vip1_month-lastmoney);
                            }else{
                                money=parseInt(this.system.vip1_year-lastmoney);
                            }
                        }
                      
                    }
                    else{
                      if(buytime==1)
                      {
                          money=this.system.vip1_month;
                      }else{
                          money=this.system.vip1_year
                      }
                    }
                    
                    // #ifdef APP-PLUS
                                
                    if(plus.os.name=='iOS' && this.system.iosvip==1) {
                       if(type==0){
                           if(buytime==1)
                           {
                               money=this.system.vip_month;
                           }else{
                               money=this.system.vip_year;
                           }
                       }else{
                         if(buytime==1)
                         {
                             money=this.system.vip1_month;
                         }else{
                             money=this.system.vip1_year
                         }
                       }
                    }
                    
                    //#endif
                    
                this.money= money;
                if(type==0){
                    if(buytime==1) this.money_select=0;
                    else this.money_select=1;
                }else{
                   if(buytime==1) this.money_select=2;
                   else this.money_select=3; 
                }
                
            },
           change_tab(num) {
            
            
              this.type=num;
              this.set_time(this.buytime);
            },
            vipinfo(){
               uni.navigateTo({
                   url:'vipinfo'
               }) 
            },
            click_pay(){
                
             // #ifdef APP-PLUS
             if( plus.os.name=='iOS' && this.system.iosvip==1) {
         this.is_iospay=true;
         this.submit_iospay=true;
         return false;
             }
             // #endif
                    
              
                
                if(parseFloat(this.money)>parseFloat(this.user.money1)){
                   uni.showModal({
                   	title: '可用余额不足',
                   	content: "您的可用余额不足，请先去充值！",
                   	showCancel: true,
                   	cancelText: '取消',
                   	confirmText: '去充值',
                   	success: res => {
                         
                   		if(res.confirm) {
                             uni.redirectTo({
                               url:"/pages/mine/recharge"  
                             })
                   		}
                   	}
                   });
                    return false;
                }
                this.showpay=true;
                this.payinfo={time:this.buytime,userid:this.user.id,money:this.money,viptype:this.type}
            },
            payresult(e){
                
                uni.navigateBack();
              // uni.reLaunch({
              //     url:'index'
              // })
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
                    return Y+'年'+M+'月'+D+'日';
            }
        },
        onLoad(opts) {
            if(this.user.vip>0){
                uni.setNavigationBarTitle({
                    title:'VIP续费'
                })
            }
            
            if(opts.type==1 && this.user.vip<3) this.change_tab(1);
            if(this.user.vip==3) this.type=1;
            this.set_time(12);
            
        }
	}
</script>

<style lang="scss" scoped>
  @import "@/static/css/user.css";
  .page{
      background-color: #fafafa;
  }
  .profile,.login-lines1{
      background-color: #fff;
      margin: 10px auto;
      width: 100%;
     vertical-align: middle; 
  }
  .profile li{
      vertical-align: middle;
  }
  .profile li:first-child{
      width:120px
  }
  .profile li:last-child{
      width:calc(100% - 130px)
  }
  
  .money{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-right: 10px;
      text-align: center;
      border: 1px #ccc solid;
      border-radius: 5px;
      color: #666;
      font-size: 14px;
      width: 70px;
  }
  .money.active{
      background-color: #2319DC;
      color: #FFFFFF;
        border: 1px #2319DC solid;
        font-weight: 600;
  }
</style>

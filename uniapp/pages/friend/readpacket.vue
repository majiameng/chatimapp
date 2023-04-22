<template>
	<view class="page">
        <view class="line">
            <view class="left">
              <view class="pin"  v-if="isgroup==1 && type==1">拼</view>  {{money_title}}
            </view>
        <view class="right">
            <input class="input" type="digit" v-if="money>0" v-model="money" maxlength="5"/>
                    <input class="input" type="digit" v-else placeholder="0.00" @input="money=$event.detail.value" />
            元
            
        </view>            
        </view>
        
        
        <block v-if="isgroup==1">
            <view class="tips">
                <block v-if="type==1">
                    当前为拼手气红包，<span class='text' @tap="change_type(2)">改为普通红包</span>
                </block>
                
                <block v-else>
                    当前为普通红包，<span class='text'  @tap="change_type(1)">改为拼手气红包</span>
                </block>
                
            </view>
            
            <view class="line">
                <view class="left">
                    红包个数
                </view>
            <view class="right">
                <input class="input" type="number" v-if="num"  v-model="num" @input="listen_num($event.detail.value)" maxlength="3" />
                 <input class="input" type="number"  v-else placeholder="填写个数" @input="listen_num($event.detail.value)"  />个
                
            </view>            
            </view>
            <view class="tips" style="color: #666;">
                   本群共<span class='text'>{{group.people_count}}</span>人
            </view>
        </block>
       
        
        <view class="line">
           
            <input class="input1" :placeholder="system.redpacket_title" v-model="title"/>
                 
        </view>
		
        <view class="money_show">
            <view class="icon">￥</view>
            <view class="title">{{moneytotal}}</view>
        </view>
        
        <view :class="{'sendbtn':true,'active':issend}" @tap='subsend()'>塞进红包</view>
        
        <view class="bottom">
            未领取的红包，将在{{system.redpacket_backtime}}小时退回到您的账户
        </view>
        <payment v-if="showpay" @payresult='payresult' :payinfo="payinfo" title="支付" :getmoney="moneytotal" :fix='fix' type="redpacket"  :id="id" @close="showpay=false;"></payment>
        
	</view>
</template>

<script>
          import payment from '../../components/payment.vue'
	export default {
        components: {
            payment,
         
        },
		data() {
			return {
			   isgroup:0,	
                id:0,
                money_title:'总金额',
                type:1,
                money:'0.00',
                num:0,
                title:'',
                group:'',
                system:uni.getStorageSync('system'),
                user:uni.getStorageSync('userInfo'),
                showpay:false,
                payinfo:{},
                fix:true
			}
    
		},
        computed:{
            moneytotal(){
             if(this.type==1) var res = this.money;
                else var res = this.money*this.num;
       
                if(res>this.system.redpacket_min) return parseFloat(res).toFixed(2);
                else  return '0.00'
            },
            issend(){
                if(this.moneytotal>0  && this.num>0) return true;
                else return false;
            }
        },
        methods:{
            listen_num(v){
        
              if(v>0 && parseInt(v)<this.group.people_count) this.num=parseInt(v); 
              else this.num=1;
           
              
            },
            change_type(type){
                this.type=type;
                if(type==1) this.money_title='总金额';
                else this.money_title='单个金额'
            },
            payresult(e){
              if(e>0){
                  
                  var mid ='m' +Math.random().toString(36).substring(2);
                  var sendData={title:this.payinfo.title,status:1,id:e,isgroup:this.isgroup,type:this.type,isopen:0};
                  if(this.isgroup==1){
                      var data = {
                          userid: this.user.id,
                          group_id: this.id,
                          type: 'group',
                          msgtype: 'redpacket',
                          content: sendData,
                          mid: mid
                      };
                  }else{
                     var data = {
                         userid: this.user.id,
                         friend_uid: this.id,
                         type: 'chat',
                         msgtype: 'redpacket',
                         content: sendData,
                         mid: mid
                     }; 
                  }
                 this.$socket.send(data);   
                
                 setTimeout(function(){
                     uni.navigateBack();
                 },100)
              }
              else{
                  uni.showToast({
                      title:'支付发生错误',
                      icon:'none'
                  })
                
              }
              
               
               this.showpay=false; 
            },
            subsend(){
                
                if(!this.issend) return false;
                if(parseFloat(this.money)<0.01){
                    uni.showToast({
                        title:'请输入红包金额',
                        icon:'none'
                    })
                    return false;
                }
                if(parseInt(this.num)<1){
                    uni.showToast({
                        title:'请输入红包个数',
                        icon:'none'
                    })
                    return false;
                }
                if(parseFloat(this.money)/parseInt(this.num)<0.01){
                    uni.showToast({
                        title:'红包不够分了！',
                        icon:'none'
                    })
                    return false;
                }
                if(this.isgroup==1 &&  parseInt(this.num) > parseInt(this.group.people_count)){
                    uni.showToast({
                        title:'红包个数不能大于群总人数',
                        icon:'none'
                    })
                    return false;
                }
                if(parseFloat(this.moneytotal)<parseFloat(this.system.redpacket_min) || parseFloat(this.moneytotal)>parseFloat(this.system.redpacket_max)){
                    uni.showToast({
                        title:'红包金额范围：'+this.system.redpacket_min+'-'+this.system.redpacket_max+'元',
                        icon:'none'
                    })
                    return false;
                }
                if(parseFloat(this.moneytotal)>parseFloat(this.user.money1)){
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
                if(this.title) var title=this.title;
                else var title=this.system.redpacket_title;
                this.payinfo={isgroup:this.isgroup,type:this.type,permoney:this.money,num:this.num,title:title,chatid:this.id,summoney:this.moneytotal}
                this.showpay=true;
               
                
            },
        },
        onLoad(opts){
             this.id=opts.id;
             this.isgroup=opts.isgroup;
             if(this.isgroup==0){
                 this.type=2;
                 this.num=1;
             }
               else{
                    this.group = uni.getStorageSync('group_'+this.id);
                    
               }
           }
        
	}
</script>

<style lang="scss">
view{
    padding: 0px 0px;
    margin: 0px 0px;
}
.page{
    background-color: #FAFAFA;
    font-size: 14px;;
    padding-top: 1px;
}
.page .tips{
    height: 22px;
    line-height: 22px;
    text-align: left;
    font-size: 12px;
    padding: 0px 10px;
    
}
.page .tips .text{
    display: inline-block;
    color: #c69848;
}
.page .line{
    background-color: #FFFFFF;
    margin-top: 15px;
    height: 50px;
    line-height: 50px;
    padding: 0px 10px;;
}
.page .line .left{
    width: 100px;
    display: inline-block;
    text-align: left;
    vertical-align: top;
}
.page .line .right{
    width: calc(100% - 100px);
     vertical-align: top;
    display: inline-block;
    text-align: right;
}
.page .line .right .input{
    height: 40px;
    line-height: 40px;
    width: calc(100% - 30px);
    padding: 0px 5px;
    border: 0px;
    text-align: right;
    display: inline-block;
    vertical-align: middle;
}
.page .line .input1{
    height: 40px;
    line-height: 40px;
    width: calc(100% - 10px);
    padding: 0px 5px;
    border: 0px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
}

.pin{
    height: 18px;
    width: 18px;line-height: 18px;
    text-align: center;
    color:#FFF;
    background-color: #c69848;
    border-radius: 3px;
    display: inline-block;
    margin-right: 5px;
}

.money_show{
    margin-top: 15px;
    height: 50px;
    line-height: 50px;
    padding: 0px 10px;;
    text-align: center;
    
}
.money_show .icon{
    font-size: 14px;
    color: #333;
    display: inline-block;
}
.money_show .title{
    font-size: 34px;
    font-weight: 700;
    color: #000;
     display: inline-block;
}

.sendbtn{
   height: 40px;
   line-height: 40px; 
   width: 240px;
   display: block;
   margin: 15px auto;
   border: 0px;
   color:#fff;
   background-color:#e1e1e1;
   font-size:16px;
   font-weight:600;
   text-align:center;
   border-radius: 5px;
}
.sendbtn.active{
    background-color: #2319DC;
}
.bottom{
    height: 30px;
    line-height: 30px;
    color: #666;
    text-align: center;
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
}
</style>

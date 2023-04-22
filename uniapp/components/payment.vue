<template>
	<view class="popup">
     
		<view class="box">
                  <view class="title" v-if="title">{{title}}</view>
            <block v-if="step==0" >
          
                    <view class="group_detail">
                      <ul class="profile" style="text-align:center;line-height: 50px;height: 50px;vertical-align: middle;">
                   
                                <span style="font-size: 20px;vertical-align: middle;">￥</span>
                                <input type="digit" class="input1" :focus="false0"  v-model="money" placeholder="输入金额">
                        </ul>
                        <ul class="profile" id="money_list" style="line-height: 30px;height: 30px;text-align: center;padding-top: 5px;" >
                    <block v-for="(m,index) in money_arr" :key='index'>
                        <span :class="{'money':true,'active':m==money}" @tap="money=m" >
                          {{m}}元
                        </span>
                        
                    </block>
                     
                        </ul>
                     
                       
                    </view>
                    <view style="padding: 10px 10px;height: 30px;text-align: center;margin-top: 10px;">
                        <button class="layer_btns cancel"  @tap="click_close()" style="margin-right: 15px;">
                            <uni-icons type='close' style="font-size: 14px;margin-right: 5px;color: #333;font-weight: 600;"></uni-icons>
                            关闭</button>
                         <button class="layer_btns ok" @tap="click_next()">
                                <uni-icons type='checkbox' style="font-size: 14px;color: #fff;margin-right: 5px;"></uni-icons>下一步
                         </button>
                    </view>
                
                
                
            </block>
            
            <block v-else>
                <view  style="text-align:center;line-height: 40px;height:40px;vertical-align: bottom;">
                                   
                          <span style="font-size: 16px;vertical-align: bottom;">￥</span>
                      <span style="font-size:30px;vertical-align: bottom;font-weight: 600;">{{money}}</span>
                  </view>
                <view class="payMent-input">
                	<input maxlength="6" class="payMent-input-passInput" type="digit" @input="passInputTwo" v-model="pwdPass" :focus="focus" />
                	<view class="payMent-input-item ">
                		<view>
                			<block v-if="passInputLenght != 0 && passInputLenght <=6" >·</block>
                		</view>
                		<view >
                			<block v-if="passInputLenght >= 2 && passInputLenght <=6" >·</block>
                		</view>
                		<view >
                			<block v-if="passInputLenght >= 3 && passInputLenght <=6" >·</block>
                		</view>
                		<view >
                			<block v-if="passInputLenght >= 4 && passInputLenght <=6" >·</block>
                		</view>
                		<view >
                			<block v-if="passInputLenght >= 5 && passInputLenght <=6" >·</block>
                		</view>
                		<view style="border-right: 0px;">
                			<block v-if="passInputLenght == 6" >·</block>
                		</view>
                	</view>
      </view>
            </block>
		<image src="../static/img/closebtn.png" class="close-btn"  @tap="click_close()"></image>
	</view>
	</view>
</template>

<script>
            import uniIcons from './uni-icons/uni-icons.vue'
	import http from "../library/http.js"
	export default {
		components: {
			
		    uniIcons,
		
		},
        props: {
           getmoney:{
             
           },
           fix:{
               default:false
           },
           title:{
               default:'支付'
           },
           type:{
               default:'reward',
              
           },
           id:{
               default:0
           },
           payinfo:{
               default:{}
           }
           
           
        },
		data() {
			return {
			  step:0,
              money:10,
              money_arr:[5,10,50,100],
              focus:false,
              focus0:false,
            user: uni.getStorageSync('userInfo'),
             passInputLenght: '',
             pwdPassCw: false ,
             
             pwdPass:'',
             pwd:''
              
                 
			};
		},
		methods: {
            passInputTwo: function(e) {
            		this.passInputLenght = e.detail.value.length;
                    this.pwd= e.detail.value;
                    
            		// #ifdef APP-PLUS
            		if (e.detail.value.length == 6) {
            			plus.key.hideSoftKeybord();
            		}
            	// #endif
                
                if (e.detail.value.length == 6){
                   this.paysubmit();
                    
                }
            	},
           paysubmit(){
            var data={type:this.type,payinfo:JSON.stringify(this.payinfo),money:this.money,pwd:this.pwd,id:this.id,userid:this.user.id};
            
            
               http.setWait(true).post('pay.php?act=paymoney',data).then(res=>{
                  
                        if(res.code==200){
                            
                            uni.showToast({
                                title:res.message,
                                
                            })
                             this.getuserinfo();
                           
                            if(this.type=='redpacket' || this.type=='vip'){
                                this.$emit('payresult',res.data)
                            }
                            else this.click_close();
                        }
                        else if(res.code==1){
                            uni.showModal({
                            	title: '提示',
                            	content: "您的余额不足，请先去充值！",
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
                        }
                        
                        })
           },
			click_close(){
              this.$emit('close');  
            },
            click_next(){
                if (isNaN(this.money)) {
                    uni.showToast({
                        title:'金额必须为数字',
                        icon:'none'
                    })
                    this.focus=true;
                    return false;
                }
                if(this.money==''){
                    uni.showToast({
                        title:'请输入金额',
                        icon:'none'
                    })
                    this.focus=true;
                   return false;
                }
                if(this.money<1){
                    uni.showToast({
                        title:'最低支付金额为1元',
                        icon:'none'
                    })
                    this.focus=true;
                    return false;
                }
                
                if(parseFloat(this.money)>parseFloat(this.user.money)){
                    
                    uni.showModal({
                    	title: '提示',
                    	content: "您的余额不足，请先去充值！",
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
                }
           
                    this.step=1;
                     this.focus=true;
               
              
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
            init(){
                if(this.step==1) {
             
                    this.focus=true;
                }
                else{
                    this.focus0=true;
                }
            }
		},
		mounted() {
	        if(this.getmoney>0) this.money=this.getmoney;
          if(this.fix===true && this.getmoney>0) {
           this.step=1;
              
          }
          else{
          
          }
            this.getuserinfo();
            var that=this;
            setTimeout(function(){
                that.init();
            },200)
		},
		    
	}
</script>

<style lang="scss" scoped>

.popup{
        position: fixed;
        z-index: 10;
        background-color: rgba(0,0,0,0.6);
        top:0;
        left: 0;
        width: 100%;
        height: 100vh;
    }
    .popup  .box{
        position: fixed;
        left: 5%;
        width: 90%;
        top:25vh;
        height: auto;
        background-color: #fff;
        border-radius: 10px;
    }
   .popup  .box   .close-btn{
        position: absolute;
        right:-9px;
        top:-9px;
        height: 30px;
        width: 30px;
    }
      .popup .title{
          height:45px;
          line-height:45px;
          text-align: center;
          color: #000;
          font-size: 16px;font-weight: 600;
          width: 100%;
          
          display: block;
          border-bottom: 1px solid #DDDDDD;
          border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              margin-bottom: 5px;
      }
    .popup .textarea {
    display: block;
    height: 160px;
    padding: 5px 10px;
    margin: 10px auto;
    width: calc(100% - 42px);
    border-radius: 5px;
    border: 1px solid #ddd;
    overflow-y: scroll;
}
    .layer_nav{
        width: 100%;
        display: block;
        height: 50px;
        line-height: 50px;
        padding: 0px !important;
        margin: 0px !important;
        background-color: #eee;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
    }
    .layer_nav li{
        display: inline-block;
        float: left;
        color:#666;
        background-color: #eee;
        text-align: center;
        font-size: 16px;
        cursor: pointer;
        width: 150px;
    }
    .layer_nav li i{
        margin-right: 0px;
    }
    .layer_nav li.active{
        background-color: #3f6df5;
        color: #fff;
    }
    .layer_nav li:first-child{
        border-top-left-radius: 8px;
    }
    .layer_btns{
       
    
    display: inline-block;
        line-height: 30px;
        padding: 0px 15px;
        border-radius: 5px;
        border: 0px;
        text-align: center;
        cursor: pointer;
        height: 30px;
        color:#fff;
        margin-left:15px;
        font-size: 14px;
    }
    .layer_btns.ok{
        background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
        background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
        background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
        background: linear-gradient(to bottom right, #3388ff , #2319dc);
     height:30px !important;
    }
    .layer_btns.cancel{
        border: 1px solid #666;
        color: #666;
        background-color: #fff;
        height: 30px;
        line-height: 30px !important;
     
    }
    .popup  .box{
        left: 10%;
        width: 80%;
    }
.profile{
height: 50px;
    line-height: 50px;
clear: both;
  width:100%;
    margin: 0 auto;
}

.profile li{
    display:inline-block;
    text-align: left;
}
.profile li:first-child{
    text-align: right;
    padding-right: 5px;
    width:80px; ;
}
.profile li:last-child{
 width:calc(100% - 90px);
}
.profile  .input1{
    width:90px;
    height:35px;
    line-height: 35px;

    padding: 0px 10px;
    font-size: 14px;
    background-color: transparent;
    color: #222;
    border:1px solid #ccc;
    border-radius: 5px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
}
.profile  .input1::placeholder{
    color: #666;
}
.profile  .input1:focus{
    border-color: #000;
    box-shadow: 0 0 15px #000
}
     .profile .money{
            height: 25px;
            line-height: 25px;
            margin: 5px 5px;
            text-align: center;
            border-radius: 5px;
            background-color: #fff;
            border:1px solid #666;
            color: #555;
            width:50px;
            display: inline-block;
            cursor: pointer;
        }
        .profile .money.active{
            background-color: #2319dc;
            border-color: #2319dc;
            color: #fff;
        }
        .payMent-input {
        		width: calc(100% - 30px);
                margin: 10px 15px;
        		height: 80upx;
        	
        		border-right: 2upx solid #333;
        	
        		border: 2upx solid #333;
        		position: relative;
        		/* border-right: none; */
              
        	}
        
        	.payMent-input-passInput {
        		position: absolute !important;
        		width: 100%;
        		height: 100%;
        		top: 0;
        		left: 0;
        		z-index: 1;
        		opacity: 0;
        	
        	}
        
        	.payMent-input-item {
        		width: 100%;
        		height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                height: 80upx;
                line-height: 80upx;
                padding: 0px 0px !important;
                overflow: hidden;
                
        	}
            .payMent-input-item > view{
       
                border-right: 2upx solid #000000; text-align: center;
                height: 80upx;
                line-height: 80upx !important;
                overflow: hidden;
        
                font-size: 34px;
                font-weight: 700;
                width: calc(16.6% - 1px);
            }
    
</style>
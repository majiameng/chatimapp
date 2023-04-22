<!-- 提现 -->
<template>
	<view class="page">

   <ul class="profile" style="margin-top:0px;" >
                      <li>账户余额：</li>
                      
                      <li>
                          <span style="color:#FF0000">{{user.money}}</span>元
                           
                      </li>
                 </ul>
                 <ul class="profile" >
                     <li>选择银行：</li>
                     <li>
                        <picker @change="bindbankChange" value="0" :range="bank_arr">
                            <view class="uni-input">{{bank_arr[bankid]}}</view>
                        </picker>
 
                     </li>
                 </ul>
              <ul class="profile" >
                  <li>提现金额：</li>
                  
                  <li>
                      <input type="text"  v-model="money" style="width: 100px;display: inline-block;vertical-align: middle;margin-right: 5px;" class="input1"  :placeholder="'最低'+system.plat_min+'元'" />元
                       
                  </li>
             </ul>
              
              <ul class="profile" >
                   <li>资金密码：</li>
                   
                   <li>
                       <input type="password" id="password" v-model="pwd" style="width: 150px;" class="input1" placeholder="请输入资金密码"  />
                        
                   </li>
              </ul>
               
              
              
             
              <view style="margin:15px auto;display:block;width: 80%;">
              
              
                  <button class="button1" @tap="submit()">申请提现</button>
              
              
              </view>

	</view>
</template>

<script>

       import http from "../../library/http.js"
	export default {
		data() {
			return {
				 money: '',
                 pwd:'',
                 user: uni.getStorageSync('userInfo'),
                 system: uni.getStorageSync('system'),
                 bank: uni.getStorageSync('bank'),
                 bank_arr:[],
                 bankid:0,
                 bank_id:0
			}
		},
		methods: {
            bindbankChange(e){
            var num= e.target.value;
                   
             this.setbanknum(num);
             },
             
             setbanknum(num){
                 this.bankid=num;
              
                 var i=0;
                 for(var ii in this.bank){
                     if(i==num){
                      this.bank_id=this.bank[ii].id   
                     }
                     i++;
                 }
                        
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
            setbank(){
              var arr=[];
             
              for(var i=0;i<this.bank.length;i++){
                  
                  arr.push(this.bank[i]['number']);
              }  
              this.bank_arr=arr;
              this.setbanknum(0);
            },
            getbank(){
                this.setbank();
                var postdata={
                         	userid: uni.getStorageSync('access_token')
                            };
                http.setWait(false).post('user.php?act=mybank',postdata).then(res=>{
                                this.bank=res.data;
                            
                                uni.setStorageSync('bank',this.bank)
                                 this.setbank();
                                 
                                
                         })
            },
			submit() {
             var money=this.money;
                              if (money == "") {
                                  
                                  uni.showToast({
                                      title:'请填写提现金额',
                                      icon:'none'
                                  })
                                
                                  return false;
                              }
             
                              if (isNaN(money)) {
                                  
                                  uni.showToast({
                                      title:'提现金额必须为数字',
                                      icon:'none'
                                  })
                                  return false;
                              }
                              if (parseFloat(money) - parseFloat(this.system.plat_min) < 0) {
                                  uni.showToast({
                                      title:'每次最少提现'+ this.system.plat_min + '元！',
                                      icon:'none'
                                  })
                            
                                  return false;
                              }
                              if (parseFloat(money) - parseFloat(this.user.money) >0) {
                                  
                                  uni.showToast({
                                      title:'提现金额不能大于'+ this.user.money+ '元！',
                                      icon:'none'
                                  })
                               
                                  return false;
                              }
                              if (parseFloat(money) - parseFloat(this.system.plat_max) >0) {
                                  uni.showToast({
                                      title:'每次最多提现'+ this.system.plat_max+ '元！',
                                      icon:'none'
                                  })
                           
                                  return false;
                              }
             
                           if (this.pwd == "") {
                               uni.showToast({
                                   title:'请输入资金密码',
                                   icon:'none'
                               })
                               return false;
                           }
                           if(parseInt(this.pwd)>0 && parseInt(this.pwd)<1000000 && this.pwd.length==6){
                                         
                           }else{
                               uni.showToast({
                                   title:'资金密码必须为6位数字',
                                   icon:'none'
                               })
                             
                               return false;
                           }
                           if(this.$action.check_userlock()==false) return false;
                           
                           
                           http.setWait(true).post('pay.php?act=plat',{money:money,bankid:this.bank_id,pwd:this.pwd,userid:this.user.id}).then(res=>{
                                    this.getuserinfo();
                                    uni.showModal({
                                    	title: '提示',
                                    	content: "提现已提交，请耐心等待",
                                    	showCancel: true,
                                    	cancelText: '关闭',
                                    	confirmText: '查看账单',
                                    	success: res => { 
                                    		if(res.confirm) {
                                              uni.redirectTo({
                                                url:"/pages/mine/order" 
                                              })
                                    		}
                                    	}
                                    });  
                                     
                           })
                           
				
			}
		},
		onLoad() {
            
            this.getuserinfo();
            this.getbank();
            
        }

	}
</script>

<style scoped>
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
	.input1{
	    max-width: 150px;
	}
</style>

<!-- 充值 -->
<template>
	<view class="page">
      
      <block v-if="is_iospay">
                <ul class="profile" >
          <li>充值方式：</li>
                           
                           <li>    
                            iOS内购       
                               <span v-if="fee>0" style="font-size: 12px;margin-left: 5px;color: #FF0000;">手续费{{fee}}%</span>
                               
                           </li>
                      </ul>
          <ul class="profile" style="text-align: center;">
                    
                              <block v-for="(m,index) in money_arr" :key="index">
                           
                                  <span :class="{'money':true,'active':index==money_select}" @tap="select_money(index)">{{m}}元</span>
                              </block>   
                              
                                  
                        </ul>
          <view style="margin:15px auto;display:block;width: 80%;">
          
          
              <button class="button1" @tap="submit_iospay=true">下一步</button>
          
         
          </view>
              <iospay v-if="submit_iospay" type="recharge" :money_select="money_select" :money="money" @cancel_pay="submit_iospay=false;"></iospay>
      </block> 
      <block v-else>
          <block v-if="step==0">
               
               <ul class="profile" >
                 <li>充值方式：</li>
                                  
                                  <li>    
                                   <block v-for="(m,index) in paytype" :key="index"> 
                                       <span :class="{'money':true,'active':index==selected}" @tap="clicktype(index)">{{m.name}}</span>
                                   </block>        
                                  </li>
                             </ul>
                             
                             
                       <ul class="profile" v-if="banklist.length>1" >
                         <li>渠道：</li>
                                          
                                          <li>
                                              
                                           <block v-for="(m,index) in banklist" :key="index">
                                               
                                               <span :class="{'money':true,'active':index==bankselected}" @tap="clickbank(index)">{{m.title}}</span>
                                           </block>   
                                           
                                               
                                          </li>
                                     </ul>
                            
                           
                          <ul class="profile" >
                                             <li>充值金额：</li>
                                             
                                             <li>
                                                 
                                              <input type="text"  v-model="money" style="width: 50px;display: inline-block;vertical-align: middle;margin-right: 5px;" class="input1" />元
                                              
                                              <span v-if="fee>0" style="font-size: 12px;margin-left: 5px;color: #FF0000;">手续费{{fee}}%</span>
                                               
                                                  
                                             </li>
                                        </ul>
                          
                         <ul class="profile" style="text-align: center;">
                                           
                                                
                                             <block v-for="(m,index) in money_arr" :key="index">
                                                 
                                                 <span :class="{'money':true,'active':index==money_select}" @tap="select_money(index)">{{m}}元</span>
                                             </block>   
                                             
                                                 
                                       </ul>
                          <view style="margin:15px auto;display:block;width: 80%;">
                          
                          
                              <button class="button1" @tap="submit()">下一步</button>
                          
                          
                          </view>
                      
           </block>
          <block v-else>
              
              <view v-if="postdata.bank.method=='bank'"  class="banklist">
                  <view >
                      <view >
                          汇款银行：
                      </view>
                      <view >
                          <span class='blur'>
                              {{postdata.bank.bankname}}
                          </span>
                          <button class="btn1" @tap="copy(postdata.bank.bankname)">复制</button>
                      </view>
                      
                  </view>
                  
                  
                  <view >
                      <view >
                          开户姓名：
                      </view>
                      <view >
                          <span class='blur'>
                              {{postdata.bank.realname}}
                          </span>
                          <button class="btn1" @tap="copy(postdata.bank.realname)">复制</button>
                      </view>
                      
                  </view>
                  <view >
                      <view >
                          银行卡号：
                      </view>
                      <view >
                          <span class='blur'>
                              {{postdata.bank.number}}
                          </span>
                          <button class="btn1" @tap="copy(postdata.bank.number)">复制</button>
                      </view>
                      
                  </view>
                  <view >
                      <view >
                          汇款金额：
                      </view>
                      <view >
                          <span style='color:#FF0000'>
                              {{postdata.money}}
                          </span>
                          元
                          <button class="btn1" @tap="copy(postdata.bank.money)">复制</button>
                      </view>    
                  </view>

              </view>
              
              <view v-else class="qrcode">
                  <view class="money"><span>￥</span>{{postdata.money}}</view>
                  <view class="image">
                      
                      <image :src="photo(postdata.bank.qrcode)" mode="widthFix"></image>
                  </view>

                  <view class="tips">
                      扫描上面的二维码完成转账操作
                  </view>
 
              </view>
              <view style="margin:15px auto;display:block;width: 80%;">
                  <button class="button1" @tap="sub_ok()">我已完成付款</button>
              </view>
              
          </block>
                
          
          
      </block>
        
	</view>
</template>

<script>
	  import http from "../../library/http.js"
        import config from "../../config.js"
        import iospay from "../../components/iospay.vue"
	export default {
        components: {
        iospay,
               
              
        },
		data () {
			return {
				money:'',
				user: uni.getStorageSync('userInfo'),
                system: uni.getStorageSync('system'),
				setting: uni.getStorageSync('rechargeset'),
                paytype:[],
                selected:0,
                money_arr:[50,100,200,500],
                money_select:1,
                fee:0,
                set:[],
                online:false,
                banklist:[],
                bankselected:0,
                postdata:[],
                step:0,
                order:[],
                is_iospay:false,
                submit_iospay:false,
                
			}
		},
        methods:{
          
            copy(data){
                uni.setClipboardData({
                    data:data,
                    success() {
                        uni.showToast({
                            title:'复制成功',
                             icon:'none'
                        })
                    },
                    fail: () => {
                        uni.showToast({
                            title:'复制失败',
                            icon:'none'
                        })
                    }
                })
            },
            clicktype(num){
               this.selected=num; 
               if(this.online==true){
              var set =this.setting.setting[this.paytype[num]['id']]; 
                   this.banklist=[];
               }else{
                    var set =this.paytype[num]['bank'][0];
                    this.banklist=this.paytype[num]['bank'];
               }
              this.bankselected=0;
                this.set=set;
                this.fee=set.fee;
            },
            clickbank(num){
              this.bankselected=num;
                this.set=this.banklist[num];
                this.fee=this.set.fee;
            },
            select_money(num){
                  this.money_select=num;
             this.money=this.money_arr[num];
            },
            setmethod(){
                try{
                   var paytype=[];
                   this.online=this.setting.online;
             
                   if(this.online==true){
                    
                       for(var ii in this.setting.way){
                        for(var jj in this.setting.method){
                            if(this.setting.method[jj]==ii){
                              paytype.push({id:ii,name:this.setting.way[ii]}) ;
                               break;
                            }
                        }   
                       } 
                       
                   }else{
                       for(var ii in this.setting.way){
                        for(var jj in this.setting.method){
                            if(this.setting.method[jj]==ii){
                                var bank=this.setting.bank[ii];
                                var name={min:bank[0]['min'],max:bank[0]['max'],fee:bank[0]['fee']};
                            
                              paytype.push({id:ii,name:this.setting.way[ii],bank:bank}) ;
                               break;
                            }
                        }   
                       }
                   }
     
                   this.paytype=paytype;
                   this.clicktype(this.selected) 
                }catch(e){
                    //TODO handle the exception
                }
                
               
            },
			getseting(){
              this.setmethod();
                http.setWait(false).post('user.php?act=rechargeset',{}).then(res=>{
                         this.setting=res.data;
                       
                         uni.setStorageSync('rechargeset',this.setting)
                                 this.setmethod();
                         })
            },
            photo(image_url){
                  if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url; 
                  
                  return this.image_cache(image_url);
            },
            submit(){
             
            //    return this.pay(13182832);
                  var rechargeMin =this.set['min'] //最小充值金额
                             var rechargeMax =this.set['max'];
                             var rechargeMoney =this.money; //用户充值金额
               
                
                             if (rechargeMoney == "") {
                                 uni.showToast({
                                     title:'请填写充值金额',
                                     icon:'none'
                                 })
                                 return false;
                             }
                
                             if (rechargeMoney == 0) {
                                 uni.showToast({
                                     title:'充值金额不能为0！',
                                     icon:'none'
                                 })

                                 return false;
                             }
                
                             if (isNaN(rechargeMoney)) {
                                 uni.showToast({
                                     title:'提现金额必须为数字',
                                     icon:'none'
                                 })
                                 parent.layer.msg('充值金额必须为数字！',{ type: 1, anim: 2 ,time:1000});
                
                                 return false;
                             }
                             if (parseFloat(rechargeMoney) - parseFloat(rechargeMin) < 0) {
                                 uni.showToast({
                                     title:'每次最少充值'+ rechargeMin + '元！',
                                     icon:'none'
                                 })
                         
                                 return false;
                             }
                
                             if (parseFloat(rechargeMoney) - parseFloat(rechargeMax) >0) {
                                 uni.showToast({
                                     title:'每次最多充值'+ rechargeMax+ '元！',
                                     icon:'none'
                                 })
                        
                                 return false;
                             }
                               if(this.$action.check_userlock()==false) return false;
                   
                           if(this.online==true){
                                       var posdata={money:rechargeMoney,type:this.paytype[this.selected]['id'],userid:this.user.id,online:this.online};
                               http.setWait(true).post('pay.php?act=recharge',posdata).then(res=>{
                                  
                                       var  params = {url: res.data};
                                       return this.$jump('web.index',params);
                                         
                               })
                           }else{
                               
                                      this.postdata={money:rechargeMoney,type:this.paytype[this.selected]['id'],userid:this.user.id,bank:this.banklist[this.bankselected],online:this.online};
                                         this.step=1;
                                         uni.setNavigationBarTitle({
                                             title:'请完成转账操作'
                                         })
                           }
                           
                          // console.log(posdata)
                   
                            
            },
		    sub_ok(){
                var postdata=this.postdata;
               postdata.bank=JSON.stringify(postdata.bank);
            
                http.setWait(true).post('pay.php?act=recharge1',postdata).then(res=>{
                        uni.showModal({
                        	title: '提示',
                        	content: "充值已提交，大概1-5分钟内到账",
                        	showCancel: true,
                        	cancelText: '关闭',
                        	confirmText: '查看账单',
                        	success: res => { 
                        		if(res.confirm) {
                                  uni.redirectTo({
                                    url:"/pages/mine/order" 
                                  })
                        		}else{
                                    this.step=0;
                                }
                        	}
                        });  
                     
                })
                
            }
        },
		onLoad(opts) {
            if(opts.money!=null && opts.money!=undefined) this.money=opts.money;
            else this.money=this.money_arr[this.money_select];
         // #ifdef APP-PLUS
         if( plus.os.name=='iOS' && this.system.iospay==1) {
             this.is_iospay=true;
             this.money_arr=this.system.iospay_money.split('|');
             this.money_select=0;
             this.money=this.money_arr[this.money_select];
             this.fee=this.system.iospay_fee;
         }else{
              this.getseting();
         }
         // #endif
         // #ifndef APP-PLUS
         this.getseting();
         // #endif
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
     width:100px
 }
 .profile li:last-child{
     width:calc(100% - 110px)
 }
 .input1{
     max-width: 150px;
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
         width: 70px;
         display: inline-block;
         cursor: pointer;
     }
     .profile .money.active{
         background-color: #2319dc;
         border-color: #2319dc;
         color: #fff;
     }
     .qrcode{
         display: flex;
         flex-direction: column;
         text-align: center;
         align-items: center;
      
      }
      .qrcode .money{
          font-size: 40px;
          line-height:50px;
          height: 50px;
          color: #000;
          font-weight: 600;
          margin-top: 20px;
      }
      .qrcode .money > span{
          font-size: 16px;
      }
      .qrcode .image {
          margin-top: 10px;
          
      }
      .qrcode .image > image{
          width: 250px;
 
      }
      .qrcode .tips{
          font-size: 14px;
          color: #666;
          margin-top: 10px;
      }
      
      .banklist{
          display: flex;
          flex-direction: column;
          text-align: center;
          align-items: center;
       width: 100%;
       }
       .banklist > view{
           background-color: #fff;
           margin-top: 10px;
           height: 50px;
           line-height: 50px;
           display: flex;
           flex-direction: row;
           width: 100%;
           font-size: 14px;
       }
        .banklist > view > view:first-child{
            width: 100px;
            text-align: right;
            color:#666;
        }
        .banklist > view > view:nth-child(2){
           
            text-align: left;
            padding-left: 5px;
        }
        .blur{
            color: #2319DC;
        }
        .btn1{
            display: inline-block;
            height: 25px;line-height: 25px;
            margin: 0 10px;
            padding: 0 10px;
           border-radius: 5px;
           color: #000;
           background-color: #eee;
           vertical-align: middle;
           font-size: 14px;
        }
</style>

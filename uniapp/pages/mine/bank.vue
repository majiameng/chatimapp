<template>
	<view class="page">
       <headerline shownav=true  isback="true" @tapnav="tapnav"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'  ></headerline>
 

         <view v-if="navselect==0">
      
                 <ul class="cardManage clearFix" id="_bankList" style="clear: both;margin-top: 10px;">
                
                
                   
                        <li class="bank_item" v-for="(value,index) in bank" :key='index'>
                            <dl>
                                <dd><span> {{value['bankname']}}</span><span>持卡人：{{value['realname']}}</span></dd>
                                <dd><span>卡号：{{value['number']}}</span></dd></dl>
                            <p class="bank_bottom">绑定时间：{{$action.timestampToTime(value['time'])}}<span></span></p>
                
                            <span class="bank_default" v-if="value.default==1"><image src="../../static/img/bank_img.png" style="height:60px;width:60px;"></span>
                
                        </li>
                
                    
                
                    </ul>
                
                    <div class="nodata" style="color: #666;clear: both;margin-top: 10px;text-align: center">
                
                        最多可以绑定<span style="color: #ff0000">{{system['bank_num']}}</span>张银行卡
                
                    </div>

             
         </view>
         
         
         <view v-else>
             <ul class="profile" >
                    <li>姓　　名：</li>
                    <li>
                        <block v-if="banklen>0">
                            {{realname}}
                        </block>
                        <input v-else v-model="realname" class="input1"  />
                     
                    </li>
                </ul>
                <ul class="profile" >
                    <li>卡　　号：</li>
                    <li><input name="banknum" id="banknum" type="digit" v-model="banknum"  class="input1">
                    </li>
                </ul>
            
                <ul class="profile" >
                    <li>选择银行：</li>
                    <li>
                       <picker @change="bindbankChange" :value="bankid" :range="banklist">
                           <view class="uni-input">{{bankname}}</view>
                       </picker>
            
            
                    </li>
                </ul>
            
                <ul class="profile" >
                    <li>所在地区：</li>
                    <li>
                   <picker mode="multiSelector" @cancel="oncancel()"  @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="area">
                   	<view class="uni-input" @tap="tapaddress();">{{item.province}},{{item.city}}</view>
                   </picker>
                    </li>
                </ul>
            
                <ul class="profile" >
                    <li>支行名称：</li>
                    <li>
                        <input type="text" name="mark" v-model="mark" class="input1" id="mark">
                    </li>
                </ul>
            
                <ul class="profile" >
                    <li>首 选 卡：</li>
                    <li>
                   <picker @change="binddefaultChange" :value="isdefault" :range="default_arr">
                       <view class="uni-input">{{default_arr[isdefault]}}</view>
                   </picker>
                           
                    </li>
                </ul>
                <ul class="profile" >
                    <li>资金密码：</li>
                    <li>
                        <input type="password" name='pwd' id='pwd' v-model='pwd' class="input1" maxlength="6">
                    </li>
            
                </ul>
                 <view style="margin:15px auto;display:block;width: 80%;">
                              
                 
                     <button class="button1" @tap="click_bind()">
                         确认并提交
                     </button>
                              
                 
                 </view>
             
                
             
         </view>
    </view>
</template>

<script>
    import api from "../../library/index.js"
    import headerline from '../../components/header.vue'
    import http from "../../library/http.js"
       import uniIcons from '../../components/uni-icons/uni-icons.vue'
        import address from '../../library/address.js'
      var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    	export default {
       components: {
      uniIcons,
          headerline,
         
          },
       data() {    
            return {
                
              statusBarHeight: statusBarHeight+ 'px',
              navitem:['我的银行卡','新增银行卡'],
              navselect:0,
              navstyle:"width:60%;left:20%",
              user: uni.getStorageSync('userInfo'),
              system: uni.getStorageSync('system'),
              bank: uni.getStorageSync('bank'),
              banklen:0,
               banklist: uni.getStorageSync('banklist'),
              realname:'',
              default_arr:['否','是'],
              isdefault:1,
              province:[],
              city:[],
              	multiIndex: [0, 0],
                  area:[['省份'],['城市']],
                  showarea:0,
                  provice1:'',
                  city1:'',
                  provice2:'',
                  city2:'',
                  c1:0,
                  c2:0,
               item:{'province':'省份','city':'城市'},
               bankname:'工商银行',
               banknum:'',
               pwd:'',
               mark:'',
               bankid:0,
             
            }
        },
        methods: {
           tapnav(num){
              
                 if(num==0 && this.banklen==0){
                     uni.showToast({
                         title:'您还没有绑定任何银行卡',
                         icon:'none'
                     })
                 }
                 else{
                     if(this.banklen>=this.system['bank_num']){
                         uni.showToast({
                             title:'每个用户最多只能绑定'+this.system['bank_num']+'张银行卡',
                             icon:'none'
                         })
                     }
                     else
                     this.navselect=num;
                 }
                    
                   
               
           },
         binddefaultChange(e){
         this.isdefault = e.target.value
         },
         bindbankChange(e){
        var num= e.target.value;
        this.bankname=this.banklist[num] 
          this.bankid=num;
     
         },
         
         setbanknum(num){
         
                    
         },
     tapaddress(){
                
                //  console.log( this.sex);
                  
              //   console.log( this.area[0]);
                 //     console.log( this.area[1]);
               this.provice2=this.item.province;
               this.city2=this.item.city; 
            },
            bindMultiPickerColumnChange(e){
                var detail= e.detail;
                detail.value=parseInt(detail.value);
                if(detail.column==0){
                  // console.log(this.city[detail.value].city);
                   this.c1=detail.value;
                    this.area[1]=this.city[detail.value].city;
                    this.multiIndex[0]=detail.value;
                    this.provice1=this.city[detail.value].province;
                    this.city1=this.area[1][this.c2];
                     
                }
                else{
                    this.c2=detail.value;
                    this.multiIndex[1]=detail.value;
                   this.city1=this.area[1][detail.value];
                   
                }
                this.item.province=this.provice1
                this.item.city=this.city1

               
            },
            oncancel(){
              this.item.province=this.provice2
              this.item.city=this.city2
            },
            getAddress(){
                if(!this.item.province || this.item.province==null) this.item.province='省份';
                if(!this.item.city || this.item.city==null) this.item.city='城市';
                var c1=0;
               
                address.forEach(item=>{
                    
                    this.province.push(item.provinceName);
                //    console.log(this.item.province,item.provinceName);
                  if(this.item.province==item.provinceName)this.multiIndex[0]=parseInt(c1);
                    c1++;
                    var arr={};
                    arr.province=item.provinceName;
                    var city1=[];
                    var c2=0;
                    item.city.forEach(c=>{
                        if(c.cityName!='')
                       city1.push(c.cityName) 
             if(this.item.province==item.provinceName && this.item.city==c.cityName)this.multiIndex[1]=parseInt(c2); 
                       
                       c2++;
                    })
                    arr.city=city1;
                    this.city.push(arr)
                    
                })
                //  console.log(this.province);
                // this.area=[];
                
                 this.area[0]=this.province;
               this.area[1]=this.city[this.multiIndex[0]].city;
              this.showarea=1;
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
               getbank(){
                   var postdata={
                            	userid: uni.getStorageSync('access_token')
                               };
                   http.setWait(false).post('user.php?act=mybank',postdata).then(res=>{
                                   this.bank=res.data;
                                 
                                   uni.setStorageSync('bank',this.bank)
                                   if(res.num<1) this.tapnav(1);
                                   else{
                                       this.realname=res.data[0].realname;
                                       this.isdefault=0;
                                   }
                                   this.banklen=res.num;
                                 var banklist=[];
                                 
                              
                                 for(var ii in res.banklist){
                                     banklist.push(res.banklist[ii])
                                 }
                                   this.banklist=banklist;
                                 uni.setStorageSync('banklist',banklist);
                                 this.getuserinfo();
                                   
                            })
               },
              click_bind() {
                      if (this.realname=='') {
                          uni.showToast({
                              title:'请输入开户姓名',
                              icon:'none'
                          })
                         
                          return false;
                      }
              
                      if (this.realname.length<2 || this.realname.length>4 ) {
                         
                    uni.showToast({
                        title:'开户姓名最多四个字',
                        icon:'none'
                    })
                          return false;
                      }
              
                      var reglx = /^[\u0391-\uFFE5]+$/;
                      if(!reglx.test(this.realname)){
                         
                       uni.showToast({
                           title:'开户姓名只能包含中文',
                           icon:'none'
                       })
                          return false;
                      }
              
              
                      if (this.banknum == "") {
                          uni.showToast({
                              title:'请输入银行卡号',
                              icon:'none'
                          })
                         
                          return false;
                      }
                      
                              if(this.banknum.length < 15 || this.banknum.length > 19) {
                                  uni.showToast({
                                      title:'银行卡号长度必须在15到19之间',
                                      icon:'none'
                                  })
                                  
                                  return false;
                              }
                              var num = /^\d*$/;
                              //全数字
                              
                           if(!num.exec(this.banknum)) {
                               uni.showToast({
                                   title:'银行卡号必须全为数字',
                                   icon:'none'
                               })
                          
                                 return false;
                           }
               //        var regExp = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19})$/;
               //        if(!regExp.test(this.banknum)){
               
               //            uni.showToast({
               //                title:'银行卡号格式不正确',
               //                icon:'none'
               //            })
               //            return false;
               //        }
                      if(this.item.city=='城市'){
                       
              
              uni.showToast({
                  title:'请输选择开户行所在地区',
                  icon:'none'
              })
                          return false;
              
                      }
                      if (this.mark == "") {
                          uni.showToast({
                              title:'请输入支行名称',
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
         
                      http.setWait(true).post('user.php?act=bank_add',{userid:this.user.id,bankname:this.bankname,realname:this.realname ,banknum:this.banknum,province:this.item.province,city:this.item.city,mark:this.mark,default:this.isdefault,pwd:this.pwd}).then(res=>{
                               this.getbank();
                               
                              this.navselect=0
                               uni.showToast({
                                  icon:'none',
                                  title:'银行卡绑定成功',
                                  duration:1000
                               })    
                               })
               
                  }
               
        },
        onLoad(opts) {
          this.getbank();
           this.getAddress();
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
      width:100px
  }
  .profile li:last-child{
      width:calc(100% - 130px)
  }

</style>

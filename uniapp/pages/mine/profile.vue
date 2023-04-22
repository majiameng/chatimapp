<template>
	<view class="page">
        <ul class="profile"  style="height: 60px;line-height: 60px;" @tap='uploadImage'>
            <li>头像：</li>
            <li>
               <image class="avatar" :src="user.avatar"></image> 
               
        
            </li>
            <uni-icons class="next" type="arrowright"></uni-icons>
        
        </ul>
        
        
        <ul class="profile" style="height: 40px;line-height: 40px;">
            <li>账号：</li>
            <li>{{user.name}}
        
            </li>
        
        </ul>
        <ul class="profile" >
            <li>昵称：</li>
            <li>
                
                <input type="text" class="input1" id="nickname"  v-model="nickname"  maxlength="7" />
       
            </li>
        
        </ul>
        
        <ul class="profile" >
            <li>所在地：</li>
            <li>
               <picker mode="multiSelector" @cancel="oncancel()"  @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="area">
               	<view class="uni-input" @tap="tapaddress();">{{user.province}},{{user.city}}</view>
               </picker>
            </li>
        <uni-icons class="next" type="arrowright"></uni-icons>
                
        </ul>
        <ul class="profile" >
            <li>性别：</li>
            <li>
             <picker @change="bindPickerChange" :value="user.sex" :range="sex" style="width: 100$;">
                 <view class="uni-input" v-if="user.sex">{{sex[user.sex]}}</view>
                 <view class="uni-input" v-else>保密</view>
             </picker>
        
            </li>
        <uni-icons class="next" type="arrowright"></uni-icons>
                
        </ul>
        
        <ul class="profile" style="padding: 10px 0px;" >
            <li>个性签名：</li>
            <li>
               <textarea id="sign" placeholder="请填写您的个性签名"  v-model="user.sign"></textarea>
        	
            </li>
        
        </ul>
        <view style="margin:15px auto;display:block;width: 80%;">
            <button  class="button1"  @tap="submit">确认修改</button>

        </view>
		
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import api from "../../library/index.js"
	import cache from "../../library/cache.js"
	import helper from "../../library/helper.js"
	import config from "../../config.js"
      import http from "../../library/http.js"
    import address from '../../library/address.js'
    import uniIcons from '../../components/uni-icons/uni-icons.vue'
        
	export default {
        components: {
        uniIcons,
               
              
        },
		data() {
			return {
				user: uni.getStorageSync('userInfo'),
				sex:['保密','男','女'],
                avatar:'',
                province:[],
                nickname:'',
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
                    
			}
		},
		methods: {
			uploadImage() {
			    
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						helper.uploadFiles(tempFilePaths,'image',{type:'avatar'}).then(res=>{
			                
							this.user.avatar = res;
			                this.avatar= res.replace(config.imgUri,'');
			                var postdata={
			                			id:this.user.id,
			                			avatar:this.avatar,
			                				};
			       http.setWait(false).post('user.php?act=profile',postdata).then(res=>{
			                this.user=res.data;
			      
			                uni.setStorageSync('userInfo',this.user)
			            
			                
			                    
			                })
						})
					}
				});
			},
			submit(){
               
                 if(this.nickname==''){
               
                             uni.showToast({
                                icon:'none',
                                title:'请输入昵称',
                                duration:1000
                             })
                             return false;
                         }
                       if(this.nickname.length>7){
               uni.showToast({
                  icon:'none',
                  title:'昵称最多7个字符',
                  duration:1000
               })
                           
                           return false;
                       }
                       // var nickname=this.nickname.replace(/-/g,"");
                       // nickname=nickname.replace(/_/g,"");
                       // nickname=nickname.replace(/\(/g,"");
                       // nickname=nickname.replace(/\)/g,"");
                       // nickname=nickname.replace(/\[/g,"");
                       // nickname=nickname.replace(/\]/g,"");
                       // nickname=nickname.replace(/ /g,"");
                       // var reglx = /^[\u0391-\uFFE5A-Za-z]+$/;
                       // if(!reglx.test(nickname)){
                       //     uni.showToast({
                       //        icon:'none',
                       //        title:'昵称只能包含中文或者英文',
                       //        duration:1000
                       //     })
                        
                       //     return false;
                       // }
               
              let data={
					id:this.user.id,
					nickname:this.nickname,
					sex:this.user.sex,
					sign:this.user.sign,
				};
          
                http.setWait(true).post('user.php?act=profile',data).then(res=>{
                         this.user=res.data;
                        this.userdata();   
                         uni.showToast({
                            icon:'none',
                            title:'资料已更新',
                            duration:1000
                         })
                         setTimeout(function(){
                             var profileback =uni.getStorageSync('profileback');
                             if(profileback!=undefined && profileback!=null && profileback.length>3){
                                 uni.setStorageSync('profileback','')
                                 uni.redirectTo({
                                     url:profileback
                                 })
                             }
                             
                         },800)
                           
                             
                             
                         })
           
			},
			bindPickerChange(e){
			this.user.sex = e.target.value
			},
            oncancel(){
                let data={
                                					id:this.user.id,
                                					province: this.provice2,
                                					city: this.city2,
                                					
                                				};
                
                                				api.changeProfile(data).then(res=>{
                                   
                                					uni.setStorageSync('userInfo',res.data);
                                					this.user = res.data;
                                                 this.userdata();     
                                   //this.$store.state.userinfo=res.data;;
                                				
                                					
                                				})
            },
            tapaddress(){
                
                //  console.log( this.sex);
                  
              //   console.log( this.area[0]);
                 //     console.log( this.area[1]);
               this.provice2=this.user.province;
               this.city2=this.user.city; 
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
     var postdata={
              			id:this.user.id,
              			province: this.provice1,
              			city: this.city1,
              				};
     http.setWait(false).post('user.php?act=profile',postdata).then(res=>{
              this.user=res.data;
                this.userdata();
          
              
                  
              })
               
            },
            getAddress(){
                if(!this.user.province || this.user.province==null) this.user.province='省份';
                if(!this.user.city || this.user.city==null) this.user.city='城市';
                var c1=0;
               
                address.forEach(item=>{
                    
                    this.province.push(item.provinceName);
                //    console.log(this.user.province,item.provinceName);
                  if(this.user.province==item.provinceName)this.multiIndex[0]=parseInt(c1);
                    c1++;
                    var arr={};
                    arr.province=item.provinceName;
                    var city1=[];
                    var c2=0;
                    item.city.forEach(c=>{
                        if(c.cityName!='')
                       city1.push(c.cityName) 
             if(this.user.province==item.provinceName && this.user.city==c.cityName)this.multiIndex[1]=parseInt(c2); 
                       
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
            
            userdata(){
              if(this.user.issetname==1) this.nickname=this.user.nickname;
                                  else this.nickname="";
              if(this.user.signature==null){
              	this.user.signature = ''
              }  
                 uni.setStorageSync('userInfo',this.user)
            },
			getuserinfo(){
                
			    var postdata={
			             	id: uni.getStorageSync('access_token')
			                };
			    http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
			             this.user=res.data;
			           this.userdata();
                             this.getAddress();
			             })
			},
		},
		onLoad() {
			this.user = cache.storage('userInfo');
          this.userdata();
                this.getAddress();
             this.getuserinfo();
		}
	}
</script>
<style lang="scss" scoped>
         @import "@/static/css/user.css";
	.page{
        background-color: #fafafa;
    }
    .profile{
        background-color: #fff;
        margin: 10px auto;
        width: 100%;
        position: relative;
        
    }
    .profile li{
        vertical-align: middle;
    }
     .profile li:nth-child(2){
         width: calc(100%  - 100px);
     }
    .profile .avatar{
        height: 50px;
        width: 50px;
        border-radius: 5px;
        vertical-align: middle;
    }
    .profile .next{
        position: absolute;
        right: 10px;
        top:0px;
        color: #666 !important;
        font-size: 16px !important;
  
    }
    
 
</style>

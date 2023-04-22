<template>

    <view class="page">
        <headerline shownav=true  isback="true" @tapnav="tapnav"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'  ></headerline>
         
       <block v-if="navselect==0">
           <view class="nodata" v-if="!list" >还有推广链接，<span style='color: #2319DC;' @tap="tapnav(1)">立即新增推广链接</span></view>
           <block v-else>
               <view v-for="(m,index) in list" :key='index' class="lists">
                   <view>
                       <span ><span class='title1'>类型：</span><view class="btn_green" v-if="m.isdaili==1">代理</view>
                       <view class="btn_yellow" v-else>用户</view></span>
                      <span ><span class='title1'>返点：</span><span style='color:#2319DC'>{{m.rebate}}%</span></span>
                       
                   </view>
                   <view>
                       <span ><span class='title1'>邀请码：</span>
                       {{m.randcode}}
                       <button class="btn1" @tap='copy(m.randcode)'>复制</button>
                       </span>
                      <span ><span class='title1'>发展人数：</span>
                      {{m.regnum}}
                      </span>
                       
                   </view>
                   
                   <view style='color:#777;font-size: 12px;'>
                       <span  >
                       发布时间:{{timestampToTime(m.addtime)}}
                       </span>
                      <span >
                          <block  v-if='m.remark'>备注:{{m.remark}}</block>
                          
                          
                          </span>
                       
                   </view>
                   <view class="btns">
                       <button class="btn2"  @tap="open_qrcode(m)">查看二维码</button>
                         <button class="btn2" @tap="copy_url(m)">复制邀请链接</button>
                           <button class="btn2 delete" @tap="delete_url(index,m)">
                               <uni-icons type='closeempty'></uni-icons>
                               删除</button>
                   </view>
               </view>
               
           </block>
           
           <view class="qrcode" v-if="showcode">
               
               <image :src="qrcode" class="code"></image>
               <image src="/static/close.png" class="close" @tap='showcode=false;'></image>
           </view>
           
           
       </block>
       
       <block v-else>
         <ul class="profile" >
                  <li>用户类型：</li>
                  
                  <li>
                    <radio :checked="form.isdaili==true"   @tap="set_daili(true)" >代理</radio>
                    <radio style="margin-left: 10px;" :checked="form.isdaili!=true"   @tap="set_daili(false)" >用户</radio>    
                  </li>
             </ul>
          <ul class="profile" style='display: none;'  >
              <li>返点比例：</li>
              
              <li>
                  <picker @change="change_rebate" :value="rebate_index" :range="rebates" :disabled="rebate_disabled" style="display: inline-block;">
                      <view class="uni-input">{{form.rebate}}%</view>
                  </picker>
                   <span style="margin-left:10px;color:#666;">
                      (
                      <block v-if="form.isdaili">
                        打赏分润占比   
                           
                       </block>
                       <block v-else>
                           用户账号无分润  
                       </block>
                       
                       
                       </span>
                      )
              </li>
         </ul>
         
         <ul class="profile" >
              <li>备注：</li>
              
              <li>
               <input type="text" style="width: 150px;" maxlength="10" class="input1" placeholder="请输入备注信息" v-model="form.remark"/>
              </li>
         </ul>
            
           
           <view style="margin:15px auto;display:block;width: 80%;">
           
           
           
           
               <button class="button1" @tap="click_sub()">确认并提交</button>
           
           
           </view>
           
       </block>
    <tabbar></tabbar>
    </view>
</template>

<script>
	import http from "../../library/http.js"
    import config from "../../config.js"
      import headerline from '../../components/header.vue'
        import uniIcons from '../../components/uni-icons/uni-icons.vue'
            import tabbar from '../../components/tabbar.vue'
          var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    export default {
        components:{
          headerline ,
           uniIcons,
           tabbar
        },
        data() {
        	return {
                statusBarHeight: statusBarHeight+ 'px',
                navitem:['我的邀请链接','新增邀请链接'],
                navselect:0,
                navstyle:"width:60%;left:20%",
                list:[],
				user:uni.getStorageSync('userInfo'),
                rebates:[],
                rebate_disabled:false,
                rebate_index:0,
                form:{
                    remark:'',
                    rebate:'',
                    isdaili:true,
                    userid:uni.getStorageSync('access_token')
                    
                },
                showcode:false,
                qrcode:'',
                qrcode_id:''
        	}
        },
        methods: {
            tapnav(num){
              
                this.navselect=num;
                if(num==1){
                    this.form.rebate=this.user.rebate-0.5;
                    this.rebates=[];
                    for(var i=this.form.rebate;i>=0;i=i-0.5){
                        this.rebates.push(i.toFixed(1));
                    }
                }
                else{
                      this.get_invite();
                }
                 
            },
            set_daili(type){
                this.form.isdaili=type;
                if(type==true){
                      this.form.rebate= this.rebates[this.rebate_index];
                      this.rebate_disabled=false;
                }
                else{
                      this.form.rebate=0;
                       this.rebate_disabled=true;
                }
            },
            change_rebate(e){
                var index=e.detail.value;
               this.rebate_index=index;
                this.form.rebate= this.rebates[this.rebate_index];
              
    
            },
            click_sub(){
                this.form.userid=this.user.id;
                this.form.isdaili=this.form.isdaili?1:0;
            
               http.setWait(true).post('user.php?act=invite_add',this.form).then(res=>{
                 if(res.code==200){
                     uni.showToast({
                         title:'操作成功',
                         icon:'none',
                         duration:2000
                     })
                  
               //     this.list.push(res.data);
                   // uni.setStorageSync('invite',this.list);
                    this.tapnav(0);
                 }
               }) 
            },
            get_invite(){
                http.setWait(false).get('user.php?act=invite_list',{userid:this.user.id}).then(res=>{
                  
                  if(res.code==200){
                this.list=res.data;
                uni.setStorageSync('invite',this.list);
                  }
                }) 
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
                     return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s ;
            },
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
            copy_url(m){
                var url=config.imgUri+"?from=invite&invite_code="+m.randcode;
                this.copy(url)
            },
            delete_url(index,m){
              uni.showModal({
              	title: '提示',
              	content: "确认要删除吗？",
              	showCancel: true,
              	cancelText: '取消',
              	confirmText: '删除',
              	success: res => {
                    
              		if(res.confirm) {
                         this.list.splice(index,1);
                        uni.setStorageSync('invite',this.list);
                         http.setWait(false).get('user.php?act=invite_delete',{userid:this.user.id,id:m.id}).then(res=>{
                           this.get_invite();
                         }) 
              		}
              	}
              }); 
            },
           open_qrcode(m){
             this.showcode=true;  
             if(this.qrcode_id!=m.id){
                this.qrcode_id=m.id;
                 this.qrcode='';
                 http.setWait(true).get('index.php?act=getMyQrcodeCard',{type:'qr_invite',code:m.randcode}).then(res=>{
                   
                   if(res.code==200){
                     var img=res.data;
                     if(img.indexOf('http')<=-1){
                         img=config.apiUri+img;
                     }
                     this.qrcode=img;
                   }
                 }) 
             }else{
              
             }
             
            
           },
        },
        onLoad(opts) {
            this.user = uni.getStorageSync('userInfo');
         
            this.list=uni.getStorageSync('invite')?uni.getStorageSync('invite'):[];
            this.get_invite();
        },
        onNavigationBarButtonTap() {
            
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
   .nodata{
       height: 40px;
       line-height: 40px;
       text-align: center;
   }
   
   .lists{
       background-color: #fff;
       margin-top: 10px;
       padding: 5px 10px;
       line-height: 25px;
       clear: both;
       display:  inline-block;
       width: calc(100% - 20px);
   }
   .lists > view{
       clear: both;
   }
   .lists > view > span{
       display: inline-block;
   }
   .lists > view > span:first-child{
       text-align: left;
       float: left;
   }
   .lists > view > span:last-child{
       text-align: right;
       float: right;
   }
     .lists > view .title1{
         color: #666;
     }
     .btn1{
         display: inline-block;
         height: 22px;
         line-height: 22px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         border-radius: 5px;
     }
     
     .btn2{
         display: inline-block;
         height: 28px;
         line-height: 28px;vertical-align: middle;font-size: 14px;
         margin-left: 4px;
         background-color: #2319dc;
         border: 1px #2319dc solid;
         color:#fff;
         border-radius: 5px;
         padding: 0px 10px;
         margin: 0px 15px;
     }
     .btn2.delete{
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         color:#222;
          padding: 0px 10px;
     }
      .lists > view.btns{
          height: 30px;line-height: 30px;text-align: center;
      }
      
      .qrcode{
        background-color: rgba($color: #000000, $alpha: 0.5);  
        position: fixed;
        left: 0px;
        width: 100%;
        height: 100vh;
        top:0px;
      }
      .qrcode .code{
          height: 200px;
          width: 200px;
          top:calc(50% - 150px);
          left: calc(50% - 100px);
          position: fixed;
      }
       .qrcode .close{
           bottom: 80px;;
           left: calc(50% - 20px);
           position: fixed;
           height: 40px;width: 40px;
       }
       .btn_yellow{
           background-color: yellow;
           color: #000;
           font-size: 12px;
           display: inline-block;
           height:18px;
           line-height: 18px;
           padding: 0px 5px;
           border-radius: 5px;
           text-align: center;
            margin: 0px 2px;
       }
       .btn_green{
           background-color: #0aad6c;
           color: #fff;font-size: 12px;
           display: inline-block;
           height: 18px;
           line-height: 18px;
           padding: 0px 5px;
           border-radius: 5px;
           text-align: center;
       
           margin: 0px 2px;
       }
       .btn_blue{
           background-color: #2319dc;
           color: #fff;font-size: 12px;
           display: inline-block;
           height: 18px;
           line-height: 18px;
           padding: 0px 5px;
           border-radius: 5px;
           text-align: center;
        margin: 0px 2px;
       }
       
       .btn_grey{
           background-color: #ddd;
           color: #000;font-size: 12px;
           display: inline-block;
           height: 18px;
           line-height: 18px;
           padding: 0px 5px;
           border-radius: 5px;
           text-align: center;
            margin: 0px 2px;
       }
</style>

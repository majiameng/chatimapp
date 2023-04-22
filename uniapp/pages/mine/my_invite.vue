<template>

    <view class="page">
     <view class="loading" v-if="loading" >
     	<view class="spinner">
     		<view class="rect1"></view>
     		<view class="rect2"></view>
     		<view class="rect3"></view>
     		<view class="rect4"></view>
     		<view class="rect5"></view>
     	</view>
     </view>
     <block v-else>
         <view class="search">
             <uni-icons type='search' style='position: absolute;left: 28px;top:2px;font-size: 22px;font-weight: 600;color:#000;'></uni-icons>
             <input type="text" class="input" placeholder="请输入团队成员账号" v-model="username" maxlength="15" />
             <button @tap='click_search'>搜索</button>
         </view>
         
         
         <view class="parent" v-if="parent.length>0">
         <block v-for="(m,index) in parent" :key='index'>
             <span v-if="index>0"> &gt; </span>
             <span style='color:#2319DC' @tap='user_invite(m)'>{{m.name}}</span>
             
         </block>
         </view>
         
         <view class="nodata" v-if="list.length<1" >还没有邀请任何下级</view>
               <block v-else>
                 
             <view v-for="(m,index) in list" :key='index' class="lists" >
                 
               
                 <view>
                     
                     
                     <view @tap="open_detail(m)">
                       <image :src="image_cache(m.avatar)"></image>
                         
                     </view>
                     <view>
                         
                         <view class="title" >
                          <view :class="{'online':true,'active':m.isonline}"></view><span  style='color: #2319DC;' @tap="open_detail(m)">{{m.name}}</span>
                
                  <span class='btn_green' v-if="m.id==user.id">本人</span>
                  <block v-else>
                    <view class="btn_green" v-if="m.isdaili==1">代理</view>
                    <view class="btn_yellow" v-else>用户</view>  
                    
                  </block>
                  <image src="/static/img/vip0.png" @tap='setvip(m)' class="vipbtn" v-if="m.vip==0" />
                  <image src="/static/img/vip1.png" @tap='setvip(m)' class="vipbtn"  style="height: 20px;" v-if="m.vip>0" /> 
                    
                                <span style="float:right;text-align: right;font-size: 14px;color:#666;"  @tap="user_invite(m)">
                           团队人数：
                           <span  style='color: #2319DC;' >{{m.team_num}}</span>
                         
                      
                        </span>
                         
                         </view>
                         <view class="info">
                             <span>
                                 注册时间:<span style='color:#000;'>{{timestampToTime(m.regtime)}}</span>
                             </span>
                        
                         
                       
                         
                         <span style="float:right;text-align: right;display: none;">
                           返点：<span  style='color: #2319DC;'>{{m.rebate}}%</span>
                         </span>
                         
                         </view>
                     </view>
                     
                 </view>
                      
                     <div class="btns">
                   
                        <view style="text-align: center;" @tap="open_detail(m)"><span class='btn1'><uni-icons type='settings' class="icons" />详情</span></view>
                    
                        <view style="text-align: center;" @tap="user_invite(m)">
                            
                            <span class='btn1'><uni-icons type='person' class="icons" />下级</span>
                            </view>
                     </div>
                       
                   </view> 
                   
               
               
           
               </block>
               <view class="loading" v-if="loading" >
               	<view class="spinner">
               		<view class="rect1"></view>
               		<view class="rect2"></view>
               		<view class="rect3"></view>
               		<view class="rect4"></view>
               		<view class="rect5"></view>
               	</view>
               </view>
            <view class="pages" v-if="pagesum>0">
                <view @tap='next_page(-1)'>&lt;</view>
                <block v-for="(m,index) in pagenum" :key='index'>
                    
                  <view  :class="{'active':m==page}"  @tap="click_page(m)">{{m}}</view>
                </block>
         <view @tap='next_page(1)'>&gt;</view>
                
                
            </view>  
              <view style="height: 20px;"></view>
               
           </block>
         
     </block>
     
          
       <view class="modalhtml" v-if="showModal">
                 
                 <view class="modal">
                     <view class="title">
                        详情
                     </view>
                     <view class="content">
                    <span class='tit'>账号：</span> {{showinfo.name}}
                    <view class="btn_grey" style="margin-left: 5px;" @tap="copy(showinfo.name)">复制</view>
                    <br>
                 
                       <span  class='tit'>类型：</span>   <view class="btn_green" v-if="showinfo.isdaili==1">代理</view>
                         <view class="btn_yellow" v-else>用户</view>
                         <br>
                   
                    <span  class='tit'>团队人数：</span> <span style='color:#2319dc'>{{showinfo.team_num}}</span> <br>
                      <span  class='tit'>团队余额：</span> <span style='color:#2319dc'>{{showinfo.team_money}}</span>元 <br>
                       <span  class='tit'>个人余额：</span> <span style='color:#2319dc'>{{showinfo.money}}</span>元 <br>
                           <span  class='tit'>在线状态：</span> 

                           <span style='color:#2319dc' v-if="showinfo.isonline">在线</span>
                            <span v-else >离线</span>
                            <br>
                       <block v-if="showinfo.logintime>0">
                           <span class='tit'>登录时间：</span> {{timestampToTime(showinfo.logintime)}} <br>    
                       </block>
                         
                              <span  class='tit'>注册时间：</span> {{timestampToTime(showinfo.regtime)}} <br>
                        
                     </view>
                     <view class="btns" @tap="showModal=false;">
                        关 闭
                   
                    </view>
                 </view>
                 
       </view>
 <tabbar></tabbar>
    
    </view>
</template>

<script>
	import http from "../../library/http.js"
    import config from "../../config.js"
          import tabbar from '../../components/tabbar.vue'
        import uniIcons from '../../components/uni-icons/uni-icons.vue'
          var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
    export default {
        components:{
           uniIcons,
           tabbar
        },
        data() {
        	return {
                statusBarHeight: statusBarHeight+ 'px',
               
                list:[],
				user:uni.getStorageSync('userInfo'),
                system:uni.getStorageSync('system'),
                page:1,
                nodate:false,
                loading:false,
            
                pagesum:0,
                pagenum:[],
                userid:0,
                parent:[],
                showModal:false,
                showinfo:{},
                username:'',
                vipnum:0,
              
        	}
        },
        methods: {
        
            user_invite(m){
                this.page=1;
              uni.redirectTo({
                  url:'my_invite?id='+m.id
              })  
            },
            setvip(m){
                
                if(this.user.vip!=3) {
                    if(this.user.vip!=2){
                        
                        uni.showModal({
                        	title: '提示',
                        	content: "开通团队版vip可免费给下级开通个人版vip",
                        	showCancel: true,
                        	cancelText: '取消',
                        	confirmText: '立即开通',
                        	success: res => {
                              
                        		if(res.confirm) {
                                 uni.navigateTo({
                                     url:'joinvip?type=1'
                                 })
                        		}
                        	}
                        });
                    }
                    
                    return false;
                }
            
                if(m.id==this.user.id){
                    uni.showToast({
                        title:'您无法取消自己的VIP',
                        icon:'none'
                    })
                    return false;
                }
                if(m.pid!=this.user.id){
                    uni.showToast({
                        title:'该用户不是您的直属下级',
                        icon:'none'
                    })
                    return false;
                }
                  if(m.vip==0){
                          var content="确认将"+m.name+"设置为VIP?\n当前还可以设置"+this.vipnum+"个用户 ";
                          if(this.vipnum<=0){
                              uni.showToast({
                                  title:'您的团队VIP配额都用完了，无法再给其他人设置VIP了',
                                  icon:'none'
                              })
                              return false;
                          }
                      }
                      else{
                          var content="确认将"+m.name+"的VIP权限取消?"
                      }
                  uni.showModal({
                  	title: '提示',
                  	content: content,
                  	showCancel: true,
                  	cancelText: '取消',
                  	confirmText: '确认',
                  	success: res => {
                        
                  		if(res.confirm) {
                             this.subsetvip(m.id);
                  		}
                  	}
                  });
                
                
            },
            
            subsetvip(id){
                var that=this;
                http.setWait(false).post('user.php?act=set_vip',{userid:id,fromid:this.user.id}).then(res=>{
                  
                  if(res.code==200){
                  that.get_invite();
                  uni.showToast({
                      title:'设置成功',
                      icon:'none'
                  })
                  }
                }) 
            },
        
            set_rebate(m){
                if(m.pid!=this.user.id){
                    uni.showToast({
                        title:'该用户不是您的直属下级，无法为其升点',
                        icon:'none'
                    })
                    return false;
                }
                
                
                if(m.rebate<this.user.rebate - 0.5){
                    var itemlist=[]
                   
                   for(var i=this.user.rebate - 0.5;i>m.rebate;i=i-0.5){
                       itemlist.push(i.toFixed(1)+'%');
                   }
                   var that=this;
                   uni.showActionSheet({
                   	itemList:itemlist,
                   	success: function (res) {
                   	var str=itemlist[res.tapIndex].replace('%','');
                    str=parseFloat(str);
                  
                    http.setWait(false).post('user.php?act=set_rebate',{userid:m.id,rebate:str}).then(res=>{
                      
                      if(res.code==200){
                      that.get_invite();
                      uni.showToast({
                          title:'设置成功',
                          icon:'none'
                      })
                      }
                    }) 
                    
                   }
                    })
                }else{
                    uni.showToast({
                        title:'该用户返点已是最高，无需提升',
                        icon:'none'
                    })
                }
            },
        
            get_invite(){
                this.loading=true;
               // if(this.page>1) this.list=[];
                http.setWait(false).get('user.php?act=my_invite',{userid:this.userid,fromid:this.user.id,page:this.page}).then(res=>{
                  
                  if(res.code==200){
                   
                      this.loading=false;
                      this.pagesum=res.pagesum;
                      this.parent=res.parent;
                      this.vipnum=res.vipnum;
                      this.setpage();
                      if(res.data.length>0){
                          if(this.page==1){
                            this.list=res.data;
                             uni.setStorageSync('my_invite',this.list);  
                          } 
                          else{
                                     this.list=res.data;
                          }
                          if(res.data.length<10) this.nodate=true;
                          else 
                          this.nodate=false;
                      }
                      else{
                          this.nodate=true;
                      }
              
                  }
                }) 
            },
            click_search(){
              if(this.username==''){
                  uni.showToast({
                      icon:'none',
                      title:'请输入团队成员账号'
                  })
                  return  false;
              }  
           
              this.page=1;
              // if(this.page>1) this.list=[];
               http.setWait(false).get('user.php?act=search_invite',{username:this.username,fromid:this.user.id,page:this.page}).then(res=>{
                 
                 if(res.code==200){
                  
                     this.loading=false;
                     this.pagesum=res.pagesum;
                     this.parent=res.parent;
                 
                     this.setpage();
                     if(res.data.length>0){
                         if(this.page==1){
                           this.list=res.data;
                          
                         } 
                         else{
                                    this.list=res.data;
                         }
                         if(res.data.length<10) this.nodate=true;
                         else 
                         this.nodate=false;
                     }
                     else{
                         this.nodate=true;
                     }
                            
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
                    return Y+'-'+M+'-'+D+' '+h+':'+m;
            },
            open_detail(m){
               this.showinfo=m;
               this.showModal=true;
            },
            getnextpage(){
                //if(this.nodate==false){
                    this.page++; 
                   this.get_invite();
                ///s}  
            },
        setpage() {
             var sum=this.pagesum;
             var page=this.page;
             var pagenum=[];
                var html="";
                  if(page>4){
                      var from=page-2;
                      var to=page+2;
                  }
                  else {var from=1;
                  var to=6;
                  }
                 if(to>sum)  to=sum;
                  if(from>2){
                   pagenum.push(1);
                   pagenum.push('...');
                  }
                   for(var i=from;i<=to;i++){
                         pagenum.push(i);
                
                   }
                   if(to<sum-1)  {
                         pagenum.push('...');
                      pagenum.push(sum);
                     
                   }
                this.pagenum=pagenum;
        
            },
            click_page(num){
              if(num>0 && num<=this.pagesum && this.page!=num){
                  
                  this.page=num;
                  this.get_invite();
              }  
            },
            next_page(num){
              var page=this.page+num;
                this.click_page(page);
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
         
        },
        onReachBottom() {
         // if(this.nodate==false){
         //     this.page++; 
         //     this.get_invite();
         // }  
        },
        onLoad(opts) {
            this.user = uni.getStorageSync('userInfo');
            if(opts.id>0){
                this.userid=opts.id;
            }else{
                this.userid=this.user.id;
            this.list=uni.getStorageSync('my_invite')?uni.getStorageSync('my_invite'):[];         
            }
       
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
  .search{
      height: 50px;
      line-height: 50px;
      padding-left: 22px;
      text-align: left;
      font-size: 14px;
         background-color: #fff;
         position: relative;
  }
  .search .input{
      height: 30px;line-height:30px;
      
      border-radius: 16px;
      border: 1px solid #ddd;
      display: inline-block;
     
      padding: 0px 5px;  font-size: 14px;
      color:#666;
      width: calc(100% - 135px);
      vertical-align: middle;
         padding-left: 30px;
   
  }
  .search > button{
      display: inline-block;
      width: 70px;
       height: 30px;line-height:30px;
      background-color: #FF4400;
      border-radius: 5px;
      color: #fff;
      font-size: 14px;
      vertical-align: middle;
      margin-left: 5px;
      
   
      
  }
   .nodata{
       height: 40px;
       line-height: 40px;
       text-align: center;
   }
  .parent{
     height: 40px;
     line-height: 40px;
     text-align: left;
      padding-left: 10px;
    
      background-color: #fff;
  }
     .pages{
         height: 40px;
         line-height: 40px;
         text-align: center;
         
     }
     
     .pages > view{
         display: inline-block;
         height: 35px;
         width: 34px;
         line-height: 35px;
         border: 1px #eee solid;
         margin: 10px auto;

     }
    .pages > view.active{
        color:#fff;
        border: 1px solid #2319DC;
        background-color: #2319DC;
    }
   
   .lists{
       background-color: #fff;
       margin-top: 10px;
       padding: 5px 10px;
       line-height: 30px;
       clear: both;
       display:  inline-block;
       width: calc(100% - 20px);
       height: 100px;
       position:relative;
   }
   .lists .self{
       position: absolute;
       top:-5px;
       left:0px;
       background-color: #2319dc;
       height: 16px;
       line-height: 16px;
       padding:0px 5px;
       color: #fff;
       font-size: 12px;
       z-index:1;
       
       
   }
   
   .lists > view {
         display:  inline-block;
         width: 100%;
         clear: both;
   }
   .lists > view > view{
     display: inline-block;
        padding-top: 0px;margin-top: 0px;
           vertical-align: top;
   }

    .lists > view > view:first-child{
       text-align: center;
       width:70px;
   }
   .lists > view > view:first-child image{
       height:50px;
       width: 50px;
       vertical-align: middle;
       border-radius: 5px;
       margin-top: 5px;
   }
    .lists > view > view:last-child{
       text-align: left;
       width: calc(100% - 70px);
     
   }
     .lists > view > view:last-child .title{
         font-size: 16px;;
        
     }
     .lists > view > view:last-child .info{
         font-size: 14px;
         color: #666;
     }
     .userlist{
         background-color: #fff;
         margin-top: 10px;
         padding: 0px 0px;
         line-height: 30px;
         clear: both;
         display:  inline-block;
         width: calc(100% - 0px);
         height: 90px;
     }
     .userlist > view{
         display: table;
         height: 30px;
         line-height: 30px;
         width: 100%;

         text-align: center;
     }
       .userlist > view > view{
           display: table-cell;
       }
          .userlist > view > view:first-child{
              text-align: left;
              padding-left: 10px;
          }
          .userlist > view > view:last-child{
              text-align: right;
              padding-right: 10px;
          }
          .btns{
              background-color: #fff;
              display: inline-block;
              clear: both;
              width: 100%;
              border-top: 1px #eee solid;
              margin-top: 3px;
              padding-top: 3px;
              
          }
           .btns > view{
               display: inline-block;
               width:50%;
               text-align: center;
           }
           .btns .icons{
               color: #000 !important;
               font-size: 16px !important;
               font-weight: 600 !important;
           }
          .online{
              height: 5px;
              line-height: 5px;
              width: 5px;vertical-align: middle;
              margin-right: 5px;
              border-radius: 5px;
              background-color: #CCCCCC;
              display: inline-block;
          }
          .online.active{
              background-color: #00B26A;
          }
          
     .btn1{
         display: inline-block;
         height: 25px;
         line-height: 25px;vertical-align: middle;font-size: 14px;
        
         background-color: #f8f8f8;
         border: 1px #e7e7e7 solid;
         border-radius: 5px;
         width: 82%;
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
 .modalhtml{
             position: fixed;
             z-index: 999;
             top:0px;
             width: 100%;
             left: 0px;height: 100vh;
             background-color: rgba(0,0,0,0.7);
         }
         .modalhtml .modal{
             background-color: #fff;
             border-radius: 10px;;
             top:20vh;
             width: 80vw;
             left: 10vw;
             position: fixed;
             border: 1px #ddd solid;
         }
         .modalhtml .modal .title{
             text-align: center;
             height: 30px;
             line-height: 30px;
             color: #000;;
             font-size: 16px;;
             font-weight: 600;
             margin-top: 5px;;
         }
         
          .modalhtml .modal .content{
              padding: 5px 10px;
              max-height: 260px;;
              min-height: 65px;
              line-height: 30px;;
              overflow-y: scroll;
              font-size: 14px;
          }
               .modalhtml .modal .content > .tit{
                   display: inline-block;
                   width: 90px;
                   text-align: right;
                   color: #666;
               }
          .modalhtml .modal .btns{
              text-align: center;
              height: 35px;
              line-height: 35px;
              color: #000;;
              font-size: 16px;;
              font-weight: 600;
             border-top: #eee 1px solid;
             border-bottom-left-radius: 10px;
                          border-bottom-right-radius: 10px;
          }
             .modalhtml .modal .btns >span{
                 display: inline-block;
                 width: calc(50% - 1px);
                 height: 35px;
                 line-height: 35px;
             }
             .modalhtml .modal .btns >span:last-child{
                 border-left: #eee 1px solid;
             }
          
  .loading {
    	//loading动画
    	display: flex;
    	justify-content: center;
    padding-bottom: 20px;
    	@keyframes stretchdelay {
    
    		0%,
    		40%,
    		100% {
    			transform: scaleY(0.6);
    		}
    
    		20% {
    			transform: scaleY(1.0);
    		}
    	}
    
    	.spinner {
    		margin: 20upx 0;
    		width: 60upx;
    		height: 25px;
    		display: flex;
    		align-items: center;
    		justify-content: space-between;
    
    		view {
    			background-color: #ff9800;
    			height: 25px;
    			width: 3px;
    			border-radius: 3px;
    			animation: stretchdelay 1.2s infinite ease-in-out;
    		}
    
    		.rect2 {
    			animation-delay: -1.1s;
    		}
    
    		.rect3 {
    			animation-delay: -1.0s;
    		}
    
    		.rect4 {
    			animation-delay: -0.9s;
    		}
    
    		.rect5 {
    			animation-delay: -0.8s;
    		}
    	}
    }
</style>

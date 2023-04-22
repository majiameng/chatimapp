<template>
	<view class="page">
        <headerline  issearch="true" :showsearch="showsearch" searchtips="请输入搜索内容"  @clicksearch='clicksearch' :shownav="false" :title="navtitle" :menuitem="menuitem" :statusbarheight='statusBarHeight'   :islogo="false"    @tapmenu="tapmenu" rightmenu="true"></headerline>
       
       <block v-if="!showsearch">
          
         <!--  <view class="lines" @tap="href('circle.circle',{})">
               <view >
                   <image src="../../static/img/icon-circle.png" class="icon"></image>
                   
               </view>
               <view>朋友圈</view>
               <view>
                   <uni-icons type="arrowright" class="right"></uni-icons>
               </view>
           </view> -->
           
           <!-- #ifdef APP-PLUS -->
           <view class="lines" @tap="scan()">
               <view >
                <image src="../../static/img/icon/scan.png" class="icon"></image>
                   
               </view>
               <view>扫一扫</view>
               <view>
                   <uni-icons type="arrowright" class="right"></uni-icons>
               </view>
           </view>
           <!-- #endif -->
          
           
           <view class="lines" @tap="href('group.index',{})">
               <view >
                      <image src="../../static/img/mygroup.png" class="icon"></image>
               </view>
               <view>群组大厅</view>
               <view>
                   <uni-icons type="arrowright" class="right"></uni-icons>
               </view>
           </view>
           
           <view class="lines"  v-for="(m,index) in flink" :key='index' @tap="openurl(m.url)">
               <view >
                       <image :src="photo(m.logo)" class="icon"></image>
               </view>
               <view>{{m.title}}</view>
               <view>
                   <uni-icons type="arrowright" class="right"></uni-icons>
               </view>
           </view>
           
           <view class="lines" @tap="href('mine.note1',{})">
               <view >
                      <uni-icons class="icon2" type='sound' ></uni-icons>
               </view>
               <view>系统公告</view>
               <view>
                   <uni-icons type="arrowright" class="right"></uni-icons>
               </view>
           </view>
           
       
             
       </block>    
		
		   
	</view>
</template>

<script>
    import scode from "../../library/scode.js"
    import api from "../../library/index.js"
    import chat from "../../library/chat.js"
    	import http from "../../library/http.js"
    import message from "../../library/message.js"
    	import action from "../../library/action.js"
        import headerline from '../../components/header.vue'
    	import config from "../../config.js"         
            var windowHeight= uni.getSystemInfoSync().windowHeight;	
            var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
            var contenttop=statusBarHeight+45;
            var conentheight=windowHeight-contenttop;
            var lottHeight= conentheight-30;
            var lottTop= contenttop + 30;
    export default {
    	components: {
            headerline,
         
    	},

		data() {
			return {
                statusBarHeight: statusBarHeight+ 'px',
                contenttop:contenttop+'px',
                contentheight:conentheight+'px',
                 lottHeight:lottHeight+'px',
                 lottTop:lottTop+'px',
                 shownav:false,
                 navtitle:'发现',
                
		user:uni.getStorageSync('userInfo'),
		showsearch:false,
		friends:uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata'),
		pinyin:[],
          char_select:false,
          flink:uni.getStorageSync('flink')
			};
		},
        methods:{
            photo(image_url){
                  if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url; 
                  
                  return this.image_cache(image_url);
            },
           
           openurl(url){
              uni.navigateTo({
                  url:'../web/index?url='+url
              }) 
           } ,
            
                href(path,opts){
                  
                   if(!opts || opts==undefined  || opts == null) opts={}; 
                    this.$jump(path,opts);
                    
                },
                open_detail(item){
                
                     this.$jump('friend.detail',{id:item.id});
                },
                clicksearch(e){
                  this.showsearch=e;  
                },
                
                tapmenu(num){
                 
                    if(this.$action.loginTips('未登录用户，无法完成此操作','/pages/game/index') ==false) return false;
                     if(this.$action.check_userlock()==false) return false;
                   
                  if(num==0){
                        
                          if(this.user.nickname=='' || this.user.nickname==this.user.name){
                            this.$action.profileTips('未设置昵称，不能创建群','/pages/group/create')   ;
                           return false;
                          }
                          else
                        this.$jump('group.create');
                     }
                     else if(num==1){
                           this.$jump('group.list',{method:0});
                     }
                     else if(num==2){
                           this.$jump('group.list',{method:1});
                     }
                     else if(num==3){
                           this.$jump('mine.note');
                     }
                     else if(num==4){
                         this.scan();
                     }
                },
                
                scan(){
                    uni.scanCode({
                    	success(res) {
                    		scode.getScode(res)
                    	},
                    	fail(e) {
                    		console.log(JSON.stringify(e));
                    		console.log('扫码失败')
                    	}
                    }); 
                },
                setrightmenu(){
                    var action=[
                   
                        {
                        	title: '新建群组',
                        	icon: 'plus'
                        },
                        {
                        	title: '创建的群',
                        	icon: 'personadd'
                        },
                        {
                        	title: '加入的群',
                        	icon: 'person'
                        },
                       
                         // #ifdef APP-PLUS
                         {
                         	title: '通知设置',
                         	icon: 'gear'
                         },
                        {
                        	title: '扫一扫',
                        	icon: 'scan'
                        },
                         // #endif 
                    ]
                  this.menuitem=action;
                },
            
           getflink(){
              // #ifdef APP-PLUS
                   var showtype=plus.os.name            
            // #endif
            // #ifndef APP-PLUS
                   var showtype='H5'            
            // #endif
            http.setWait(false).get('index.php?act=getlink',{showtype:showtype}).then(res=>{
                     this.flink=res.data;
                    
                     uni.setStorageSync('flink',this.flink)
                     })
            
           },
        },
        onShow() {
          uni.hideKeyboard();
          var userid=parseInt(uni.getStorageSync('access_token'));
           if(userid>0) {
            this.getflink();
              
           }else{
           
               uni.setStorageSync('gourl','/pages/contact/index');
              
               this.$jump('login.index');
           }
        },
        onLoad() {
       
            this.setrightmenu();
            uni.$on('toChat',message=>{
                //console.log('index')
            this.$action.toChat(message);
            })
        }
	}
</script>

<style lang="scss">
  .page {
      background-color: #fafafa;
      font-size: 14px;
  }
  .lines{
      display: inline-block;
      clear: both;
      margin-top: 10px;
      height: 50px;
      line-height: 50px;
      background-color: #ffffff;
      padding: 0px 10px;
      width: calc(100% - 20px);
     
  }
  .lines > view{
      display: inline-block;
  }
  .lines > view:first-child{
      width: 50px;
      text-align: center;
  }
  .lines .icon{
      height: 28px;
      width: 28px;
      vertical-align: middle;
      border-radius: 5px;
  }
  .lines > view:nth-child(2){
      width: calc(100%  - 90px);
      text-align: left;
      font-size: 16px;
  }
  .lines > view:last-child{
      width: 40px;
      text-align: center;
  }
  .lines .right{
      font-size: 20px !important;
    color: #666 !important;
  }
</style>

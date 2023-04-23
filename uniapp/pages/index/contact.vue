<template>
	<view class="page">
        <headerline  issearch="true" :showsearch="showsearch" searchtips="请输入搜索内容" @clicksearch='clicksearch' :shownav="false" :title="navtitle" :menuitem="menuitem" :statusbarheight='statusBarHeight'   :islogo="false"      @tapmenu="tapmenu" rightmenu="true"></headerline>
       
       <block v-if="!showsearch">
           <view class="friends">
                 
                 <view class="avatar" @tap="href('group.list',{method:0})" >
                     <image src="../../static/img/group_add.png" style="height: 40px;width:40px ;"></image>
                 </view>
                 <view class="showname" style="padding-left: 10px;" @tap="href('group.list',{method:0})">
                    我创建的群组
                 </view>
            </view>
                        
               <view class="friends" style="margin-top: 5px;" >
                   
                   <view class="avatar" @tap="href('group.list',{method:1})">
                       <image src="../../static/img/mygroup.png" style="height: 40px;width:40px ;"></image>
                   </view>
                   <view class="showname" style="padding-left: 10px;" @tap="href('group.list',{method:1})">
                      我加入的群组
                   </view>
               </view>
               
               <view class="friends" style="margin-top: 5px;"  @tap="href('index.backlist',{})" >
                   
                   <view class="avatar">
                       <image src="../../static/img/icon/backlist.png" style="height: 40px;width:40px ;"></image>
                   </view>
                   <view class="showname" style="padding-left: 10px;">
                     黑名单
                   </view>
               </view>
            
            <view style="height: 8px;"></view>
               <view class="pinyin" v-if="kefunum>0">官方</view>
                 <block v-if="friends.length>0">
                 
                 <block  v-for="(item, index) in friends" :key="item.id" >
                     <view class="friends" v-if=" item.iskefu!=0" @tap="open_detail(item)">
                         
                         <view class="avatar">
                             <image :src="image_cache(item.avatar)"></image>
                         </view>
                         <view class="showname">
                             {{item.nickname}}      <view v-if="item.iskefu==1" class="btn_green">客服</view>
                             <view v-if="item.iskefu==2" class="btn_blue">官方</view>
                                   <view v-if="item.iskefu==3" class="btn_green">上级</view>
                         </view>
                     </view>
                 
                 </block> 
                 <block  v-for="(item1, index1) in pinyin" :key="item1" >
                     <block v-if="ispinyin(item1)">
                             <view class="pinyin" :id="'char_'+item1">{{item1}}</view>
                         <block  v-for="(item, index) in friends" :key="item.id" >
                             <view class="friends" v-if="item.pinyin.substr(0,1).toUpperCase()==item1  && item.iskefu==0" @tap="open_detail(item)">
                                 
                                 <view class="avatar">
                                     <image :src="image_cache(item.avatar)"></image>
                                 </view>
                                 <view class="showname">
                                     {{item.nickname}}      <view v-if="item.iskefu==1" class="btn_green">客服</view>
                                     <view v-if="item.iskefu==2" class="btn_blue">官方</view>
                                      <view v-if="item.iskefu==3" class="btn_green">上级</view>
                                 </view>
                             </view>
                         
                         </block> 
                     </block>
                 
                 </block>
              <view class="nodata" >
                  {{friends.length}}位好友
              </view>
                 <view class="pinyin_right">
                      <block  v-for="(item1, index1) in pinyin" :key="index1" >
                       <view @tap="gotochar(item1)" :class="{'active':item1==char_select}">{{item1}}</view>
                       </block>
                 </view>
                 </block>
               <view v-else class="nodata" >您还没有添加任何好友 </view>
           
       
           
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
                 navtitle:'通信录',
                
		user:uni.getStorageSync('userInfo'),
		showsearch:false,
		friends:uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata'),
		pinyin:[],
          char_select:false,
			};
		},
        methods:{
            
            friendlist(){
             this.friends = uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata')
              this.setfrriends_data();
            
               http.setWait(false).get('user.php?act=getMyFriend',{userid:uni.getStorageSync('access_token')}).then(res=>{
                   
                //console.log(res.data.length)
                 this.friends=res.data;
                 uni.setStorageSync(uni.getStorageSync('access_token')+'_frienddata',res.data);
                 this.setfrriends_data();
               })
                
            },
            setfrriends_data(){
              this.kefunum=0;
              for(var i=0;i<this.friends.length;i++){
                  if(this.friends[i].iskefu>0) this.kefunum++;
              }  
            },
            
            pinyin_init(){
                  var py="ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
                  var pinyin=[];
                    for(var i=0;i<py.length;i++){
                        pinyin.push(py[i]);
                    }
                    this.pinyin=pinyin;
                },
                ispinyin(char){
                  for(var i=0;i<this.friends.length;i++){
                      var pinyin=this.friends[i]['pinyin'];
                       
                      if(pinyin.substr(0,1).toUpperCase()==char.toUpperCase()  && this.friends[i]['iskefu']<1) return true;
                  }
                  return false;  
                },
                gotochar(char){
                    this.char_select=char;
                    uni.createSelectorQuery().select('#char_' + char).boundingClientRect(data=>{//目标节点
                    　　uni.createSelectorQuery().select('.page' ).boundingClientRect((res)=>{//最外层盒子节点 　　　
                
                    　　　　uni.pageScrollTo({ 　　　　　　
                    　　　　　　duration: 0,//过渡时间必须为0，否则运行到手机会报错
                    　　　　　　scrollTop: data.top - res.top - 45- statusBarHeight//滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
                    　　　　})
                    　　}).exec()
                    }).exec()
                },
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
                      /** tinymeng */
                      if(this.user.iscreategroup != 1){
                          uni.showToast({
                              title: '您没有操作权限，请联系管理员',
                              icon: 'none',
                              duration: 2000
                          })
                          return false;
                      }
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
                         return uni.scanCode({
                         	success(res) {
                         		scode.getScode(res)
                         	},
                         	fail(e) {
                         		console.log(JSON.stringify(e));
                         		console.log('扫码失败')
                         	}
                         }); 
                     }
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
			/** 获取用户信息 */
			getUserInfo(){
			   api.getUserInfo({friend_uid:uni.getStorageSync('access_token')})
			   .then(res=>{
				   if(res.code == 200){
					   console.log(res)
					   this.user = res.data
				   }
				});
			}
        },
        onShow() {
          uni.hideKeyboard();
          var userid=parseInt(uni.getStorageSync('access_token'));
           if(userid>0) {
            this.friendlist();
              
           }else{
           
               uni.setStorageSync('gourl','/pages/index/contact');
              
               this.$jump('login.index');
           }
		   this.getUserInfo();
        },
        onLoad() {
            this.pinyin_init();
            this.setrightmenu();
            uni.$on('toChat',message=>{
                //console.log('index')
            this.$action.toChat(message);
            })
        }
	}
</script>

<style lang="scss">
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
    .nodata{
        height: 35px;
        line-height: 35px;
        color: #666;
        font-size: 12px;
        text-align: center;
    }
    .pinyin{
        font-size: 14px;
        height: 25px;
        line-height: 25px;
        width: calc(100% - 20px);
        background-color:#eee;
        padding:0px  10px;
       margin-top: 5px;
    }
    .istop{
        background-color: #fdfdfd;
    }
    .pinyin_right{
        position: fixed;
        right: 7px;
        top:100px;
       height: auto;
       width: 18px;
       line-height: 20px;
       text-align: center;
       font-size: 12px;
       color: #333;
       min-height: 400px;
    }
    .pinyin_right view{
        height: 18px;
        line-height: 18px;
        text-align: center;
    }
        .pinyin_right view.active{
            background-color: #3388ff;
            border-radius: 50%;
            color: #fff;
        }
    .friends{
        padding: 5px 0px;
       
        height: 35px;
        line-height: 35px;
        display: table;
        table-layout: fixed;
        width: calc(100% - 0px);
 
        margin-bottom: 1px;
    }
    .friends .avatar{
        display: table-cell;
        width: 60px;
        text-align: center;
    }
    .friends .avatar  image{
        height: 35px;
        width: 35px;
        border-radius: 5px;;
        vertical-align: middle;
    }
     .friends .showname {
         text-align:left;
         display: table-cell;
         font-size: 16px;
   
         color: #333;
         line-height: 35px;;
         vertical-align: middle;
          margin: 0px 0px;
          padding: 0px 0px;
                border-bottom: 1upx #EFEFEF solid;
               }
</style>

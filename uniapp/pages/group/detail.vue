<template>
	<view class="page">
        <headerline shownav=true  isback="true" @tapnav="tapnav"   :navstyle="navstyle"  :navitem="navitem"  :navselect="navselect" :statusbarheight='statusBarHeight'  ></headerline>
           
         <view class="loading" v-if="isloading" style="padding-top: 70px;" >
         	<view class="spinner">
         		<view class="rect1"></view>
         		<view class="rect2"></view>
         		<view class="rect3"></view>
         		<view class="rect4"></view>
         		<view class="rect5"></view>
         	</view>
         </view>
           <block v-else>
               <view  style="clear: both;"  v-if="navselect==0">
                             
                             <view class="group_detail">
                             
                                 <ul class="avatarline" style="position: relative;">
                                     <li >
                                         <image :src="image_cache(group.avatar)" class="avatar"></image>
                                         
                                     </li>
                                     <li>
                                         <div class="title" id="group_title">{{decodeURI(group.name)}}</div>
                                         <div>
                                             ID:{{group.id}}
                                         </div>
                                     </li>
                             
                             	<view class="emoji"  style="position: absolute;right: 10px;top:0px;font-size: 26px;color: #3388ff" @tap="qrcode">&#xe613;</view>
                            
                                 </ul>
                                 
                             <div class="mark">
                                     <div>
                                         该群创建于: {{addtime}}
                                     </div>
                                     <div>
                                        <block v-if="group.content">
                                            {{group.content}}
                                        </block>
                                        <block v-else>
                                            <view style="color: #999;">什么都没填写</view>
                                        </block>
                                     </div>
                             
                                 </div>
                                 <ul class="lines">
                                     <li>群标签</li>
                                     <li>
                                         <div class="tagshow" style="width: 100%;">
                                            <block v-for="(m,index) in group.tag" :key="index">
                                             <span >{{m}}</span>
                                       </block>
                                       </div>
                                     </li>
                                     <li >
                             
                                       <uni-icons type='arrowright' v-if="isOwner || is_manager"   @tap="tags_show=true;tapnav(3)"></uni-icons>
                                     </li>
                             
                                 </ul>
                                 <ul class="lines"  style="height: 30px;line-height: 30px;"  @tap="tapnav(1)">
                                     <li>管理员</li>
                                     <li style="text-align: right" >共{{managenum}}人</li>
                                     <li > <uni-icons type='arrowright'></uni-icons></li>
                             
                                 </ul>
                             
                                 <div class="users">
                                     <div>
                                         <block v-for="m in members" :key="m.id">
                                         <li  v-if="m.type=='owner' || m.type=='manager'" @tap="lookMember(m)" >
                                           <image class="avatar" :src="imgshow(m.avatar)"   /><br>
                                           <block v-if="m.name!=m.nickname">
                                               {{m.nickname}}
                                           </block>
                                           <block v-else> {{m.name}}</block>
                                         </li>
                                     </block>
                                     </div>
                                 </div>
                             
                                 <ul class="lines" style="height: 30px;line-height: 30px;"  @tap="tapnav(1)">
                                     <li>群成员</li>
                                     <li>共{{group.people_count}}人</li>
                                     <li ><uni-icons type='arrowright'></uni-icons></li>
                                 </ul>
                                
                                 <div class="users" v-if="group['people_count']!=managenum || isOwner || is_manager || !no_invite">
                                     <div>
                                         <block v-for="(m,index) in members" :key="index">
                                             <li  v-if="m.type=='user' && index-managenum<13 " @tap="lookMember(m)" >
                                               <image class="avatar" :src="imgshow(m.avatar)"   /><br>
                                              <block v-if="m.name!=m.nickname">
                                                  {{m.nickname}}
                                              </block>
                                              <block v-else> {{m.name}}</block>     
                                             </li>
                                         </block>
                                     
                                          <li class="member" v-if="isOwner || is_manager || !no_invite" >
                                          	<view class="avatar emoji" @tap="invite_user">&#xe8e1;</view>
                                          </li>
                                          <li class="member" v-if=" isOwner==1 || is_manager==1">
                                          	<view class="avatar emoji" @tap="tapnav(1)">&#xe8e2;</view>
                                          </li>
                                     </div>
                                     <span class="nodata" @tap="tapnav(1);" v-if="group['people_count']-managenum>=13">
                                         查看全部群成员
                                     </span>
                                 </div>
                             <ul class="profile"  >
                                        <li style='width: 110px;'>设为置顶：</li>
                                        <li style="width:calc(100% - 130px);text-align: right;">
                                              <switch :checked="istop"  @change="user_setmenu11('top')" style="vertical-align: middle;" />
                                    
                                        </li>
                                    
                                    </ul>
                                    
                                    <ul class="profile"  >
                                               <li style='width: 110px;'>消息免打扰：</li>
                                               <li style="width:calc(100% - 130px);text-align: right;">
                                                     <switch :checked="no_tip"  @change="user_setmenu11('tip')" style="vertical-align: middle;" />
                                           
                                               </li>
                                           
                                           </ul>
                            
                                 <ul class="lines"  v-if="isin==1 && isOwner!=1 && is_manager!=1">
                                     <li>其他：</li>
                                     <li style="text-align: left">
                                         <button class="btn2" @tap="quit_group()">退出该群</button>
                                       
                                     </li>
                             <li>
                             
                             </li>
                                 </ul>
                             
                              </view>
                      
                      <view style="height: 50px;"></view>
                      
                             <block v-if="userid">
                             
                                 <div class="group_btn" v-if="isin==1" @tap="go_chat();"><uni-icons type='chat' style="color: #fff;font-size: 16px;"></uni-icons>发消息</div>
                                
                                 <div class="group_btn" v-else @tap="apply_group()"><uni-icons type='personadd' style="color: #fff;font-size: 16px;"></uni-icons>申请入群</div>
                               
                                 
                             </block>
                            
                             
                             <div class="group_btn" v-else @tap="login_btn">立即登录</div>
                         
                             
                         
                         </view>
               	<view class="userlist" v-if="navselect==1">
                     
                     
                     <block v-for="(m,index) in members" :key="index">
                        
                         <ul   v-if="isin==1 || m.type=='owner' || m.type=='manager'"   :class="{'admintools':isOwner==1 || is_manager==1}"     >
                     
                             <li >
                                
                     <image :src="imgshow(m.avatar)" @tap="lookMember(m)"></image>
                     
                             </li>
                             <li  v-if="!m.nameset" >
                              
                                 <span class="btn_yellow" v-if="m.type=='owner'">群主</span>
                               <span class="btn_green" v-if="m.type=='manager'">管理员</span>
                                <span class="btn_blue" v-if='m.isvip==1'>计划员</span>
                               <span class="btn_grey" v-if="m.is_deny==1">禁言</span>
                               <span class="nickname">
                                   <block v-if="m.name!=m.nickname">
                                       {{m.nickname}}
                                   </block>
                                   <block v-else> {{m.name}}</block>
                             </span>
                               <input type="text" class="markname"  :value="m.nickname">
                              <view class="menu_tabs" v-if="m.menu">
                                    <block v-for="(m1,index1) in menu_tabs" :key="'tabs'+index1">
                                        <view @tap="user_setmenu(m1.type)">{{m1.text}}</view> 
                                   </block>
                              </view>
                             </li>
                             <li v-else>
                                 <input type="text" class="rename" v-if="m.name!=m.nickname"  v-model="m.nickname" focus="true"  />
                                     <input type="text" class="rename" v-else  v-model="m.name" focus="true" />
                                        <view  class="btn" @tap="sub_rename(m.id)"  >确定</view>
                                           <view  class="btn_cancle" @tap="m.nameset=false" >取消</view>
                             </li>
                             <li  v-if="!m.nameset">        
                       <view  v-if="m.id==userid && (group.is_mark==1 || isOwner==1 || is_manager==1 )" class="btn" @tap="user_rename(m.id);" >修改名片</view>
               <view v-if="(isOwner==1 && m.type!='owner') || (is_manager==1 && m.type=='user')" class="btn" @tap="show_usermenu(m)">操作</view>
                             </li>
                         </ul>
                            </block>
                      
                         <view v-if='isin==0' class="nodata" onclick="apply_group({$group['no_invite']});">
                     
                             查看更多群成员，请先加入该群
                         </view>
                         <view v-else class="nodata">
                             共有{{group.people_count}}人
                         </view>
                  </view>
                  
                 
               
                 <view v-if="navselect==2  && note_add==false" class="group_note">
                     <div class="menu">
                            名称：{{group.name}}
                    
                             <div class="btn" @tap="note_add=true;noteinfo={id:0,content:'',imgs:''}" v-if="isOwner==1 || is_manager==1">
                                 <uni-icons type="plus" style="color:#fff;margin-right: 3px;;"></uni-icons>发布公告</div>
                
                         </div>
                     <div class="content">
                     
                    <block v-if="notelist.length>0">
                    <div class="list"  v-for="(m,index) in notelist" :key="index">
                        <div class="title">
                          <div v-if="m.imgs.split('|').length==1 && m.imgs.length>5" class='img'>
                              <image :src="imgshow(m.imgs.split('|')[0])"></image>
                              
                          </div>
                    
                     <div  :class="{'moreword':m.more}">
                                <span class="istop" v-if="m.istop==1">置顶</span>
                                {{m.content}}
                            <a class="more" v-if="m.more" @tap="m.more=false">[更多]</a>
                            <a class="more" v-if="!m.more && m.content.length>100"  @tap="m.more=true">[收起]</a>
                        </div>
                        </div>
                        <div v-if="m.imgs.split('|').length>1" class='imgs'>
                        <block v-for="(m1,index1) in m.imgs.split('|')" :key="index1">
                            
                            <image :src="imgshow(m)"></image>
                        </block>
                                    
                        </div>
                                        
                        <div class="timer">
                                   
                            <span style="float: left" v-if="isOwner==1 || is_manager==1"> 
                               <a style="color: #3388ff;margin-right: 3px;font-size: 12px;"  @tap="editnote(m);">
                                 <uni-icons type='gear' style="color: #2319dc;"></uni-icons>编辑
                               </a>
                    
                                    <a style="color: #3388ff;margin-right: 3px;font-size: 12px;" @tap="delete_note(m.id);">
                                   <uni-icons type='clear' style="color: #2319DC;"></uni-icons>删除
                               </a>
                    
                            </span>
                                       
                    
                      {{m.nickname}}发布于{{timestampToTime(m.addtime)}}<span style="color: #3388ff;margin-right: 3px;">{{m.view}}人已阅读</span>
                                   
                       
                        </div>
                    </div>
                    
                    
                    </block>
                    
                    <view class="nodata">
                        暂未发布群公告
                    </view>
                     
               
                     
                     </div>
               
                     
                     
                 </view>
                 
                  
                 
                 
                  
                  <view v-if="navselect==3">
                      
                      
                      <ul class="profile" >
                          <li>头像：</li>
                          <li>
                         <image :src="group.avatar"  class="avatar" style="height:50px;width: 50px;" ></image>
                    <image src="../../static/img/icon-plus.png"  @tap="uploadImage"  class="avatar" style="height:50px;width: 50px;margin-left: 10px;" ></image>
                   
                   </li>
                         
                      </ul>
                      
                      
                      <ul class="profile" >
                          <li>名称：</li>
                          <li><input type="text" class="input1" id="name" v-model="group.name" placeholder="请输入聊天室名称">
                      
                          </li>
                      
                      </ul>
                      
                      <ul  class="profile">
                          <li>介绍：</li>
                          <li>
                              <textarea id="content" placeholder="请输入聊天室介绍" style="height: 50px;" v-model="group.content"></textarea>
                      
                          </li>
                      
                      </ul>
                      
                      <ul class="profile" >
                          <li>加群验证：</li>
                          <li>
                              <radio :checked="group.no_invite==1" @tap="group.no_invite=1">需要验证</radio>
                                <radio style="margin-left: 30px;" :checked="group.no_invite==0" @tap="group.no_invite=0">无需验证</radio>
                          </li>
                      </ul>
                      
                      <ul class="profile" >
                          <li>添加群友：</li>
                          <li>
                              <radio :checked="group.no_add==1" @tap="group.no_add=1">禁止添加</radio>
                                <radio style="margin-left: 30px;" :checked="group.no_add==0" @tap="group.no_add=0">允许添加</radio>
                          </li>
                      </ul>
                      
                      <ul class="profile" >
                          <li>发送链接：</li>
                          <li>
                              <radio :checked="group.issendurl==1" @tap="group.issendurl=1">允许发送</radio>
                                <radio style="margin-left: 30px;" :checked="group.issendurl==0" @tap="group.issendurl=0">禁止发送</radio>
                          </li>
                      </ul>
                      
                      <ul class="profile" >
                          <li>修改备注：</li>
                          <li>
                              <radio :checked="group.is_mark==1" @tap="group.is_mark=1">开启</radio>
                                <radio style="margin-left: 30px;" :checked="group.is_mark==0" @tap="group.is_mark=0">关闭</radio>
               
                              &nbsp;
                              <i class="icon-help-circled" style="cursor: pointer;font-size: 18px;color: #2319dc;"
                                 onclick="layer.tips('是否开启修改群名片功能', '.icon-help-circled', {tips:[3,'rgba(0,0,0,0.8)']});"></i>
                          </li>
                      
                      </ul>
                      <ul class="profile" >
                          <li>全体禁言：</li>
                          <li>
                              <radio :checked="group.no_speaking==1" @tap="group.no_speaking=1">开启</radio>
                                <radio style="margin-left: 30px;" :checked="group.no_speaking==0" @tap="group.no_speaking=0">关闭</radio>
                      
                          </li>
                      
                      </ul>
                      
                      <ul  class="profile">
                          <li style="vertical-align: middle">标签：</li>
                          <li style="line-height: 25px;vertical-align: middle">
                              <div class="tagshow">
                                  <span v-for="(m,index) in tags_select.split(',')" :key="index">{{m}}</span>
                              </div>
                      
                              <div class="add_btn" @tap='tags_show=true;' style="height: 20px;line-height: 20px;margin-top: 3px;"><uni-icons class="icons1" type='plus' ></uni-icons>更改</div>
                          </li>
                      
                      </ul>
                      <ul class="profile" >
                          <li>其他：</li>
                          <li style="vertical-align: middle;line-height: 45px;">
                              <button class="btn2" @tap="quit_group()" v-if="isOwner==1">解散该群</button>
                         <button class="btn2" @tap="quit_group()" v-else>退出该群</button>
                          </li>
                      
                      </ul>
                      
                      <view style="height: 50px;"></view>
                      <div class="group_btn"  @tap="click_sub();"><uni-icons type='checkbox' style="color: #fff;font-size: 16px;"></uni-icons>确认</div>
                                        
               
                    
                    
                    <view class="tags" v-if="tags_show">
                    
                        <view class="content">
                            <div class="title">选择标签（最多{{system['tags_sum']}}个）</div>
                           	<block v-for="(item,index) in system.tags.split('|')" :key="index"   >
                    
                            <span @tap="click_tags(index)" :class="{'active':tags_select.indexOf(item)>-1}">{{item}}
                      
                        </span>
                    
                           </block>
                    
                        </view>
                        <image class="close_tags"  @tap='tags_show=false;' src="/static/close1.png"></image>
                    
                    
                    </view>
                      
                  </view>
               
           </block>
          
    
    <noteadd v-if="note_add" :group='group' :noteinfo="noteinfo" @back="note_add=false;"  @getnoteinfo="getnoteinfo"></noteadd>
    
    <view class="popup" v-if="isreq">
        <view class="box">
            <ul class="layer_nav" style="height: 40px;line-height: 40px;">
                <li class="active">申请加入</li>
            </ul>
            <view class="group_detail">
            
                <ul class="avatarline" style="position: relative;">
                    <li >
                        <image :src="image_cache(group.avatar)" class="avatar"></image>
                        
                    </li>
                    <li>
                        <div class="title" id="group_title">名称：{{decodeURI(group.name)}}</div>
                        <div>
                            ID:{{group.id}}
                        </div>
                    </li>
                </ul>
                <textarea class="textarea" placeholder="我是..." v-model="reqcon"></textarea>
            </view>
            <view style="padding: 10px 10px;height: 30px;text-align: right;">
                <button class="layer_btns cancel"  @tap="isreq=false;">
                    <uni-icons type='close' style="font-size: 14px;margin-right: 5px;color: #333;font-weight: 600;"></uni-icons>
                    取消</button>
                 <button class="layer_btns ok" @tap="apply_join()">
                        <uni-icons type='checkbox' style="font-size: 14px;color: #fff;margin-right: 5px;"></uni-icons>
                     确定</button>
            </view>
            <uni-icons type='close' style="display: none;font-size:28px;margin-right: 5px;color: #2319DC;font-weight: 600;position: absolute;right: -15px;top:-13px;"></uni-icons>
        </view>
    
        
    </view>
    <logoutwords v-if="showlogout" :item="logoutinfo"  @sub="logout_sub" @cancle="showlogout=false;" ></logoutwords>
	</view>
</template>

<script>

	import api from "../../library/index.js"
    	import http from "../../library/http.js"
        	import action from "../../library/action.js"
      	import config from "../../config.js"
        import noteadd from '../../components/noteadd.vue';
        	import helper from "../../library/helper.js"
            import headerline from '../../components/header.vue'
             import logoutwords from '../../components/logout_words.vue'
               import uniIcons from '../../components/uni-icons/uni-icons.vue'
                var windowHeight= uni.getSystemInfoSync().windowHeight;	
                var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
	export default {
      components: {
      uniIcons,
      headerline,
      noteadd,
      logoutwords
      },
		data() {
			return {
                 statusBarHeight: statusBarHeight+ 'px',
				roomId: 0,
				isOwner: false,
				info: {},
				group: {},
				members: [],
                switchs:false,
				no_speaking: false,
				forbid_redpack: false,
                is_manager:false,
                no_add:false,
                no_add1:false,
              
                pro_title:'修改群名称',
                pro_text:'',
                placeholder:'',
                pro_type:'',
               
                no_invite:false,
                  userid:uni.getStorageSync('access_token'),
           navitem:['首页','成员','公告'],
           navselect:0,
           navstyle:"width:70%;left:15%",
           step:0,
           addtime:'--:--:--',
           managenum:0,
           isin:0,
           from:'',
           group_id:0,
           menu_tabs:[],
           menu_id:0,
            tags:'',
            tags_sum:3,
            tags_show:false,
            tags_select:'',
            system:uni.getStorageSync('system'),
            isuploading:false,
            notelist:[],
            note_add:false,
            noteinfo:{id:0,content:'',imgs:''},
            isreq:false,
            fromtype:'',
            reqcon:'',
            isloading:true,
            istop:false,
            no_tip:false,
            showlogout:false,
            logoutinfo:{},
			}
		},
      
		methods: {
            invite_user(){
               var ids = this.group.user_id.split(',');
               var userlist=uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata');
               var userid='';
               for(var i=0;i<userlist.length;i++){
               for(var j=0;j<ids.length;j++){
                   if(userlist[i].id==ids[j]) userid+="@"+ids[j];
               }    
               }
               
                var url='../friend/userlist?isme=0&disabled_id='+userid+'&next=invite&subtitle=立即邀请&group_id='+this.group_id
                uni.navigateTo({
                    url:url
                })    
            },
            user_setmenu11(type){
                if(type=='top'){
                   this.istop=!this.istop;
                     var msgtop =  uni.getStorageSync('msgtop')?uni.getStorageSync('msgtop'):[];
                   if(this.istop){
                       msgtop.push('G'+this.group_id)
                   }else{
                       for (var i = 0; i < msgtop.length; i++) {
                          if(msgtop[i]=='G'+this.group_id) {
                            msgtop.splice(i,1)
                          }
                       }
                   }
                   uni.setStorageSync('msgtop',msgtop);
                   this.$store.commit('chat/set_istop');
                    var  data = {cache_key:'G'+this.group_id,userid: this.userid,istop:this.istop};
                  
                           http.setWait(false).get('group.php?act=set_msgtop',data).then(res=>{
                                
                               })
                }
                if(type=='tip'){
                   this.no_tip=!this.no_tip;
                     var msgtop =  uni.getStorageSync('msgnotip')?uni.getStorageSync('msgnotip'):[];
                   if(this.no_tip){
                       msgtop.push('G'+this.group_id)
                   }else{
                       for (var i = 0; i < msgtop.length; i++) {
                          if(msgtop[i]=='G'+this.group_id) {
                            msgtop.splice(i,1)
                          }
                       }
                   }
                   uni.setStorageSync('msgnotip',msgtop);
                   var  data = {cache_key:'G'+this.group_id,userid: this.userid,notip:this.no_tip};
                                      
                   http.setWait(false).get('group.php?act=set_msgnotip',data).then(res=>{
                                
                     })
                    
                }
            
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
                    return M+'-'+D+' '+h+':'+m+':'+s;
            },
            
            imgshow(image_url){
                   if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
                  return this.image_cache(image_url)
            },
            editnote(m){
              this.noteinfo=m;
                this.note_add=true;
            },
            delete_note(id) {
                var that=this;
                uni.showModal({
                    title: '提示',
                    content: "是否要删除？",
                    success: function (res) {
                        if (res.confirm) {
                   
                   http.setWait(true).post('group.php?act=deletenote',{id:id}).then(res=>{
                     if(res.code==200){
                          that.getnoteinfo();
                         uni.showToast({
                             title:'删除成功',
                             icon:'none'
                         }) 
                                 
                     }else{
                      uni.showToast({
                          title:'网络错误，请稍后再试',
                          icon:'none'
                      })     
                     }
                                    
                   
                   })
                        } else if (res.cancel) {
                           
                        }
                    }
                });
                
                 
                },
            quit_group(){
                if(this.isOwner==1) var tips="是否要解散该群？";
                else  var tips="是否要退出该群？";
                var that=this;
                uni.showModal({
                    title: '提示',
                    content: tips,
                    success: function (res) {
                        if (res.confirm) {
                       var data={type:'deleteGroup',userid:that.userid,group_id:that.group_id,fromid:that.userid};
                     // console.log(data)
                           that.$socket.send(data); 
                           that.delete_msg("G"+that.group_id)
                           uni.reLaunch({
                               url:'../index/index'
                           })
                           uni.showToast({
                               title:'您已经退出该群',
                               icon:'none'
                           })  
                        } else if (res.cancel) {
                           
                        }
                    }
                });
            },
            
            uploadImage() {
            	uni.chooseImage({
                    count:1,
            		success: (chooseImageRes) => {
                           for(var i=0;i<chooseImageRes.tempFilePaths.length;i++){
            			var  tempFilePaths = chooseImageRes.tempFilePaths[i];
                           
                         this.group.avatar=tempFilePaths;
                        
                         this.isuploading=true;

            			helper.uploadFiles([tempFilePaths],'images',{type:'avatar'}).then(res=>{
                           // this.group.avatar=res;
                             this.avatar= res.replace(config.imgUri,'');
                             this.isuploading=false;
                             api.changeSpeak({avatar:this.avatar,group_id:this.group.id}).then(res => {
                                
                                 this.GroupUpdate(); 
                                 this.$toast('头像上传成功').then(() => {
                                  	this.getGroupInfo();
                                 });

                             });
            			})
            		}
                    }
            	});
            },
            click_tags(num){
                var tags=this.system.tags.split('|')
              var item=tags[num];
              if(this.tags_select.indexOf(item)>-1){
                var arr=this.tags_select.split(',');
                var select='';
                 for(var i=0;i<arr.length;i++){
                     if(arr[i]!=item) {
                         if(select!='') select+=',';
                         select+=arr[i];
                     }
                 }
                 this.tags_select=select;
              }else{
                   var arr=this.tags_select.split(',');
                   if(arr.length>=this.tags_sum){
                      uni.showToast({
                          title:'最多可以选择'+this.tags_sum+'个标签',
                          icon:'none'
                      }) 
                   }else{
                        if( this.tags_select!='')  this.tags_select+=',';
                         this.tags_select+=item;  
                   }
                    
              }
              
            },
            click_sub(){
                   if(this.group.name==''){
                      uni.showToast({
                          title:'请输入群组名称',
                          icon:'none'
                      })  
                      return false;
                   }
                   
                   if(this.group.content==''){
                      uni.showToast({
                          title:'请输入群组介绍',
                          icon:'none'
                      })  
                      return false;
                   }
                  
                   if(this.tags_select==''){
                      uni.showToast({
                          title:'请设置群标签',
                          icon:'none'
                      })  
                      return false;
                   }
                   if(this.isuploading==true){
                       uni.showToast({
                           title:'头像正在上传中，请稍后提交',
                           icon:'none'
                       })  
                       return false;
                   }
                   
            var postdata={id:this.group_id,name:this.group.name,content:this.group.content,tags:this.tags_select,no_invite:this.group.no_invite,no_speaking:this.group.no_speaking,is_mark:this.group.is_mark,no_add:this.group.no_add,issendurl:this.group.issendurl};
                 
                   http.setWait(true).post('group.php?act=updateinfo',postdata).then(res=>{
                     if(res.code==200){
                          this.GroupUpdate();
                  
                           	this.getGroupInfo();
                         uni.showToast({
                             title:'更新成功',
                             icon:'none'
                         }) 
              
                     }else{
                      uni.showToast({
                          title:'网络错误，请稍后再试',
                          icon:'none'
                      })     
                     }
                 
                   
                   })
                   
               } ,
        
            show_usermenu(m){
                for(var i=0;i<this.members.length;i++){
                    if(this.members[i].id!=m.id)this.members[i].menu=false
                }
               
                   m.menu=!m.menu;
                   this.menu_id=m.id;
                   var menu_tabs=[];
                   if(this.isOwner==1){
                     if(m.type!='owner'){
                           if(m.type=='manager') menu_tabs.push({'type':'manage','text':'取消管理'});
                           else menu_tabs.push({'type':'manage','text':'设为管理'});
                           if(m.is_deny==1) menu_tabs.push({'type':'deny','text':'解除禁言'});
                           else menu_tabs.push({'type':'deny','text':'禁言'});
                           menu_tabs.push({'type':'delete','text':'踢人'});
                       }
                       menu_tabs.push({'type':'update','text':'修改名片'});
                       menu_tabs.push({'type':'view','text':'查看资料'});
                   }
                   else if(this.is_manager==1){
                       if(m.type=='user'){
                           if(m.is_deny==1) menu_tabs.push({'type':'deny','text':'解除禁言'});
                           else menu_tabs.push({'type':'deny','text':'禁言'});                         
                               menu_tabs.push({'type':'delete','text':'踢人'});
                               menu_tabs.push({'type':'update','text':'修改名片'});
                               menu_tabs.push({'type':'view','text':'查看资料'});
                       }
                       else{
                          menu_tabs.push({'type':'view','text':'查看资料'});    
                       }
                   }
                   
                   this.menu_tabs=menu_tabs;
            },
            user_setmenu(type){
                var user=[];
                var isin=0;
                var nickname="";
                for(var i=0;i<this.members.length;i++){
                    if(this.members[i].id==this.menu_id){
                      isin=1;
                      user=this.members[i];
                      if(user.name==user.nickname) nickname=user.name;
                      else nickname=user.nickname;
                            this.members[i].menu=false
                            this.members[i].nameset=false;
                            break;
                    }
              
                }
                var that=this;
                if(isin==1){
                    //设为管理
                    if(type=='manage'){
                        if(user.type=='manager') {
                         var tips="是否要取消["+nickname+"]的管理权限？";
                            var settype=0;
                        }
                        else  {
                         var tips="是否要将["+nickname+"]设为管理？";
                            var settype=1;
                        }
                        
                        uni.showModal({
                            title: '提示',
                            content: tips,
                            success: function (res) {
                                if (res.confirm) {
                                  var data={type:'groupset1',mode:'manage',settype:settype,group_id:that.group_id,userid:that.menu_id,from_uid:that.userid};
                                   that.$socket.send(data);  
                                   
                                } else if (res.cancel) {
                                   
                                }
                            }
                        });
                    } 
                    
                    
                    //禁言
                   if(type=='deny'){
                       if(user.is_deny==1) {
                           var settype=0;
                           var tips="是否要解除["+nickname+"]禁言？";
                       }
                       else {
                           var settype=1;
                           var tips="是否要将["+nickname+"]禁言？";
                       } 
                      
                       uni.showModal({
                           title: '禁言提示',
                           content: tips,
                           success: function (res) {
                               if (res.confirm) {
                                 var data={type:'groupset1',mode:'deny',settype:settype,group_id:that.group_id,userid:that.menu_id,from_uid:that.userid};
                                  console.log(data);
                                  that.$socket.send(data);  
                               } 
                           }
                       });
                   } 
                   
                   //踢人
                   if(type=='delete'){
                     // var tips="是否要将["+nickname+"]移除本群？";
                     //   uni.showModal({
                     //       title: '踢人提示',
                     //       content: tips,
                     //       success: function (res) {
                     //           if (res.confirm) {
                     //             var data={type:'deleteGroup',group_id:that.group_id,userid:that.menu_id,fromid:that.userid};
                     //              that.$socket.send(data);  
                     //           }
                     //       }
                     //   });
                     this.showlogout=true;
                     this.logoutinfo={group_id:this.group_id,userid:this.menu_id,nickname:nickname};
                   } 
                   //设置备注
                   if(type=='update'){
                       this.user_rename(this.menu_id);
                   }
                   if(type=='view'){
                       this.lookMember(user);
                   }
                }
                else{
                    uni.showToast({
                        title:"该用户已被移除群组",
                        icon:'none'
                    })
                    this.getGroupUsers();
                }

            },
            logout_sub(e){
                uni.showToast({
                                  icon:'none',
                                  title:'操作成功'
                              })
                          
            },
            user_rename(id){
             
                for(var i=0;i<this.members.length;i++){
                    if(this.members[i].id==id){
                         this.members[i].nameset=true;
                        
                    }
                    else{
                       this.members[i].nameset=false;
                    }
                              
                }
               
            },
            sub_rename(id){
                var nickname="";
                for(var i=0;i<this.members.length;i++){
                    if(this.members[i].id==id){
                        var user=this.members[i];
                         if(user.name==user.nickname) nickname=user.name;
                         else nickname=user.nickname; 
                    }
                 this.members[i].nameset=false;             
                }
                var postdata={group_id:this.group_id,content:nickname,userid:id};
                var that=this;
                http.setWait(false).post('group.php?act=setGroupNickname',postdata).then(res=>{
                     if(res.code==200){
                         uni.showToast({
                             title:"操作成功",
                             icon:'none'
                         })
                         this.getGroupUsers();
                     }
                     else{
                     uni.showToast({
                        title:res.message,
                        icon:'none'
                    })
                    this.getGroupUsers();
                     }
                         
                 })  
            },
            
            tapnav(num){
                this.navselect=num;
                if(num==2) this.getnoteinfo();
                this.note_add=false;
            },
          
            
            GroupUpdate(){
              let data = {
              	group_id:  this.group.id,
                type:'GroupUpdate'
              }
              this.$socket.send(data);  
            },
            
			
			qrcode() {
				this.$jump('group.qrcode', {
					id: this.group_id
				});
			},
            login_btn(){
               uni.setStorageSync('gourl','/pages/group/detail?id='+this.group_id);
                       
               this.$jump('login.index');
            },
            go_chat(){
              if(this.from=='chat'){
                  uni.navigateBack();
              }
               else{
                   this.$jump('group.chat', {
                   	id: this.group.id,
                   	nickname: this.group.nickname
                   });
               }
            },
            apply_group(){
                if(uni.getStorageSync('access_token')>0) {
                       var user=uni.getStorageSync('userInfo');
                       if(user.issetname==1){
                           if(this.fromtype=='qrcode' || this.group.no_invite==0){
                                 var data={type:'Join_Group',userid:user.id,group_id:this.group_id};
                                  this.$socket.send(data); 
                           }
                           else{
                            this.isreq=true;  
                           }
                           
                           
                       }else{
                           action.profileTips('未设置昵称，不能申请加入群组','/pages/group/detail?id='+this.group_id);
                       }
                         
                }else{
                    action.loginTips('您还没有登录，不能申请加入群组','/pages/group/detail?id='+this.group_id);
                }
              
            },
            
            apply_join(){
                var data={type:'Apply_Group',userid:this.userid,group_id:this.group_id,content:this.reqcon};
                 this.$socket.send(data); 
                 uni.showLoading({
                     title:'申请中'
                 })
               this.isreq=false;
            },
            users_set(data){
             
                var num=0;
                for(var i=0;i<data.length;i++){
                   var item=data[i];
                   if(item.type=='owner' || item.type=='manager') num++;
                 item.menu=false;
                 item.nameset=false;
                   data[i]=item
                }
                this.managenum=num;
                uni.setStorageSync(this.group_id+'_group_members',data);
                this.members =data;
            },
            
			getGroupUsers() {
                 
              this.users_set(uni.getStorageSync(this.group_id+'_group_members'))
    				api.getGroupUsers({
					group_id: this.group_id,
                    userid: this.userid,
				}).then(res => {
                  this.users_set(res.data);
				})
			},
            
            group_set(result){
                this.isloading=false;
                var that=this;
               this.group=result;
               result.tag=result.tags.split(',');
               uni.setStorageSync('group_'+result.id,result);;
               this.addtime=action.timestampToTime(result.addtime)
                        // console.log(result);
               			that.isOwner = result.owner;
                        that.is_manager=result.is_manager;
                        that.isin=result.isin;
               			that.group=that.info = result;
               			that.no_speaking = parseInt(result.no_speaking) ?true : false;
               			//that.forbid_redpack = parseInt(result.forbid_redpack) ? true : false;
                           that.no_invite = parseInt(result.no_invite) ? true : false;
                           that.no_add=parseInt(result.no_add)?true : false
                           that.no_add1=this.no_add;
                           //that.no_tip = parseInt(result.no_tip) ? true : false;
                 if(this.group.avatar.indexOf('http')>-1){
                     
                 }else{
                    that.group.avatar=config.imgUri+that.group.avatar;
                 }
                    this.tags_select=this.group.tags;
                 if((parseInt(this.group.no_add)==1 )&& !this.group.owner && !this.is_manager)
                  this.no_add1=true;
                   else this.no_add1=false;  
                  
                   if((this.isOwner==1 || this.is_manager==1) && this.navitem.length==3) this.navitem.push('设置')
            },
			getGroupInfo() {
                let that = this;

				api.getGroupInfo({
					group_id: this.group_id,
                    from_id: this.userid
				}).then(res => {
                  
					let result = res.data;
                    
                    this.group_set(result);
            
                    
				})
			},
		
          getnoteinfo(){
              var postdata={userid:this.userid,id:this.group_id};
            http.setWait(false).post('group.php?act=groupnote',postdata).then(res=>{
              if(res.code==200){
                  
                  for(var i=0;i<res.data.length;i++){
                      if(res.data[i].content.length>100) res.data[i].more=true;
                     else res.data[i].more=false;
                  }
                  this.notelist=res.data;
                          
              }else{
               uni.showToast({
                   title:'网络错误，请稍后再试',
                   icon:'none'
               })     
              }
                             
            
            })  
          },
          
         
			lookMember(e) {
              
				return this.$jump('friend.detail', {id:e.id,from:'group','group_id':this.group_id});
			},
        
		
		},
		onShow() {
           
            this.getGroupUsers();
            var that=this;
                  this.getnoteinfo()
		},
		onLoad(opts) {
             
             this.from=opts.from?opts.from:'';
            let that = this;
            this.group_id=opts.id;
            if(opts.id>0){
                try{
                  this.group = uni.getStorageSync('group_'+this.group_id);;
                  if(this.group.id==opts.id){
                      this.isloading=false;
                      this.group_set(this.group);
                  }
                  else{
                      this.group.id=this.group_id;
                  }  
                }catch(e){
                    //TODO handle the exception
                }
                
                
              var msgtop =  uni.getStorageSync('msgtop');
              var istop = 0;
              for (var i = 0; i < msgtop.length; i++) {
                 if(msgtop[i]=='G'+this.group_id) {
                     this.istop=true;
                     break;
                 }
              }
              
               var msgnotip = uni.getStorageSync('msgnotip');
               for (var i = 0; i < msgnotip.length; i++) {
                  if(msgnotip[i]=='G'+this.group_id) {
                      this.no_tip=true;
                      break;
                  }
               }
              
                
                this.getGroupInfo();
                          
                this.getGroupUsers()
         
                this.$socket.on('group_update', (res) => {
                   
                    that.getGroupUsers();
                    that.getGroupInfo();
                     
                 })  
                 
                 this.$socket.on('apply_response', (res) => {
                 
                     if(res.data.code==1){
                         var group=res.data.group;
                      
                        uni.redirectTo({
                            url:"/pages/group/chat?id="+group.id+'&nickname='+group.name
                        }) 
                     }
                     else{
                         uni.hideLoading();
                         uni.showToast({
                             icon:'none',
                             title:res.data.message
                         })
                       
                     }
                      
                  })  
                 
                 
                var msgtop=uni.getStorageSync('msgtop')?uni.getStorageSync('msgtop'):[];
                msgtop.map(item=>{
                    if(item.storekey=='G'+this.group.id) this.istop=true;
                    
                })
                var msgnotip=uni.getStorageSync('msgnotip')?uni.getStorageSync('msgnotip'):[];
                msgnotip.map(item=>{
                    if(item.storekey=='G'+this.group.id) this.no_tip=true;
                    
                })
                
            }else{
                uni.navigateBack()
            }
			
        }
	}
</script>

<style lang="scss" scoped>
        @import "@/static/css/group.css";
	$avatarWidth: 50px;

	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('../../static/fonts/uni.ttf') format('truetype');
	}

.uni-navigate-right:after {
	font-family: uniicons;
	content: '\e583';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.uni-navigate-bottom:after {
	font-family: uniicons;
	content: '\e581';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}
.uni-navigate-bottom.uni-active::after {
	font-family: uniicons;
	content: '\e580';
	position: absolute;
	right: 24upx;
	top: 50%;
	color: #bbb;
	-webkit-transform: translateY(-50%);
	transform: translateY(-50%);
}



	.members {
		padding: $uni-spacing-col-base $uni-spacing-row-base;
		display: flex;
		flex-direction: row;
		flex-flow: wrap;
		justify-content: flex-start;
		background-color: #fff;
	}

	.member {
		
		display: inline-block;
		flex-direction: column;
		align-items: center;
        text-align: center;
		justify-content: flex-start;
		text-align: center;
		.avatar {
            display: block;
            margin: 0 auto;
			width: $avatarWidth;
			height: $avatarWidth;
			border-radius: $uni-border-radius-base;
			background: rgba(0,0,0,0.05);

			&.emoji {
				text-align: center;
				background-color: #eee;
				font-size: 68upx;
				line-height: $avatarWidth;
				color: #999;
			}
		}

		text {
			width: $avatarWidth;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			font-size: 28upx;
			color: #999;
		}
	}

	.notice {
		width: 500upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.btn-wrapper {
		margin-top: $uni-spacing-col-base;
		padding: $uni-spacing-col-lg $uni-spacing-row-lg;
	}

	.fromInput {
		text-align: right;
		font-size: 32upx;
		color: #777;
	}
    
    .page{
        font-size: 14px;;
    }
    .loading {
    	//loading动画
    	display: flex;
    	justify-content: center;
    
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

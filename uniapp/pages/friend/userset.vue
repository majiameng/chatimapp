<template>
	<view class="page">
        <view class="usertop" v-if="from!='detail'">
            <view @tap='openinfo()'  >
                <view class="avatar">
                    <image :src="image_cache(userinfo.avatar)"></image>
                </view>
                <view class="nickname">
                    {{userinfo.showname}}
                </view>
                <view class="icon">
                    <uni-icons type='arrowright'></uni-icons>
                </view>
            </view>
            <view @tap="addgroup()">
                <view class="avatar">
                   <image src="../../static/img/icon-plus.png"></image>
                </view>
                <view class="nickname">
                   发起群聊
                </view>
                <view class="icon">
                    
                </view>
            </view>
        </view>
        <ul class="profile"  style="height: 40px;line-height: 40px;">
                   <li>备注名：</li>
                   <li>
                       <button class="btn" @tap="sub_rename()">修改</button>
                       <input type="text" class="input1" id="nickname" placeholder="请输入备注名"  style="width: 100px;text-align:left;float: right;" v-model="markname"  maxlength="10" />
                 
                   </li>
               
               </ul>

            <ul class="profile"  style="height: 40px;line-height: 40px;">
                       <li>设为置顶：</li>
                       <li>
                             <switch :checked="istop"  @change="user_setmenu('top')" style="vertical-align: middle;" />
                   
                       </li>
                   
                   </ul>
                   <ul class="profile"  style="height: 40px;line-height: 40px;">
                              <li>消息免打扰：</li>
                              <li>
                                     <switch :checked="no_tip"  @change="user_setmenu('tip')" style="vertical-align: middle;" />
                          
                              </li>
                          
                          </ul>   
                   <ul class="profile"  style="height: 40px;line-height: 40px;">
                              <li>加入黑名单：</li>
                              <li>
                                    <switch :checked="backlist"  @change="user_setmenu('backlist')" style="vertical-align: middle;" />
                          
                              </li>
                          
                          </ul>
                          
                  
              
                    <ul  v-if="userinfo.from!='system'" class="profile" @tap="deleteFriend()" style="height: 40px;line-height: 40px;text-align: center;color: #007AFF;">
                            删除好友
                           
                           </ul>
            
            
 
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import api from '../../library/index.js'
import http from '../../library/http.js'
import uniIcons from '../../components/uni-icons/uni-icons.vue'
	export default {
        components: {
        uniIcons
              
        },
		data() {
			return {
				system:uni.getStorageSync('system'),
				userinfo:[],
				group_id:0,
				userid:0,
				myid:uni.getStorageSync('access_token'),
                group_users:[],
				group_user:[],
                thistype:'',
                usertype:'',
                markname:'',
                istop:false,
               no_tip:false,
               backlist:false,
               myuser:uni.getStorageSync('userInfo'),
               from:''
			}
		},
		computed: {

		},
		methods: {
            user_setmenu(type){
                if(type=='top'){
                   this.istop=!this.istop;
                     var msgtop =  uni.getStorageSync('msgtop')?uni.getStorageSync('msgtop'):[];
                   if(this.istop){
                       msgtop.push('U'+this.userid)
                   }else{
                       for (var i = 0; i < msgtop.length; i++) {
                          if(msgtop[i]=='U'+this.userid) {
                            msgtop.splice(i,1)
                          }
                       }
                   }
                   uni.setStorageSync('msgtop',msgtop);
                   this.$store.commit('chat/set_istop');
                    var  data = {cache_key:'U'+this.userid,userid: this.myid,istop:this.istop};
                  
                           http.setWait(false).get('group.php?act=set_msgtop',data).then(res=>{
                                
                               })
                }
                if(type=='tip'){
                   this.no_tip=!this.no_tip;
                     var msgtop =  uni.getStorageSync('msgnotip')?uni.getStorageSync('msgnotip'):[];
                   if(this.no_tip){
                       msgtop.push('U'+this.userid)
                   }else{
                       for (var i = 0; i < msgtop.length; i++) {
                          if(msgtop[i]=='U'+this.userid) {
                            msgtop.splice(i,1)
                          }
                       }
                   }
                   uni.setStorageSync('msgnotip',msgtop);
                   var  data = {cache_key:'U'+this.userid,userid: this.myid,notip:this.no_tip};
                                     
                  http.setWait(false).get('group.php?act=set_msgnotip',data).then(res=>{
                               
                    })
                    
                }
                
                
                if(type=='backlist'){
                   this.backlist=!this.backlist;
                    if(this.backlist==true){
                        uni.showModal({
                        	title: '提示',
                        	content: '加入黑名单后将无法收到对方的消息\n确认要把'+this.userinfo.nickname+'加入名单？',
                        	showCancel: true,
                        	cancelText: '取消',
                        	confirmText: '确认',
                        	success: res => {
                        		if(res.confirm) {
                        			this.addbacklist();
                        		}
                                else{
                                    this.backlist=false;
                                }
                        	}
                        });
                    }else{
                        this.addbacklist();
                    }
                    
                }
            
            },
            addbacklist(){
                http.setWait(false).get('user.php?act=backlist',{id:this.userid,userid:this.myid}).then(res=>{
                                this.getmyinfo();
                                if(this.backlist==true)   this.delete_msg('U'+this.userid);
                    })
            },
            sub_rename(){
                 var  data = {friend_uid:this.userid,userid: this.myid,mark:this.markname};
                        http.setWait(false).get('user.php?act=setmark',data).then(res=>{
                                uni.showToast({
                                    title:"备注成功",
                                    icon:'none'
                                })
                                this.getuserinfo(this.userid);
                            })
        
            },
            deleteFriend() {
                var that=this;
            				uni.showModal({
            					title: '提示',
            					content: '确定要删除好友吗？',
            					showCancel: true,
            					cancelText: '取消',
            					confirmText: '删除',
            					success: res => {
            						if(res.confirm) {
            							api.deleteFriend({friendid:that.userid,userid:that.myid}).then(res=>{
            								this.$toast('删除成功').then(()=>{
                                           
                                                this.delete_msg('U'+that.userid);
            									uni.reLaunch({
            										url:'../index/index'
            									});
            								});
            							});
            						}
            					}
            				});
            			},
                      getmyinfo(){
                          var postdata={
                                   	id: uni.getStorageSync('access_token')
                                      };
                          http.setWait(false).post('user.php?act=userinfo',postdata).then(res=>{
                                   this.myuser=res.data;
                                   uni.setStorageSync('userInfo',this.myuser)
                                   var backlist=this.myuser.backlist.toString();
                                   if(backlist.indexOf(this.userid)>-1) this.backlist=true;
                                   else this.backlist=false;
                                   })
                               
                      },
            getuserinfo(userid){
           
              if(uni.getStorageSync('members_'+userid)) this.userinfo=uni.getStorageSync('members_'+userid);

              http.setWait(false).get('user.php?act=userdetail',{id:userid,group_id:0,userid:this.myid}).then(res=>{
                if(res.code==200){
                  this.isloading=false;
                 
                    this.userinfo=res.data;
                  this.markname=this.userinfo.nickname;
               uni.setStorageSync('members_'+userid,res.data)   
                }else{
                 uni.showToast({
                     title:'网络错误，请稍后再试',
                     icon:'none'
                 })     
                }
                               
              
              })  
              
            },
            openinfo(){
              uni.redirectTo({
                  url:'detail?id='+this.userid+'&from=chat'
              })  
            },
            addgroup(){
            uni.navigateTo({
                url:'userlist?disabled_id='+this.userid+'&next=group/create&subtitle=立即创建'
            })     
            },
	       init(){
             var msgtop =  uni.getStorageSync('msgtop');
             var istop = 0;
             for (var i = 0; i < msgtop.length; i++) {
                if(msgtop[i]=='U'+this.userid) {
                    this.istop=true;
                    break;
                }
             }
             
              var msgnotip = uni.getStorageSync('msgnotip');
              for (var i = 0; i < msgnotip.length; i++) {
                 if(msgnotip[i]=='U'+this.userid) {
                     this.no_tip=true;
                     break;
                 }
              }
              
              var backlist=this.myuser.backlist;
              if(backlist.indexOf(this.userid)>-1) this.backlist=true;
              else this.backlist=false;
              
             
           },
	
		},
	
        onShow() {

        },
		onLoad(opts) {
			this.userid=opts.id;
            if(opts.from) this.from=opts.from;
           if(uni.getStorageSync('members_'+this.userid)) {
            this.userinfo=uni.getStorageSync('members_'+this.userid);   
               this.markname=this.userinfo.nickname;
           }
           this.getuserinfo(this.userid);
           this.init();
		}
	}


</script>
<style lang="scss" scoped>
         @import "@/static/css/user.css";
	.page{
        background-color: #fafafa;
    }
    .usertop{
       background-color: #fff;
       line-height: 40px;
       width: 100%;
       min-height: 40px;
    }
    .usertop > view{
        width: 100%;
        display: table;
        table-layout: fixed;
        padding: 5px 0px;
        border-top:1px solid #eee;
    }
    .usertop > view > view{
        display: table-cell;
        vertical-align: middle;
        
    }
    .usertop > view > view.avatar{
        width: 60px;
        text-align: center;
    }
    .usertop > view > view.avatar image{
        height: 40px;
        width: 40px;
        border-radius: 5px;
        vertical-align: middle;
    }
    .usertop > view > view.nickname{
        font-size: 16px;
        color: #222;
        line-height: 40px;
    }
    .usertop > view > view.icon{
        width: 30px;
        text-align: center;
    }
    .profile{
        background-color: #fff;
        margin: 10px auto;
        width: 100%;
    }
    .profile li{
        vertical-align: middle;
    }
    .profile li:first-child{
       padding-left: 10px;
       width: 150px;
       text-align: left;
    }
    .profile li:last-child{
        padding-right: 10px;
        text-align: right;
        width: calc(100% - 180px);
        vertical-align: middle;
    }
    
    .btn{
     height: 30px;
        line-height: 30px;
        background-color: #3388ff;
        float: right;
        color: #fff;
        padding: 0px 15px;
       
        margin-left: 5px;
        cursor: pointer;

        vertical-align: middle;
    }
</style>
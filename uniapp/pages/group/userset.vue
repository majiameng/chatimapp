<template>
	<view class="page">
        <ul class="profile"  style="height: 40px;line-height: 40px;">
                   <li>群名片：</li>
                   <li>
                       <button class="btn" @tap="sub_rename()">修改</button>
                       <input type="text" class="input1" id="nickname"  style="width: 100px;text-align:left;float: right;" v-model="group_user.nickname"  maxlength="10" />
                 
                   </li>
               
               </ul>
        <block v-if="this.thistype=='owner'">
            <ul class="profile"  style="height: 40px;line-height: 40px;">
                       <li>禁言：</li>
                       <li>
                             <switch :checked="group_user.is_deny"  @change="user_setmenu('deny')" style="vertical-align: middle;" />
                   
                       </li>
                   
                   </ul>
                   
                   <ul class="profile"  style="height: 40px;line-height: 40px;">
                              <li>设为管理：</li>
                              <li>
                                    <switch :checked="group_user.type=='manager'"  @change="user_setmenu('manager')" style="vertical-align: middle;" />
                          
                              </li>
                          
                          </ul>
              
                    <ul class="profile" @tap="user_setmenu('delete')" style="height: 40px;line-height: 40px;text-align: center;color: #007AFF;">
                            踢出该群
                           
                           </ul>
            
            
        </block>
 <block v-if="this.thistype=='manager' && group_user.type=='user'">
  
  <ul class="profile"  style="height: 40px;line-height: 40px;">
             <li>禁言：</li>
             <li>
                   <switch :checked="group_user.is_deny"  @change="user_setmenu('deny')" style="vertical-align: middle;" />
         
             </li>
         
         </ul>
             <ul class="profile" @tap="user_setmenu('delete')"   style="height: 40px;line-height: 40px;text-align: center;color: #007AFF;">
                     踢出该群
                    
                    </ul>
     
     
 </block>
  <logoutwords v-if="showlogout" :item="logoutinfo"  @sub="logout_sub" @cancle="showlogout=false;"  ></logoutwords>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
     import logoutwords from '../../components/logout_words.vue'
	import api from '../../library/index.js'
import http from '../../library/http.js'
	export default {
        components:{
          logoutwords
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
                showlogout:false,
                logoutinfo:{},
			}
		},
		computed: {

		},
		methods: {
            user_setmenu(type){
                var user=this.group_user;
             
                var isin=0;
                var nickname=user.nickname;
            
                for(var i=0;i<this.group_users.length;i++){
                    if(this.group_users[i].id==this.userid){
                      isin=1;
                        
                            break;
                    }
              
                }
               
                var that=this;
                if(isin==1){
                    //设为管理
                    if(type=='manager'){
                   
                        if(user.type=='manager') {
                            var tips="是否要取消["+nickname+"]的管理权限？";
                             var sendtype=false;
                            this.group_user.type='user';
                        }
                        else {
                          var tips="是否要将["+nickname+"]设为管理？";  
                          var sendtype=true;
                          this.group_user.type='manager';
                        } 
                      
                        uni.showModal({
                            title: '提示',
                            content: tips,
                            success: function (res) {
                                if (res.confirm) {
                                  var data={type:'groupset1',mode:'manage',settype:sendtype,group_id:that.group_id,userid:that.userid,from_uid:that.myid};
                                   that.$socket.send(data);  
                                } else if (res.cancel) {
                                    
                                  if(that.group_user.type=='user')
                                   that.group_user.type='manager';
                                   else that.group_user.type='user'
                                }
                            }
                        });
                    } 
                    
                    
                    //禁言
                   if(type=='deny'){
                       if(user.is_deny==1) {
                           var settype=0;
                           var tips="是否要解除["+nickname+"]禁言？";
                           this.group_user.is_deny=0;
                       }
                       else {
                           var settype=1;
                           var tips="是否要将["+nickname+"]禁言？";
                           this.group_user.is_deny=1;
                       } 
                      
                       uni.showModal({
                           title: '禁言提示',
                           content: tips,
                           success: function (res) {
                               if (res.confirm) {
                                 var data={type:'groupset1',mode:'deny',settype:settype,group_id:that.group_id,userid:that.userid,from_uid:that.myid};
                                 
                                  that.$socket.send(data);  
                               }
                                else{
                                    if(that.group_user.is_deny==0)
                                     that.group_user.is_deny=1;
                                     else that.group_user.is_deny=0
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
                     //               uni.showToast({
                     //                   icon:'none',
                     //                   title:nickname+'已被移除本群'
                     //               })
                     //              setTimeout(function(){
                     //                  uni.navigateBack({
                     //                      delta:2
                     //                  })
                     //              },500)
                     //           }
                     //       }
                     //   });
                  this.showlogout=true;
                  this.logoutinfo={group_id:that.group_id,userid:this.userid,nickname:nickname};
    
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
                             setTimeout(function(){
                                 uni.navigateBack({
                                     delta:2
                                 })
                             },500)
            },
            sub_rename(){
              
                var postdata={group_id:this.group_id,content:this.group_user.nickname,userid:this.userid};
                var that=this;
                http.setWait(false).post('group.php?act=setGroupNickname',postdata).then(res=>{
                     if(res.code==200){
                         uni.showToast({
                             title:"操作成功",
                             icon:'none'
                         })
                         this.getGroupuser(this.userid,this.group_id);
                     }
                     else{
                     uni.showToast({
                        title:res.message,
                        icon:'none'
                    })
                    this.getGroupuser(this.userid,this.group_id);
                     }
                         
                 })  
            },
		users_set(data){
		 
		 if(data.length>0){
		    for(var i=0;i<data.length;i++){
		     if(this.userid==data[i].id){
		         this.group_user=data[i];
               
		     }
             if(this.myid==data[i].id){
                 this.thistype=data[i].type;
                 
             }
             
		    } 
		 uni.setStorageSync(this.group_id+'_group_members',data);
		 }
         this.group_users=data;
		    
		 
		},
		
		getGroupuser(userid,group_id){
           
		  
		    
		   api.getGroupUsers({
		   	group_id: group_id,
		    userid: userid,
		   }).then(res => {
               
		     this.users_set(res.data);
		   
		   }) 
		},
        
		},
	
        onShow() {

        },
		onLoad(opts) {
			this.userid=opts.id;
            this.group_id=opts.group_id;
            this.thistype=opts.thistype;
            this.usertype=opts.usertype;
            var group_users=uni.getStorageSync(this.group_id+'_group_members');
             if(group_users.length>0){
                  this.users_set(group_users);
             }
            this.getGroupuser(this.userid,this.group_id);
            this.$socket.on('group_update', (res) => {
               
               this.getGroupuser(this.userid,this.group_id);
                 
             })
         
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
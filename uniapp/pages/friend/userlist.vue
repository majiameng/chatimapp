<template>
    <view class="page">
        <view class="usertop" :style="'top:'+contenttop">
            
            <view class="icon" @tap='click_search'><uni-icons type='search' style="font-size: 28px;vertical-align: middle;"></uni-icons></view>
            <view class="avatars" v-if="!issearch">
                <block v-for="(m,index) in userlist" :key='m.id'>
                    
                    <image  v-if="get_checkbox(m.id)!=false && (!get_disable(m.id)  ||  next!='invite')" :src="image_cache(m.avatar)"></image>
                </block>
                
            </view>
            <view class="search" v-else>
                
                <input placeholder="请输入用户昵称"  class="input" v-model="keyword" @input="onsearch( $event.detail.value);"  />
                <button class="btn" @tap='click_search'>取消</button>
            </view>   
        </view>
      <view class="userlist">
          <block v-if="shownum>0">
          
          <block  v-for="(m,index) in userlist" :key='index' >
              
              <view v-if="searchshow(m)" @tap="set_checkbox(m.id)">
                  <view class="icon">
                      <checkbox :checked="get_checkbox(m.id)" :disabled="get_checkbox(m.id)"></checkbox>
                  </view>
                  <view class="avatar" >
                      <image :src="image_cache(m.avatar)"></image>
                  </view>
                  <view class="nickname" >
                      {{m.nickname}}
                  </view>
              </view>
              
          </block>
          </block>
        <view v-else class="nodata" style="text-align: center;color: #666;">
            
            没有找到相关用户
       
        </view>
   
          
      </view>
      <view style="height: 40px;"></view>
   <view class="subbutton" @tap="submit">
       {{subtitle}}
       <block v-if="clicklen">
           ({{clicklen}})
       </block>
   </view>
    </view>
</template>

<script>
      import uniIcons from '../../components/uni-icons/uni-icons.vue'
      
      var windowHeight= uni.getSystemInfoSync().windowHeight;
      var statusBarHeight = uni.getSystemInfoSync().statusBarHeight ;
      var contenttop=0;
      // #ifndef APP-PLUS
          var contenttop=statusBarHeight+40;
      //#endif
  
    export default {
        components: {
            uniIcons
        },
        props: {
          
        },
        computed:{
            clicklen(){
                var arr=this.checkbox.split('@');
                var num=0;
                for(var i=0;i<arr.length;i++){
                    if(arr[i]>0){
                    
                       num++;
                    }
                }
                  var num1=0;
                if(this.next=='invite'){
                    var arr=this.disabled.split('@');
                  
                    for(var i=0;i<arr.length;i++){
                        if(arr[i]>0){
                        
                           num1++;
                        }
                    }
                }
                return num-num1;
            }
        },
        data() {
            return {
               contenttop:contenttop+'px',
                user:uni.getStorageSync('userInfo'),
                userlist:uni.getStorageSync(uni.getStorageSync('access_token')+'_frienddata'),
                isme:true,
                checkbox:'',
                disabled:'',
                issearch:false,
                keyword:'',
                shownum:1,
                subtitle:'确认',
                next:'',
                group:[],
                group_id:0,
            }
        },
       
        methods: {
            click_search(){
                this.issearch=!this.issearch;
                this.keyword="";
                this.shownum=this.userlist.length;
            },
           get_checkbox(id){
               
               if(this.checkbox.indexOf('@'+id)>-1) return true;
           
               return false;
           },
           get_disable(id){
               
             
             if(this.disabled.indexOf('@'+id)>-1) return true;
               return false;
           },
           set_checkbox(id){
               if(this.get_disable(id)) return false;
                if(this.get_checkbox(id)){
                    this.checkbox=this.checkbox.replace('@'+id,'');
                }
               else{
   
                   this.checkbox+="@"+id;;
               }
           },
           searchshow(m){
            if(!this.issearch || this.keyword=='') return   true;
             else{
                 if(m.nickname.indexOf(this.keyword)>-1) return true;else return false;
             }
           },
           onsearch(value){
              var num=0;
              for(var i=0;i<this.userlist.length;i++){
                 if(this.searchshow(this.userlist[i])) num++;
              }
              this.shownum=num;
           },
           submit(){
              if(this.clicklen>0){
                  if(this.next=='invite'){
                     var arr=this.checkbox.split('@'); 
                     var checkbox='';                  
                     for(var i=0;i<arr.length;i++){
                         if(arr[i]>0){
                            if(!this.get_disable(arr[i])){
                                if(checkbox!='') checkbox+=',';
                                checkbox+=arr[i];
                            }
                         }
                     }
                  if(this.group.no_add==0 || this.group.is_owner==1 || this.group.is_manager==1){
                      //直接进群，无需审核
                      var apply=0;
                    
                  }
                     else{
                        var apply=1;
                     }
                     var data={type:'inviteIntoGroup',userid:this.user.id,group_id:this.group_id,user_id:checkbox,apply:apply};
                    
                     this.$socket.send(data);
                     this.$socket.on('apply_response', (res) => {
                     
                         if(res.data.code==1){
                             var group=res.data.group;
                          uni.showToast({
                              icon:'none',
                              title:res.data.message
                          })
                   
                              setTimeout(function(){
                                 if(apply==1){
                                     uni.navigateBack();
                                 } 
                                 else{
                                     uni.redirectTo({
                                         url:"/pages/group/chat?id="+group.id+'&nickname='+group.name
                                     }) 
                                 }
                                  
                              },800)
                                            
                         
                         }
                         else{
                           
                             uni.showToast({
                                 icon:'none',
                                 title:res.data.message
                             })
                           
                         }
                          
                      })  
                      
                  }else{
                  uni.redirectTo({
                      url:"../"+this.next+"?userlist="+this.checkbox
                  })    
                  }
                  
              } else{
                  uni.showToast({
                      title:'请选择用户',
                      icon:'none'
                  })
              }
           }
        
        },
   
       
        onLoad(opts) {
           if(opts.isme==0) this.isme=false;
           if(this.isme) {
            this.userlist=[this.user].concat(this.userlist);
               this.checkbox+="@"+this.user.id
               this.disabled+="@"+this.user.id
           }
           if(opts.disabled_id){
               var arr=opts.disabled_id.split('@');
               for(var i=0;i<arr.length;i++){
                   if(arr[i]>0){
                   
                      this.checkbox+="@"+arr[i];
                      this.disabled+="@"+arr[i]
                   }
                  
                 
               }
                
           }
           if(opts.subtitle) this.subtitle=opts.subtitle;
            if(opts.next) this.next=opts.next;
           if(opts.group_id){
               this.group_id=opts.group_id;
               this.group=uni.getStorageSync('group_'+this.group_id);
               var userlist=[];
               for(var i=0;i<this.userlist.length;i++){
                   if(!this.get_disable(this.userlist[i].id)) userlist.push(this.userlist[i])
               }
               this.userlist=userlist
           }
            
           this.shownum=this.userlist.length;
    		
        }
    }
</script>

<style>
     @import "@/static/css/user.css";
	.page{
        background-color: #fafafa;
        position: relative;
    }
     .usertop{
         height: 50px;
         line-height: 50px;
         background-color: #fafafa;
         padding-top: 5px;;
         position: fixed;
         top: 0px;
         left: 0px;
         width: 100%;
         z-index: 10;
          border-bottom:1px solid #eee;
      
          display: table;
          table-layout: fixed;
     }
     .usertop > view{
         display: table-cell;
     }
     .usertop > view.icon{
         width: 50px;
         text-align: center;
     }
      .usertop > view.avatars{
          text-align: left;
          overflow: hidden;
      }
      .usertop > view.avatars image{
          vertical-align: middle;
          height: 30px;
          width: 30px;
          border-radius: 5px;
          margin: 0px 3px;
      }
      .usertop > view.search{
          text-align: left;
      }
       .usertop > view.search .input{
           display: inline-block;
           width: calc(100% - 80px);
           border:0px;
           border-bottom: 1px #ccc solid;
           color: #222;
           height: 35px;
           line-height: 35px;
           vertical-align: middle;
           
       }
       .usertop > view.search .btn{
           vertical-align: middle;
           float: none;
           display: inline-block;
           background-color: #eee;
           color: #222;
       }
    .userlist{
        
        margin-top: 60px;
       background-color: #fff;
       line-height: 40px;
       width: 100%;
       min-height: 40px;
    }
    .userlist > view{
        width: 100%;
        display: table;
        table-layout: fixed;
        padding: 5px 0px;
           border-top:1px solid #eee;
    }
     .userlist > view:first-child{
         border-top: 0px;
     }
    .userlist > view > view{
        display: table-cell;
        vertical-align: middle;
        
    }
    .userlist > view > view.avatar{
        width: 60px;
        text-align: center;
    }
    .userlist > view > view.avatar image{
        height: 40px;
        width: 40px;
        border-radius: 5px;
        vertical-align: middle;
    }
    .userlist > view > view.nickname{
        font-size: 16px;
        color: #222;
        line-height: 40px;
    }
    .userlist > view > view.icon{
        width: 40px;
        text-align: right;
       
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
      
        color: #fff;
        padding: 0px 15px;
       
        margin-left: 5px;
        cursor: pointer;

        vertical-align: middle;
    }
    .subbutton{
        position: fixed;
        z-index: 100;
        left: 10%;
        width: 80%;
        bottom: 0px;
        height: 40px;
        line-height: 40px;
        border-radius: 10px;
        background-color: #3388ff;
        color: #fff;
        text-align: center;
    }
</style>

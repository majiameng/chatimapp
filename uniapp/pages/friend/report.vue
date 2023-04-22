<template>

    <view class="page">
        
        <view style="text-align: center;height: 320px;width:80%;margin: 0px auto;padding-top:40px;vertical-align: top;">
             <div class="info">
                 <li>
                 <image :src="userInfo.avatar" style="height: 50px;width: 50px;border-radius: 5px;vertical-align: middle;"></image>
                 </li>
        
                 <li style='padding-left: 5px;line-height: 25px;;'>
                    {{userInfo.nickname}}<br>
                      账号：{{userInfo.name}}
        
                 </li>
             </div>
        
        <view class="content">
        <textarea placeholder="请填写投诉理由" v-model="content"  ></textarea>
           
        
        </view>
       <view style="width: 80%;margin: 10px auto;">
         
         <button class="button1" @tap="submit">
               确认并提交
        </button>
       </view>
        
        </view>
    
    </view>
</template>

<script>
	import http from "../../library/http.js"
    import config from "../../config.js"
    export default {
        data() {
        	return {
                content: '',
			  user:uni.getStorageSync('userInfo'),
              userInfo:[]
        	}
        },
        methods: {
            getUserInfo(id){
                var userid=id;
                if(uni.getStorageSync('members_'+userid)) this.userInfo=uni.getStorageSync('members_'+userid);

                http.setWait(false).get('user.php?act=userdetail',{id:userid,userid:this.user.id}).then(res=>{
                  if(res.code==200){
                      this.userInfo=res.data; 
                 uni.setStorageSync('members_'+userid,res.data)   
                  }

                })  
   
            },
            
            submit(){
                if(this.content==''){
                    uni.showToast({
                        icon:'none',
                        title:'请填写投诉理由'
                    })
                    return false;
                }
                
                uni.showModal({
                	title: '提示',
                	content: '是否确认投诉'+this.userInfo.nickname+'？',
                	showCancel: true,
                	cancelText: '取消',
                	confirmText: '确认投诉',
                	success: res => {
                		if(res.confirm) {
                		
                        
                        
                			http.setWait(false).post('user.php?act=toreport',{id:this.userInfo.id,userid:this.user.id,content:this.content}).then(res=>{
                			  if(res.code==200){
                			      
                                    uni.showToast({
                                    	    title:'投诉已提交'
                                    	})
                                        setTimeout(function(){
                                    uni.navigateBack({
                                        delta:1
                                    })        
                                        },1000)
                			  }
                			
                			})  
                		}
                        else{
                           
                        }
                	}
                });
                
            }
        },
        onLoad(opts) {
             this.getUserInfo(opts.id)
     
        }
    }
</script>

<style lang="scss" scoped>
  @import "@/static/css/group.css";
  .page{
      background-color: #fff;
  }
   .info{
        width: 100%;
    display: table;
    table-layout: fixed;
    height: 50px;
    line-height: 50px;
    text-align: left;
    }
    .info > li{
        display: table-cell;
        vertical-align: middle;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .info > li:first-child{
        width: 60px;
      
    }
    .info > li:first-child img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
        border-radius: 5px;
    }
    .info > li:nth-child(2){
        line-height: 25px;
    }
   .content{
       padding: 10px 0px;
   }
   .content textarea{
       width: calc(100% - 20px);
       height: 90px;
       padding: 5px 10px;
       border: 1px #eee solid;
       border-radius: 5px;
       text-align: left;
       font-size: 14px;
       justify-content: left;
       
   }
</style>

<template>
	<view class="page">
		
        <view class="showlines" v-for="(m,index) in list" :key='index' @tap="$jump(m.url)">
            <view >{{m.title}}</view>
            <view>
                <uni-icons type="arrowright" style="font-size: 16px; color: #666;display: inline-block;vertical-align: middle;font-weight: 600;"></uni-icons>
            </view>
        </view>
        
	</view>
</template>

<script>
	export default {
		data() {
			return {
		       list:[]
		
			}
		},
        onLoad(opts) {
            
           var list=[];
           if(opts.act=='setting'){
            list.push({title:'资料设置',url:'mine.profile'});
            list.push({title:'绑定手机',url:'mine.mobile'});
            list.push({title:'登录密码',url:'mine.password'});
            list.push({title:'资金密码',url:'mine.password1'});
            list.push({title:'我的银行卡',url:'mine.bank'});
            list.push({title:'消息通知设置',url:'mine.note'});   
           }
          else if(opts.act=='team'){
             list.push({title:'我的团队',url:'mine.my_invite'});
             list.push({title:'邀请好友',url:'mine.invite'});
             list.push({title:'手动开户',url:'mine.user_add'}); 
              uni.setNavigationBarTitle({
                  title:'我的下级'
              })
          }
          
            
           this.list=list;
        }
	}
</script>

<style>
.page{
    background-color: #fafafa;
}

.showlines{
        display: flex;
        height: 50px;
        line-height: 50px;
        margin-top: 15px;
        flex-direction: row;
        background-color: #fff;
        border-bottom:1px #eee solid;
          
        
    }
    .showlines > view{
       
          flex-direction: row;
          height: 50px;
          line-height: 50px;
    }
  
    .showlines > view:nth-child(1){
        width:calc(100% - 30px);
        text-align: left;
        font-size: 16px;
        color: #000;
        padding-left: 20px;
   
    }
    .showlines > view:nth-child(2){
        width:30px ;
        text-align: center;
    }
      .showlines  image{
          width: 25px;
          height:25px;
          vertical-align: middle;

      }
</style>

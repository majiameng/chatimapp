<template>
	<view class="page">
	    <view v-if="words">
           <view class="words">
           <view class="word" v-for="(m,index) in words" :key='index' >
               <view class="title">{{m.title}}</view>
           </view>            
           </view>
            
        </view>
         <view v-else class="nodata">
             该用户还有群印象！
             
         </view>
        
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo:{},
                words:""
			}
		},
		methods: {
			
		},
        onLoad(opts) {
            this.userinfo=uni.getStorageSync('members_'+opts.id);
            this.words=this.userinfo.logout_words;
            
             uni.setNavigationBarTitle({
                title:this.userinfo.nickname+"的群印象"
            })
        }
        
	}
</script>

<style lang="scss">
    .page{
        font-size: 12px;
    }
   .nodata{
       height: 40px;
       line-height: 40px;
       text-align: center;
       color:#666;
       
   }
   .words{
       
       overflow-y: scroll;
       width: 100%;
       text-align: center;
   }
   
   .words .word{
      display: inline-block;
      margin: 5px 8px;
 
   }
    .words .word .title{
        height: 25px; line-height:25px;
        padding: 0px 5px;
        min-width: 70px;
        
        border-radius: 5px;
        border: 1px #2319dc solid;
          color: #fff;
          background-color: #2319dc;
    }
  
</style>

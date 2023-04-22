<template>
	<view class="page">
		<view v-for="(m,index) in note" :key='index'  class="line" @tap='href(index)'>
            {{m.title}}
            
            <uni-icons type='arrowright' style="display: inline-block;float: right;"></uni-icons>
        </view>
        
	</view>
</template>

<script>
     import uniIcons from '../../components/uni-icons/uni-icons.vue'
          import http from '../../library/http.js'
	export default {
        components: {
        uniIcons
              
        },
		data() {
           
			return {
				  note:uni.getStorageSync('note'),
			};
		},
        
        
        methods:{
            href(index){
                uni.navigateTo({
                    url:'notedetail?index='+index
                })
            },
            getlist(){
                http.setWait(false).get('index.php?act=getnote',{}).then(res=>{
                 var data=res.data;
                 
                  this.note=data;
//                  console.log(data);
                  uni.setStorageSync('note',data);
                })
            }, 
        },
        onLoad() {
            this.getlist();
        }
	}
</script>

<style lang="scss">
   .page{
       background-color: #fafafa;
   }
   
   .line{
       background-color: #fff;
       margin: 10px 0px;
       padding: 0px 10px;
       font-size: 14px;
       height: 40px;
       line-height: 40px;
   }
</style>

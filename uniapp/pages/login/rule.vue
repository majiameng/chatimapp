<template>
    
    <view>

   <view class="content" v-if="type0">
       <rich-text :nodes="toText(system.tipcon1)"></rich-text>
       
  </view>
    
    
    
    
    
    
    
    
	<view class="content" v-if="type1">
<rich-text :nodes="toText(system.tipcon2)"></rich-text>
 </view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				type0:false,
                type1:false,
                system:uni.getStorageSync('system')
			}
		},
		onLoad(opts) {
//               console.log(opts);
              var type=opts.type;
           
              if(type==0){
                  this.type0=true;
                uni.setNavigationBarTitle({
                    title:"用户协议"
                })  
              }else{
                  this.type1=true;
                  uni.setNavigationBarTitle({
                      title:"隐私条款"
                  })  
              }
		},
        onShow(){
          
        },
		computed: {
		
		},
		methods: {
			toText(msg){
			  var text= msg.replace(/<\/?[^>]*>/g, '');  
			    text=text.replace(/\n/g, '<br>'); 
			    text=text.replace(/ /g, '&nbsp;');             
			    return text;
			},
            }
	}
</script>

<style>
        	@import '../../static/css/uni.css';
	  .content{
          line-height: 25px;;
          padding: 5px 10px;;
          text-indent: 2em;
      }
       .content > view{
            text-indent: 2em;
       }
</style>

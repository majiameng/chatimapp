<template>
	<view class="page">
		<view class="title">
		 
		    {{detail.title}}
		</view>
		<view class="time2">
		   
		    {{timestamp(detail.addtime)}}
		</view>
		<view class="content">
		 <!--  <rich-text class="text" :nodes="toText(detail.content)"></rich-text> -->
          <u-parse :content="toText(detail.content)" @navigate="navigate" /> 
		</view>
	</view>
</template>

<script>
    import uParse  from '../../components/gaoyia-parse/parse.vue'
	export default {
        components: {
        	uParse
         
        },
		data() {
			return {
				 note:uni.getStorageSync('note'),
                 detail:''
			}
		},
		methods: {
            navigate(e){
               let params = {url: e};
               return this.$jump('web.index',params)
            },
			toText(msg){
			  var text= msg.replace(/<\/?[^>]*>/g, '');  
			    text=text.replace(/\n\n/g, '<br>'); 
                 // text=text.replace(/\n/g, '<br>'); 
			    //text=text.replace(/ /g, '&nbsp;');  
                           var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                           //  console.log(str);
                            
                             var s = text.match(reg);
                             if(s!=null){
                                 for(var i=0;i<s.length;i++){
                                      text=text.replace(s[i],'<a style="color:#2319dc;" href="'+s[i]+'">'+s[i]+'</a>'); 
                                 }
                             }
                            
			    return text;
			},
			timestamp(time){
			    // return  action.timestampFormat(new Date(time.replace(/(-|年|月)/g, '/').replace('日', '')).getTime()/1000)
			return this.$action.timestampFormat(time)
			  },
		},
        onLoad(opts) {
            this.detail=this.note[opts.index]
        }
	}
</script>

<style lang="scss">
.title{
                    text-align: center;
                    height: 35px;
                    line-height: 35px;
                    color: #000;;
                    font-size: 16px;;
                    font-weight: 600;
                    margin-top: 0px;;
                }
                .title2{
                    text-align: center;
                    height: 30px;
                    line-height: 30px;
                    color: #000;;
                    font-size: 16px;;
                    font-weight: 600;
                }
                .time2{
                    text-align: center;
                    height: 20px;
                    line-height: 20px;
                    color: #666;
                    font-size: 12px;
              
                    border-bottom: 1px #eee solid;
                }
                
                 .content{
                     padding: 5px 10px;
                   
                     line-height: 30px;;
                     overflow-y: scroll;
                     font-size: 14px;
                 }
                 .content .text{
                     line-height: 25px;
                 }
                 
</style>

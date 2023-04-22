<template>
    <view class="body"  :style="'height:'+windowHeight">
	<view class="warp">
        <view class="title">
            移除[{{item.nickname}}]的理由
        </view>
        <view class="words">
	    <view  v-for="(m,index) in words" :key='index' :class="checked.indexOf(m)>-1?'word active':'word'" @tap="check_word(m)">
            {{m}}
        </view>            
        </view>
 <view style="margin-top:10px;text-align:  center;">
                <button class="layer_btns cancel"  @tap="cancel">
                    <uni-icons type='close' style="font-size: 18px;margin-right: 5px;color: #333;font-weight: 600;"></uni-icons>
                    取消</button>
                 <button class="layer_btns ok" @tap="sub()">
                        <uni-icons type='checkbox' style="font-size: 18px;color: #fff;margin-right: 5px;"></uni-icons>
                     确认</button>
            </view>
        
	</view>
    </view>
</template>

<script>
      var windowHeight= uni.getSystemInfoSync().screenHeight;	
      
      import uniIcons from './uni-icons/uni-icons.vue'
	export default {
        components:{
          uniIcons  
        },
        props: {
            item: {
                required: true
            }
           
        },
		data() {
         
			return {
                windowHeight:windowHeight+'px',
				system:uni.getStorageSync('system'),
                words:'',
                checked:'',
                user:uni.getStorageSync('userInfo')
			};
		},
        methods:{
            cancel(){
                this.$emit('cancle')
                    },
            sub(){
                var tips="是否要将["+this.item.nickname+"]移除本群？";
                  var that=this;
                  uni.showModal({
                      title: '提示',
                      content: tips,
                      success: function (res) {
                          if (res.confirm) {
                            var data={type:'deleteGroup',group_id:that.item.group_id,userid:that.item.userid,fromid:that.user.id,mark:that.checked};
                             that.$socket.send(data);  
                           
                             setTimeout(function(){
                                   that.$emit('sub')
                                   that.$emit('cancle')
                                   
                             },100)
                          }
                          
                      }
                  });
            },   
          check_word(word){
                  var checked=this.checked.split(',');
              if(this.checked.indexOf(word)>-1){
             
                 var arr=[];
                 for(var i=0;i<checked.length;i++){
                    
                     if(checked[i]!=word){
                         arr.push(checked[i]);
                     }
                 }
               
                 this.checked=arr.join(',');
              }else{
                  if(checked.length>=this.system['logout_wordsnum']){
                      uni.showToast({
                          icon:'none',
                          title:'最多可以选择'+this.system['logout_wordsnum']+'个踢出理由'
                      })
                      return false;
                  }
                  if(this.checked!='') this.checked+=','
                  this.checked+=word;
              }
             
          }  
        },
        mounted(){
         this.words=this.system['logout_words'].split('|');   
        }
	}
</script>

<style lang="scss">
    .body{
        position: fixed;
        left: 0px;
        width: 100%;
        top:0px;
        z-index: 10;
        background-color: rgba($color: #000000, $alpha:0.6);
    }
 .warp {
     position: fixed;
     left: 10%;
     width: 80%;
     top:25%;
     max-height: 400px;
     z-index: 10;
     background-color: #fff;
     border-radius: 10px;
     padding: 5px 0px;
     border: 1px #eee solid;
 }

 .warp .title{
     height:40px;
     line-height: 40px;
     text-align: center;
     color: #000;
     font-size: 16px;
     
 }
 .words{
     max-height: 300px;
     overflow-y: scroll;
     width: 100%;
     text-align: center;
 }
 
 .words .word{
    display: inline-block;
    margin: 5px 8px;
    height: 32px; line-height: 32px;
    padding: 0px 5px;
    min-width: 70px;
    border: 1px #666 solid;
    border-radius: 5px;
    color: #666;
    background-color: #fff;
 }
  .words .word.active{
      border: 1px #2319dc solid;
      color: #fff;
      background-color: #2319dc;
  }
  .layer_btns{
     
  
  display: inline-block;
      line-height:35px;
      padding: 0px 20px;
      border-radius: 5px;
      border: 0px;
      text-align: center;
      cursor: pointer;
      height:35px;
      color:#fff;
      margin:0px 10px;
      font-size:16px;
  }
  .layer_btns.ok{
      background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
      background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
      background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
      background: linear-gradient(to bottom right, #3388ff , #2319dc);

  }
  .layer_btns.cancel{
      border: 1px solid #666;
      color: #666;
      background-color: #fff;

   
  }
</style>

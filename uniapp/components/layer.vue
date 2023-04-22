<template>
	<view class="modalhtml">
		<view class="modal">
            <view v-if="title!=''" class="title">{{title}}</view>
            <view class="content">
                
                <input class="input" :placeholder="placeholder" v-model="input" />
                
                <view style="text-align: center;padding: 0px 0px;" v-if="isradio">
                   <radio :checked="rediocheck" @tap="rediocheck=!rediocheck">{{radiotext}}</radio>
                    
                </view>
                
            </view>
            <view class="btns">
                <span @tap="close()" >{{btn_cancle}}</span>
                <span @tap="sub()" >{{btn_ok}}</span>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
        props:{
           title:{
               default:'',
           } ,
           btn_cancle:{
               default:'取消'
           },
           btn_ok:{
               default:'确认'
           },
           placeholder:{
               default:''
           },
           value:{
               default:''
           },
           
           isradio:{
               default:false,
           },
           radiotext:{
               default:''
           }
           
        },
        methods:{
            close(){
              this.$emit('close')  
            },
            sub(){
              this.$emit('sub',{input:this.input,rediocheck:this.rediocheck})  
            },
        },
		data() {
			return {
				input:'',
                rediocheck:false,
			};
		},
       mounted() {
           this.input=this.value;
       }
	}
</script>

<style lang="scss">
 .modalhtml{
            position: fixed;
            z-index: 999;
            top:0px;
            width: 100%;
            left: 0px;height: 100vh;
            background-color: rgba(0,0,0,0.7);
            font-size: 14px;;
        }
        .modalhtml .modal{
            background-color: #fff;
            border-radius: 10px;;
            top:30vh;
            width: 80vw;
            left: 10vw;
            position: fixed;
            border: 1px #ddd solid;
        }
        .modalhtml .modal .title{
            text-align: center;
            height: 35px;
            line-height: 35px;
            color: #000;;
            font-size: 16px;;
            font-weight: 600;
            margin-top: 5px;;
        }
        
         .modalhtml .modal .content{
             padding: 5px 10px;
             max-height: 160px;;
   
             line-height: 30px;;
             overflow-y: scroll;
             font-size: 14px;
         }
         .modalhtml .modal .content .input{
             height: 30px;
             line-height: 30px;
             display: inline-block;
             padding: 0px 5px;
             border: 1px #eee solid;
             border-radius: 5px;
             font-size: 14px;
             width: calc(100% - 12px);
         }
         .modalhtml .modal .btns{
             text-align: center;
             height: 35px;
             line-height: 35px;
             color: #000;;
             font-size: 16px;;
             font-weight: 600;
            border-top: #eee 1px solid;
         }
         .modalhtml .modal .btns >span{
             display: inline-block;
             width: calc(50% - 1px);
             height: 35px;
             line-height: 35px;
         }
         .modalhtml .modal .btns >span:last-child{
             border-left: #eee 1px solid;
             color:#2319DC
         }
         
</style>

<template>
	<view class="modalhtml" v-if="isshow">
		<view class="modal">
		    <view class="title">
		       {{title}}
		    </view>
		    <view class="content">
		      {{content}}
		    </view>
		    <view class="btns">
		      <view class="cancel">关闭</view>
              <view class="ok" @tap="ok">确认</view>
		   </view>
		</view>
	</view>
</template>

<script>
	export default {
        props: {
           
           
        },
		data() {
			return {
			     isshow:false,
                 title:'提示',
                 content:'',
                 data:[],
			}
		},
        
		methods: {
			open(data){
              this.data=data;
                this.isshow=true;
            },
            ok(){
                  this.$emit('ok',this.data.ok)
                  this.isshow=false;
            }
            
		}
	}
</script>

<style lang="scss">
.modalhtml{
            position: fixed;
            z-index: 999999;
            top:0px;
            width: 100%;
            left: 0px;height: 100vh;
            background-color: rgba(0,0,0,0.7);
            font-size: 14px;
        }
        .modalhtml .modal{
            background-color: #fff;
            border-radius: 10px;;
            top:28vh;
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
             min-height: 30px;
             line-height: 30px;;
             overflow-y: scroll;
             font-size: 14px;
         }
         .modalhtml .modal .btns{
             text-align: center;
             height: 40px;
             line-height: 40px;
             color: #3388ff;;
             font-size: 14px;;
            
            border-top: #ddd 1px solid;
            display: table;
            width: 100%;
            table-layout: fixed;
         }
         .modalhtml .modal .btns .ok{
         
             display: table-cell;
              font-weight: 600;
             
         }
         .modalhtml .modal .btns .cancel{
             color:#666;
             
               display: table-cell;
              width: calc(50% - 1px);
              border-right: #ddd solid 1px;
             
         }
</style>

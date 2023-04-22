<!-- 下拉菜单组件 -->
<template>
    <view class="quick-menu">
        <view class="menu">
            <view class="triangle"></view>
            <view class="title">
                <view class="lines" v-for="(item,index) in actions" :key="index" @click="handleClick(item, index)" >
              <uni-icons :type='item.icon' class="icon" />
           {{item.text}}
                </view>
            </view>
        </view>
    </view>
</template> 
 
<script>
  import uniIcons from './uni-icons/uni-icons.vue'
    export default {
        components: {
        	
            uniIcons
        },
        name: 'quick-menu',
        props: {
            actions: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        methods: {
            handleClick(data, index) {
                if (typeof data.click === 'function') {
                    data.click(data, index)
                } else {
                    this.$emit('click', data, index)
                }
            }
        }
    }
</script>

<style scoped>
        .quick-menu{
            width: 110px;
            z-index: 999;
            background-color:rgba(0,0,0,0.8);
            position: fixed;
             top: 90upx;
           
           /* #ifndef H5 */
           top:16upx;
           /* #endif */
           
            right: 0upx;
            border-radius: 5px;
            animation-name: zoomin;
            animation-duration: 0.2s;
            -webkit-animation-name: zoomin;
            -webkit-animation-duration: 0.2s;
            font-size: 14px;
        }
        .triangle {
            width:0;
            height:0;
            z-index: 999;
            position: fixed;
        top: 70upx;
        
        /* #ifndef H5 */
        top: 0upx;
        /* #endif */
       
            right: 15upx;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            border-bottom: 12px solid #393A3E;
        }
        
        .lines{
            width: calc(100% - 20px);
            padding: 0px 10px;
            height: 35px;
            line-height: 35px;
            border-bottom: 1px #fff dashed    ;
            color: #fff;
            text-align: center;
        }
            
        .content{
            display: flex;
            align-items: center;
            margin-top: 15upx;
            padding-bottom: 15upx;
            border-bottom: 1px solid #2E2F33;
        }
        
        .lastContent{
            display: flex;
            align-items: center;
            margin-top: 15upx;
            padding-bottom: 15upx;
        }
            
            
      .lines  .icon {
           color:#fff !important
            
        }
        
        .text {
            color: #FFFFFF;
            margin-top: 4upx;
            font-size: 14px;
        }
        
/* 下拉列表组件动画 */        
        
@keyframes zoomin {
    from {
        transform: scale(0.5,0.5);
        opacity: 0;
        filter: alpha(opacity=0);
    }

    to {
        transform: scale(1,1);
        opacity: 1;
        filter: alpha(opacity=100);
    }
}

@-webkit-keyframes zoomin {
    from {
        -webkit-transform: scale(0.5,0.5);
        opacity: 0;
        filter: alpha(opacity=0);
    }

    to {
        -webkit-transform: scale(1,1);
        opacity: 1;
        filter: alpha(opacity=100);
    }
}
        
</style>

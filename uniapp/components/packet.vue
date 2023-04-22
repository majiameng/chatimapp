<template>
    <view class="dialog" @touchmove.stop="">
        <view class="dialog-body">
            <view>
                <image class="avatar" :src="sender.avatar" />
                <view class="username">{{sender.name}}</view>
                <view class="note" v-if="!info.mines.length">{{info.note}}</view>
                <view class="odds">{{mine}}</view>
                <view class="placeholder"></view>
                <view class="empty" v-if="!info.can">手慢了，红包已被抢光了</view>
                <image v-else class="open" src="/static/khb.png" @tap="$emit('open')" />
                <view class="log" @tap="$emit('logs')">看看大家的手气 &gt; </view>
                <view class="emoji" @tap="$emit('close')">&#xe8e7;</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            info: {
                type: Object,
                required: true
            }
        },
        computed: {
            sender() {
                return this.info.sender;
            },
            mine() {
                const {mines, count} = this.info;
                if (!mines.length) return count + '包';
                const string = '单双三四五六七八九'.charAt(mines.length-1) + '雷';
                return count + '包' + string;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dialog {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(#000, .5);
    
        &-body {
            background-color: #d4533d;
            border-radius: $uni-border-radius-base;
            width: 540upx;
            height: 780upx;
            margin: 10vh auto;
            position: relative;
            overflow: hidden;
            color: #c3a774;
            font-weight: bold;
            box-shadow: 0 0 8upx rgba(0,0,0,0.3);
    
            &::before {
                z-index: 0;
                position: absolute;
                display: block;
                width: 600upx;
                height: 620upx;
                content: '';
                top: -40upx;
                left: -30upx;
                background-color: #db5443;
                border-radius: 600upx/300upx;
                box-shadow: 0 4px 4upx rgba(0,0,0,0.1);
            }
            
            > view {
                position: relative;
                z-index: 10;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items:  center;
                padding: $uni-spacing-col-lg $uni-spacing-row-lg;
                box-sizing: border-box;
            }
        }
    
        .emoji {
            position: absolute;
            width: 76upx;
            height: 76upx;
            line-height: 76upx;
            text-align: center;
            top: 10upx;
            right: 10upx;
            color: #777;
        }
    
        .avatar {
            width: 100upx;
            height: 100upx;
            border-radius: $uni-border-radius-base;
            background-color: #ddd;
            margin-top: 20upx;
        }
        .username {
            margin-top: 10upx;
            font-size: 28upx;
        }
        .note {
            padding: $uni-spacing-col-lg $uni-spacing-row-base;
        }
        .placeholder {
            flex: 1;
            width: 10upx;
        }
        .open {
            width: 150upx;
            height: 150upx;
            border-radius: 50%;
            margin-bottom: 60upx;
        }
        .log {
            font-weight: normal;
            text-decoration: underline;
            font-size: 28upx;
        }
        
        .empty {
            margin-bottom: 220upx;
            color: #fff;
        }
    }
</style>

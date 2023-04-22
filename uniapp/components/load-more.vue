<template>
    <view class="load-more">
        <view class="load-more__img" v-show="status === 'loading' && showIcon">
            <view class="load1">
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
            </view>
            <view class="load2">
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
            </view>
            <view class="load3">
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
                <view :style="{ background: color }"></view>
            </view>
        </view>
        <text class="load-more__text" :style="{ color }">{{ text }}</text>
    </view>
</template>

<script>
export default {
    name: 'load-more',
    props: {
        status: {
            // more - 上拉的状态
            // loading - 下拉加载
            // nomore - 没有更多了
            type: String,
            default: 'more'
        },
        showIcon: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: '#777777'
        },
        contentText: {
            type: Object,
            default() {
                return {
                    pulldown: '上拉显示更多',
                    refresh: '正在加载...',
                    nomore: '没有更多数据了'
                };
            }
        }
    },
    computed: {
        text() {
            const { status, contentText } = this;
            if (status === 'more') return contentText.pulldown;
            if (status === 'loading') return contentText.refresh;
            return contentText.nomore;
        }
    }
};
</script>

<style lang="scss">
.load-more {
    display: flex;
    flex-direction: row;
    height: 80upx;
    align-items: center;
    justify-content: center;

    &__text {
        font-size: 28upx;
        color: #999;
    }

    &__img {
        height: 24px;
        width: 24px;
        margin-right: 10px;

        > view {
            position: absolute;

            view {
                width: 6px;
                height: 2px;
                border-top-left-radius: 1px;
                border-bottom-left-radius: 1px;
                background: #999;
                position: absolute;
                opacity: 0.2;
                transform-origin: 50%;
                animation: load 1.56s ease infinite;

                &:nth-child(1) {
                    transform: rotate(90deg);
                    top: 2px;
                    left: 9px;
                }

                &:nth-child(2) {
                    transform: rotate(180deg);
                    top: 11px;
                    right: 0;
                }

                &:nth-child(3) {
                    transform: rotate(270deg);
                    bottom: 2px;
                    left: 9px;
                }

                &:nth-child(4) {
                    top: 11px;
                    left: 0;
                }
            }
        }
    }
}

.load1,
.load2,
.load3 {
    height: 24px;
    width: 24px;
}

.load2 {
    transform: rotate(30deg);
}

.load3 {
    transform: rotate(60deg);
}

.load1 view:nth-child(1) {
    animation-delay: 0s;
}

.load2 view:nth-child(1) {
    animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
    animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
    animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
    animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
    animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
    animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
    animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
    animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
    animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
    animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
    animation-delay: 1.43s;
}

@-webkit-keyframes load {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.2;
    }
}
</style>

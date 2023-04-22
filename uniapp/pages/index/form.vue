<template>
    <view class="page page--divider">
        <view class="title">{{info.title}}</view>

        <!-- 单行输入框 -->
        <input type="text" v-model="value" :placeholder="placeholder" v-if="isText" focus />

        <!-- 多行输入框 -->
        <textarea v-model="value" :placeholder="placeholder" v-if="isLongtext" focus />

        <!-- 单选 -->
        <radio-group class="cell-wrapper" @change="radioChange" v-if="isRadio">
            <label class="cell" v-for="item in info.fields" :key="item.value">
                <view class="cell-hd">{{item.name}}</view>
                <view class="cell-hb"><radio :value="item.value" :checked="value === item.value" /></view>
            </label>
        </radio-group>

        <!-- 多选 -->
        <checkbox-group @change="checkboxChange" v-if="isCheckbox">
            <label v-for="item in info.fields" :key="item.value">
                <view>{{item.name}}</view>
                <view><checkbox :value="item.value" :checked="checkedMap[item.value]" /></view>
            </label>
        </checkbox-group>

        <!-- 帮助信息 -->
        <view v-if="info.help">{{info.help}}</view>

        <view class="widget">
            <view class="btn btn-error" @tap="handleSubmit">{{confirmText}}</view>
        </view>
    </view>
</template>

<script>
    function is(type) {
        return function () {
            return this.info.type === type;
        }
    }

    export default {
        data() {
            return {
                info: {},
                value: null,
                event: null,
                checkedMap: {},//多选使用
            };
        },
        computed: {
            
        },
        methods: {
            
        },
        onLoad(opts) {
            
        }
    }
</script>

<style lang="scss" scoped>

    .page {
        padding-top: $uni-spacing-col-lg;
    }

    .title {
        padding: $uni-spacing-col-lg;
        padding-bottom: $uni-spacing-col-sm;
        color: #999;
    }

    input,
    textarea {
        background-color: #fff;
        font-size: 32upx;
        padding: $uni-spacing-col-lg;
        box-sizing: content-box;
    }

    textarea {
        width: 100%;
        box-sizing: border-box;
    }

    .widget {
        margin-top: $uni-spacing-col-lg;
    }
</style>
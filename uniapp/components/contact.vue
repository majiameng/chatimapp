<template>
	<view class="list-wrapper">
            <view class="list">
                <view class="list-item"
                    v-for="item in items"
                    :hover-start-time="20" 
                    :hover-stay-time="70" 
                    :key="item.id"
                    hover-class="commonly-hover"
                    @tap="handleClick(item)"
                >
                    <image class="avatar"
                        mode="aspectFill"
                        :src="item.avatar"
                        @tap.stop="handleAvatar(item)"
                    />
                    <view class="info">
                        <view class="nickname">{{item.nickname || item.name}}</view>
                    </view>
                    <checkbox
                        v-if="selectMode"
                        :checked="selectedMap[item.id]"
                        :disabled="disabledMap[item.id]"
                        @tap.stop="handleClick(item)"
                    />
                </view>
            </view>
    </view>
</template>

<script>
    const hasOwn = Object.prototype.hasOwnProperty;

    export default {
        props: {
            items: {
                required: true,
            },
            selectMode: {
                type: Boolean,
                default: false
            },
            checkedMap: {
                type: Object,
                default: () => ({})
            },
            disabledMap: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                selectedMap: {}
            }
        },
        watch: {
            checkedMap() {
                this.lookCheckedMap();
            },
            disabledMap() {
                this.lookCheckedMap();
            }
        },
        methods: {
            inDisabledMap(id) {
                return hasOwn.call(this.disabledMap, id);
            },
            inCheckedMap(id) {
                return hasOwn.call(this.checkedMap, id);
            },
            inSelected(id) {
                return typeof this.selectedMap[id] === 'boolean';
            },
            setToSelected(id) {
                const selected = Boolean(this.selectedMap[id]);
                this.$set(this.selectedMap, id, !selected);
            },
            handleAvatar(item) {
                if (this.selectMode) {
                    this.handleClick(item);
                } else {
                    this.$emit('avatar', item);
                }
            },
            handleClick(item) {
                if (!this.inDisabledMap(item.id)) {
                    if (this.selectMode) {
                        this.setToSelected(item.id);
                        item.selected = this.selectedMap[item.id];
                        this.$emit('select', item);
                    } else {
                        this.$emit('click', item);
                    }
                }
            },
            lookCheckedMap() {
                Object.keys(this.checkedMap).forEach(id => {
                    // if (!this.inDisabledMap(id)) {
                        this.setToSelected(id);
                    // }
                })
            }
        },
		created() {
			console.log(1)
		},
        onLoad() {
            this.lookCheckedMap();
			console.log(2)
        }
    }
</script>

<style lang="scss" scoped>
    $list-avatar-width: 88upx;
    
    .list-wrapper {
    	position:relative;
        box-sizing: border-box;
        padding: $uni-spacing-col-base $uni-spacing-row-base;
    }
    
    .list {
    	width: 100%;
        box-sizing: border-box;
        
    	.list-title,
    	.list-item {
    		width: 100%;
    		font-size: 32upx;
    		padding: 0 20upx;
            box-sizing: border-box;
    	}

        .list-title {
        	background-color: #eee;
        	height: 92upx;
        	line-height: 92upx;
    		font-weight: bold;
        }
         
        .list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
        	background-color: #fff;
            position: relative;
            padding: $uni-spacing-col-base $uni-spacing-row-base;
            
            .avatar {
                width: $list-avatar-width;
                height: $list-avatar-width;
                margin-right: $uni-spacing-row-base;
                border-radius: $uni-border-radius-base;
                overflow: hidden;
                display: flex;
                flex-flow: wrap;
                justify-content: center;
                background-color: #eee;
                align-items: center;
                flex-shrink: 0;
                
                &:not(image) {
                    padding: 1upx;
                }
        
                view,
                image {
                    width: ($list-avatar-width - 2upx * 4) / 3;
                    height: ($list-avatar-width - 2upx * 4) / 3;
                    margin: 1upx;
                }
            }
            
            &:last-child {
                border-bottom-left-radius: $uni-border-radius-base;
                border-bottom-right-radius: $uni-border-radius-base;
            }
            
            &:not(:last-child)::before {
                display: block;
                content: '';
                bottom: 0;
                left: $uni-spacing-row-base * 2 + $list-avatar-width;
                right: $uni-spacing-row-base;
                height: 1upx;
                position: absolute;
                background-color: #E6E6E6;
                transform: scaleY(0.5);
            }
        
            &.commonly-hover {
            	background-color: #eee;
            }
            
            text {
                flex: 1;
            }
        }

        .nickname,
        .description {
            width: 750upx - $uni-spacing-row-base * 6 - $list-avatar-width - 44upx;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        
        .description {
            font-size: 28upx;
            color: #999;
        }
        
        .list-title + .list-item {
            border-top-left-radius: $uni-border-radius-base;
            border-top-right-radius: $uni-border-radius-base;
        }
    }
</style>

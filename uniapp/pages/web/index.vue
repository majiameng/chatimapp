<template>
	<view class="page page--divider">
        <web-view :webview-styles="webviewStyles" :src="url" ></web-view>
    </view>
</template>

<script>
	export default {
		data() {
            return {
				url: '',
                webviewStyles: {
                    progress: {
                        color: '#2319dc'
                    }
                }
            }
        },
        onLoad(opts) {
            
           this.url=decodeURIComponent(opts.url);
        },
        onNavigationBarButtonTap(e) {
            var that=this;
           uni.showActionSheet({
               itemList:['用浏览器打开'],
               success: (res) => {
                 plus.runtime.openURL(that.url)  
               }
           }) 
        },
	}
</script>

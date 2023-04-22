
export default {
	storage(key, value){
			try{
				if(arguments.length == 1) {
					return uni.getStorageSync(key);
				}
				if(arguments.length > 1) {
					if(value === null){
						uni.removeStorageSync(key);
					} else {
						uni.setStorageSync(key, value);
					}
				}
			}catch(e){
				uni.showToast({
					icon:'none',
					title: '程序发生错误'
				});
			}
		}
}
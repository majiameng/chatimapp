import config from '../config.js'
export default {
	/**
	 * 图片上传，支持多图
	 * @author nullfeng
	 * @param Array <images> 本地路径数组
	 * @param Function [complete] 回调函数()
	 * @return Promise
	 */
	uploadFiles(images, type,data,complete){
       //console.log(config.apiUri)
       if(type=='images' || type=='avatar') var url=config.apiUri+'upload.php?act=uploadImage';
       else if(type=='Vedio')var url=config.apiUri+'upload.php?act=uploadVedio';
       else var url=config.apiUri+'upload.php?act=uploadFile';
		let queue = [];
		images.forEach(image=>{
			queue.push(new Promise((resolve,reject)=>{
				uni.uploadFile({
					url: url,
					filePath: image,
					name: 'file',
					fileType: type,
					formData:data,
                    header: {
                 
                    },
					success: res => {
                            
						let result = JSON.parse(res.data);

						if(result.uploaded) {
                             
                            var url=config.imgUri+result.url;
                      
							resolve(url);
						} else {
							uni.showModal({
								content: result.message,
								showCancel: false
							});
						}
					},
					fail: err => {
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						});
						reject();
					}
				});
			}));
		});
		if(!queue.length) queue.push(new Promise((resolve,reject)=>{resolve("")}));
		return new Promise((resolve,reject)=>{
			Promise.all(queue).then(res=>{
				complete && complete(res.join('|'));
				resolve(res.join('|'));
			}).catch(res=>{
				reject();
			});
		});
	},
    
    
	/**
	 * 格式化时间
	 */
	formatDate(date, fmt) {
		if(typeof(date)=="string") {
			date = new Date(date.replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/'));
		}
		var o = {
			"m+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"i+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
};
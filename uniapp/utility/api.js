import config from '../config';

/**
 * 什么事情都不做
 */
function noop() {}

export function getCurrentWebview() {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return page.$getAppWebview();
}

export function reject(reason) {
    return Promise.reject(reason);
}

export function resolve(data) {
    return Promise.resolve(data);
}

/**
 * 将 JSON 数据转换成 QueryString
 * @param {Object|Array} object 被转换的JSON数据
 * @param {String} [prefix=''] 键名前缀
 * @return {String}
 */
export function qs(object, prefix = '') {
	if (Array.isArray(object)) {
		if (!prefix) {
			throw new Error('must given a not empty prefix');
		}

		return object.map(function (val) {
            if (val == null) return prefix + '[]=';
            switch(typeof val) {
                case 'boolean':
                    return prefix + '[]=' + (val ? 1 : 0);
                case 'number':
                    return prefix + '[]=' + val;
                case 'object':
                    return qs(val, prefix + '[]');
                default:
                    return prefix + '[]=' + encodeURIComponent(val);
            }
		}).join('&');
	}

	return Object.keys(object).map(function (prop) {
		const value = object[prop];
		const key = prefix ? `${prefix}[${prop}]` : prop;
        if (value == null) return key + '=';
        if (typeof value !== 'object') return key + '=' + encodeURIComponent(value);
        return qs(value, key);
	}).join('&');
}

/**
 * 页面跳转
 * @param {String} page 页面路径或网络地址
 * @param {Object|Function} params 页面跳转参数或接口调用结束的回调函数
 * @param {Function} [completion] 接口调用结束的回调函数（调用成功、失败都会执行）
 * @return {Promise}
 */
export function jump(page, params, completion = noop) {
	let url = null;

	if (/^\/\//.test(page)) {
		page = 'http:' + page;
	}

	if (/^https?:\/\//i.test(page)) {
		url = page;
		page = 'pages/web/index';
	}

	if (url) {
		params = { url };
	}
	
	page = page.split(/\.+/).join('/');
	
	if (!/^\/?pages\//.test(page)) {
		page = '/pages/' + page.replace(/^\/+/, '');
	}

	const query = params ? qs(params) : null;
	return new Promise(function (resolve, reject) {
       var url= page + (query ? '?' + query : '');
    
     
		uni.navigateTo({
			url: url,
		});
	});
}
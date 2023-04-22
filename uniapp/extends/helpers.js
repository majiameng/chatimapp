import {networkImage} from '../utility/lang';
import {jump} from '../utility/api';

function toast(message, icon = 'none') {
    if (message && message.message) {
        message = message.message;
    }

    if (!message) {
        return;
    }

    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }

    //console.log('[toast] ' + message);

    return new Promise((resolve,reject)=>{
		uni.showToast({
		    title: message,
		    icon,
			duration: 1500
		});
		setTimeout(()=>{
			resolve();
		},1500);
	});
}

export default function install(Vue) {
    Object.defineProperties(Vue.prototype, {
        $toast: {get: () => toast},
        $img: {get: () => networkImage},
        $jump: {get: () => jump},
    });
}

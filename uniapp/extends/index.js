import Emitter from '../utility/emitter';
import storage from './storage';
import store from './store';
import helper from './helpers';

let bus = null;

function install(Vue) {
    if (bus instanceof Emitter) {
        return;
    }

    bus = new Emitter();

    Object.defineProperties(Vue.prototype, {
        $bus: {get: () => bus},
        $storage: {get: () => storage},
    });

    // 爲什麽不能使用 Object.defineProperty 只定義 getter ???
    Vue.prototype.$store = store;

    helper(Vue);
}

export default {
    install,
}

function getListeners(emitter, type) {
    if (!emitter._events) emitter._events = Object.create(null);
    return emitter._events[type] || (emitter._events[type] = []);
}

function assertIsFunction(fn, name) {
    if (typeof fn !== "function") {
        throw new Error(name + ' must be a function');
    }
}

export default class Emitter {
    on(channel, listener) {
        if (Array.isArray(channel)) {
            channel.forEach(c => this.on(c, listener));
        }  else {
            assertIsFunction(listener, 'listener');
            getListeners(this, channel).push(listener);
        }
        return this;
    }

    once(channel, listener) {
        assertIsFunction(listener, 'listener');

        function fn(...args) {
            if (fn.called) return;
            this.off(channel, fn);
            fn.called = true;
            listener(...args);
        }

        fn.listener = listener;
        fn.called = false;

        return this.on(channel, fn);
    }

    off(channel, listener) {
        if (Array.isArray(channel)) {
            channel.forEach(c => this.off(c, listener));
            return;
        }

        let listeners;

        if (!this._events || !(listeners = getListeners(this, channel)).length) {
            return;
        }

        if (!listener) {
            listeners.length = 0;
            return;
        }

        assertIsFunction(listener, 'listener');

        for (let i = listeners.length - 1; i >= 0; i--) {
            const fn = listeners[i];

            if (fn === listener || fn.listener === listener) {
                listeners.splice(i, 1);
            }
        }
    }

    emit(channel, ...args) {
        getListeners(this, channel).forEach(listener => {
            listener.apply(this, args);
        });
    }
}
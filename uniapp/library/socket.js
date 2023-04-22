const LOG_DEBUG = false;
export default new class {
	constructor() {
		this.handlers = {};
		this.queue = [];
		this.status = false;
		this.timer = null;
        this.timer1 = null;
        this.timer2 =null;
        this.url='';
        
	}
	connect(url) {
        this.url=url;
		uni.connectSocket({
			url,
             fail: () => {
               this.status=false;
                if(this.timer1!=null)clearInterval(this.timer1)
                 this.timer1=setInterval(()=>{
                 	if(!this.status) {
              	  this.connect(this.url);
              	     }
           
              }, 3* 1000);
              
            },
		});
        if(this.timer!=null)clearInterval(this.timer)
		this.timer = setInterval(()=>{
			if(!this.status) {
				
				this.connect(url);
              
                LOG_DEBUG && console.log('[socket] reconnect');
			}
        
		}, 5 * 1000);
		uni.onSocketOpen(() => {
			this.status = true;
			while (this.queue.length) this.send(this.queue.pop());
			LOG_DEBUG && console.log('[socket] init');
        clearInterval(this.timer2)
               this.timer2=setInterval(()=>{
               	if(this.status) {
            	 this.send({
            	 	type: 'ping'
            	 });
      }
                       
            }, 5* 1000);
			this.emit('init');
		});
		uni.onSocketError(() => {
			this.status = false;
			LOG_DEBUG && console.log('[socket] error');
			this.emit('error');
		});
		uni.onSocketMessage((res) => {
			let result = JSON.parse(res.data);
			if (result) {
				LOG_DEBUG && console.log('[socket] recevice : ', result);
				switch (result.type) {
					case 'ping':
                      // console.log(result);
						this.send({
							type: 'pong'
						});
						break;
					case 'message':
						this.send({
							type: 'commit',
							data: result.commit_id
						});
						this.emit('message', result.data);
						break;
					default:
						this.emit(result.type, result);
						break;
				}
			}
		});
		uni.onSocketClose(() => {
			this.status = false;
			LOG_DEBUG && console.log('[socket] close');
			this.emit('close');
		});
	}
	send(data) {
		if (this.status) {
			LOG_DEBUG && console.log('[socket] send', data);
			uni.sendSocketMessage({
				data: typeof(data) == 'string' ? data : JSON.stringify(data),
                success: () => {
                },
                fail: () => {
                  this.status = false;
                  this.connect(this.url);
                  this.queue.push(data);
                },
                
			});
		} else {
			this.queue.push(data);
            this.connect(this.url);
		}
	}
	on(eventType, handler) {
		var self = this;
		if (!(eventType in self.handlers)) {
			self.handlers[eventType] = [];
		}
		self.handlers[eventType].push(handler);
		return this;
	}
	emit(eventType) {
		var self = this;
		var handlerArgs = Array.prototype.slice.call(arguments, 1);
		if (!self.handlers[eventType]) return self;
		for (var i = 0; i < self.handlers[eventType].length; i++) {
			self.handlers[eventType][i].apply(self, handlerArgs);
		}
		return self;
	}
	off(eventType, handler) {
		var currentEvent = this.handlers[eventType];
		var len = 0;
		if (currentEvent) {
			len = currentEvent.length;
			for (var i = len - 1; i >= 0; i--) {
				if (currentEvent[i] === handler) {
					currentEvent.splice(i, 1);
				}
			}
		}
		return this;
	}
};

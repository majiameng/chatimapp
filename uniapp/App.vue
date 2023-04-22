<script>
	import api from "./library/index.js"
	import http from "./library/http.js"
	export default {
	   data() {
	       return {
	           state: 0
	       };
	   },
        methods: {
	        check_update(){
	           
	            /** 检测升级 */
	          
	                 // #ifdef APP-PLUS
                  
	              let _this = this;
	              	     
	                  plus.runtime.getProperty(plus.runtime.appid, function(info) {
	                                 
	                      api.update({version: info.version,osname:plus.os.name}).then(res=>{
	                             //   console.log(res);
	                          if(res.data.status==1) {
	                        
	                  uni.showModal({ //提醒用户更新
	                                    title: "更新提示",  
	                                    content: res.data.content,  
	                                    cancelText: '下次再说',
	                                    confirmText: '立即更新',
	                                    success: (r) => {  
	                                        if (r.confirm) {  
	                                            
	                                            plus.runtime.openURL(res.data.downurl);  
	                                        } 
	                                        
	                                    }  
	                                }) 
	                          }
	                     })
	                  
	                  });  
	                   // #endif
	        },
            
            tochat(message){
                if(uni.getStorageSync('ispush')!=false){
               if(message.id>0){
                    var url="pages/friend/chat?id="+message.id;
                    if(message.type=='group') url="pages/group/chat?id="+message.id;
                    uni.navigateTo({
                        url:url
                    })
                //   console.log(url) 
                   
                }
                else{
                   uni.navigateTo({
                       url:'pages/index/index',
                       success: () => {
                           uni.setStorageSync('ispush',false)
                       }
                   }) 
                }        
                    
                }
                
            },
             handlePush(message,type){
                 try{
                     message=JSON.parse(message);
                 }catch(e){
                     //TODO handle the exception
                 }
                 if(message.payload!=undefined) {
                  message=message.payload;
                     try{
                         message=JSON.parse(message);
                     }catch(e){
                         //TODO handle the exception
                     }
                 }
                
                 uni.setStorageSync('ispush',true);
                 uni.setStorageSync('pushmessage',message)
             
                 if(type=='click'){
                  var that=this;
             
                     uni.$emit('toChat',message);
           
             
                 }
                 else{
                     // if(state==0){
                     //     console.log(message)；
                     //     plus.push.createMessage(message.content, JSON.stringify(message), {
                     //         cover: true,
                     //         title: message.title
                     //     });
                     // }
                 }
                 
                                    
                 
             },
             bindcid(){
                  
                var user=uni.getStorageSync('userInfo');
                  if(user.id>0){
                     var clientid= plus.push.getClientInfo().clientid;
                   
                     http.setWait(false).get('index.php?act=bindcid',{cid:clientid,userid:user.id,osname:plus.os.name}).then(res=>{
                    
                     })
                  }
             },
             client_change(isonline){
              
             this.state=isonline;
                    // #ifdef APP-PLUS
                    if(isonline==1)    plus.push.clear();
                      var clientid= plus.push.getClientInfo().clientid;
                 http.setWait(false).get('index.php?act=client_change',{cid:clientid,isonline:isonline}).then(res=>{
                      
                 });
                   // #endif
             }
       
        },
        onLaunch() {
          this.$action.init();
	
	         // #ifdef APP-PLUS
	        /** 锁定屏幕方向 */
	        plus.screen.lockOrientation('portrait-primary');
	      
	      var that=this;
          this.bindcid();
	      setTimeout(function(){that.check_update();},90000)
                   var that=this;
                       //监听push推送通知
                       
                       plus.push.addEventListener('receive', function(message) {
                           //  console.log('receive')
                       //	that.handlePush(message,'receive');
                       });
                       
                       //监听点击通知栏
              			plus.push.addEventListener('click', function(message) {
                        
              				that.handlePush(message,'click');
              			});
      
                   
	        // #endif
            
            
        
          
        } 
        ,
        onHide() {
           
            this.client_change(0);
      // var message={title:'标题测试',content:'内容2222',id:86668,type:'friend'}
        
      // plus.push.createMessage(message.content, JSON.stringify(message), {
      //     cover: true,
      //     title: message.title
      // });
      //  console.log(message);
      
      
 
        },
        onShow() {
        
            
  
        
        this.client_change(1);
             
        },
      
      
	}
</script>

<style lang="scss">
    // 图标字体
    @font-face {
        font-family: fonticon;
        src: url('~@/static/iconfont.ttf');
    }
    .emoji {
        font-family: fonticon;
        font-size: 44upx;
    }

	// 所有页面都应该使用该类类初始化页面背景、大小和盒子模型
	.page {
        -webkit-touch-callout:none;/*系统默认菜单被禁用*/
        
        -webkit-user-select:none;/*webkit浏览器*/
        
        -khtml-user-select:none;/*早起浏览器*/
        
        -moz-user-select:none;/*火狐浏览器*/
        
        -ms-user-select:none;/*IE浏览器*/
        
        user-select:none;/*用户是否能够选中文本*/
		background-color: #FFFFFF;
		width: 100vw;
		min-height: 100vh;
		box-sizing: border-box;

        &--divider::before {
            z-index: 100;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 1upx;
            background-color: #ddd;
            display: block;
            content: '';
            transform: scaleY(0.5);
        }
	}

	// 参考 https://uniapp.dcloud.io/component/navigator?id=navigator
	// 去掉 navigator 组件的默认的点击态效果
	.navigator-hover {
		position: relative;
		background-color: transparent;
		opacity: 1;
	}

	// 简单容器样式
	.widget {
		background-color: transparent;
		padding: 0px 0px;

		& + & {
			padding-top: 0;
		}

		&-inner {
			border-radius: $uni-border-radius-base;
			background-color: $uni-text-color-inverse;
		}

		&-inner + &-inner {
			margin-top: $uni-spacing-col-base;
		}
	}

	// 基本按钮样式
	.btn {
		padding: 28upx;
		border-radius: $uni-border-radius-base;
		text-align: center;
		font-size: 30upx;
		background-color: $uni-text-color-inverse;
		color: $uni-text-color;
		border: 1upx solid rgba(#000000, .1);

        &-round {
            border-radius: 100upx;
        }

		&-primary {
			background-color: $uni-color-primary;
			color: $uni-text-color-inverse;
		}

		&-success {
			background-color: $uni-color-success;
			color: $uni-text-color-inverse;
		}

		&-warning {
			background-color: $uni-color-warning;
			color: $uni-text-color-inverse;
		}

		&-error {
			background-color: $uni-color-error;
			color: $uni-text-color-inverse;
		}
	}

    .cell-wrapper {
        position: relative;
        margin-top: $uni-spacing-col-base;
        background-color: #fff;

        .cell-hd::before,
        &::before,
        &::after {
            display: block;
            content: '';
            position: absolute;
            right: 0;
            height: 1upx;
            transform: scaleY(0.5);
            background-color: #ddd;
        }

        &::before {
            left: 0;
            top: 0;
        }

        &:after {
            left: 0;
            bottom: 0;
        }
    }

    .cell {
        position: relative;
        padding: 0 $uni-spacing-row-lg;
        line-height: 106upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        box-sizing: border-box;

        &:first-child &-hd::before {
            display: none;
        }

        &-hd {
            font-size: 30upx;

            &::before {
                top: 0;
                left: $uni-spacing-row-lg;
            }
        }

        &-hb {
        
            font-size: 30upx;
            color: #777;
        }

        &.arrow {
            padding-right: $uni-spacing-row-lg + 25upx;
        }

        &.arrow::before,
        &.arrow::after {
            position: absolute;
            transform: rotate(45deg);
            width: 20upx;
            height: 20upx;
            content: '';
            display: block;
            top: 50%;
            margin-top: -11upx;
        }

        &.arrow::before {
            background-color: #777;
            right: $uni-spacing-row-lg;
        }

        &.arrow::after {
            background-color: #fff;
            right: $uni-spacing-row-lg + 4upx;
        }
    }
	
	
@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');}


.n-icon {
  font-family: "HMfont-home" !important;
}

.n-icon-face:before {
  content: "\e797";
}

.n-icon-keyboard:before {
  content: "\e7b2";
}

.n-icon-voice:before {
  content: "\e805";
}

.n-icon-image:before {
  content: "\e639";
}
.n-icon-paizhao:before {
		  content: "\e63e";
		}
.n-icon-thunder:before {
  content: "\e63a";
}
	
</style>
<template>
    <view >
        <view v-if="showPanel" style="height:75px;display: block;">
        	
        </view>
        

	<view class="v-sender"  id="v-send" >

    
		<view class="v-sender__control">
            <!-- #ifndef H5 -->
      <view class="emoji" @tap="sendVoice">
      	<text v-if="!voice && !noSpeaking" class="n-icon n-icon-voice"></text>
      	<text v-else class="n-icon n-icon-keyboard"></text>
      </view>
      <!-- #endif -->

	
			<block v-if="noSpeaking">
				<view class="falseinput" style="text-align: center;color: #999;margin-left: 16upx;margin-right: 20upx;margin-left:10px;" >{{speaking_tips}}</view>
	
			</block>
           
			<block v-else>
			 <textarea  id="sendbox" maxlength="99999999999" auto-height="true" :class="{'textarea':true,'input':input_value && !voice}" v-model="input_value"  v-if="!voice" type="text" @input="listen('input', $event.detail.value)" 
				 @confirm="set_focos()" @tap="sendertap();"  confirm-type='发送'  adjust-position="ture" confirm-hold="true"  cursor-spacing="15" >
              </textarea>
				<view v-else :class="{'falseinput':true,'press':setting}" style="text-align: center;color: #222;margin-right: 20upx;" 
                @touchstart="startVoice"
				 @touchend="endVoice"
                 @touchmove.stop.prevent="voiceIng" @touchcancel="voiceCancel"
                 >{{voiceTis}}</view>
		
	
				<!-- 图片/表情 -->
             
          
              
                    <view class="emoji" @tap="showemoji();" v-if="!emoji"><text class="n-icon n-icon-face"></text></view>
                       <view class="emoji" @tap="hideemoji();" v-if="emoji"><text class="n-icon n-icon-keyboard"></text></view>
                 
    
             	
				
		<view class="btn sendbtn" v-if="input_value && !voice" @touchend.prevent="tapsender" >发送</view>
		  <view class="bigbox3" v-if="!input_value && !voice">
        <view class="emoji" @tap="show_panel();" v-if="!showPanel&&!input_value"><text>&#xe634;</text></view>
        <view class="emoji" @tap="hide_panel();" v-else-if="showPanel&&!input_value"><text>&#xe603;</text></view>
        </view>
			</block>
		</view>
        <view class="record" :class="setting?'':'hidden'">
        	<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
        	<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
        	<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
        </view>
		<view v-if="emoji" class="face_box">
		
			<view  style="width: 100%;">
			
					<view class="emotion-box" style="height:200px">
						<view class="emotion-box-line" v-for="(line, i) in lists" :key="i">
							<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="handleEmotion(item)">
				        <image :src="'/static/emoji/'+item.name+'.gif'" style="width: 50rpx;height: 50rpx;"></image>				  

							</view> 
				            
						</view>
					</view>
				
			
			</view>
		</view>
		<view v-if="showPanel" class="v-sender__panel">
            <view @click="sendImg('album')">
            	<view class="icons"><text class="n-icon n-icon-image"></text></view>
            	<view>图片</view>
            </view>
            
            <view class="box" @click="sendImg('camera')">
            	<view  class="icons"><text class="n-icon n-icon-paizhao"></text></view>
            	<view>拍照</view>
            </view>
            <view class="box" @click="sendVedio('album')">
            	<view  class="icons"><image src="../static/img/vedio.png" ></image></view>
            	<view>视频</view>
            </view>
            <view class="box" @click="sendVedio('camera')">
            	<view  class="icons"><image src="../static/img/camera.png" ></image></view>
            	<view>录像</view>
            </view>
            
            <view class="box" @click="sendRedpactet()">
            	<view  class="icons"><image src="../static/img/redpacket.png" style="width: 26px;" ></image></view>
            	<view>红包</view>
            </view>
            
      
	
		</view>
	</view>
    

        </view>
</template>

<script>
    
  
const recorderManager = uni.getRecorderManager();

	const { windowWidth, windowHeight } = uni.getSystemInfoSync();	

	import helper from "../library/helper.js"
	import api from "../library/index.js"
    	import action from "../library/action.js"
	export default {
		name: 'v-sender',
		props: {
	
			placeholder: {
				type: String,
				default: '说点什么吧'
			},
            value: {
            	type: String,
            	default: ''
            },
			noSpeaking: {
				type: Boolean,
				default: false
			},
            speaking_tips:{
                
            },
       
			forbidRedpack: {
				type: Boolean,
				default: false
			},
            showboard:{
                type: Boolean,
                default: false
            },
            groupid:{
                type:[Number,String],
                default:0
            },
            isgroup:{
              default:0  
            },
            sendtype:{
                type:[Number,String],
                default:'text'
            }
		},
        
	
		data() {
			return {
				showPanel: false,
				showPacket:false,
				voice: false,
				text: 'uni-app',
				voicePath: '',
				setting: false,
				emoji: false,
				faceImg: {},
				swipers: [],
             
              voiceTis: '按住 说话',
              recordTis: "手指上滑 取消发送",
              recording: false,
              willStop: false,
              initPoint: { identifier:0, Y:0 },
              recordTimer: null,
              recordLength: 0,
              mids:{},
              uploadnum:0,
              starttime:0,
              endtime:0,
              voice_mid:'',
              focus:false,
              input_value:'',
              area_value:'',
              inputclass:'textarea',
              sendtime:0,
               keyboardheight:0,
               borderheight:0,
               user:uni.getStorageSync('userInfo'),
              list: [
              	['微笑','撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴'],
              	['睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过'],
              	['酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢'],
              	['饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂'],
              	['疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见'],
              	['擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠'],
              	['鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀'],
              	['西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', ],
              	['凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀'],
              	['足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强'],
              	['弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你'],
              	['NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈'],
              	[ '磕头', '回头', '跳绳', '挥手', '激动','闭嘴', '笑哭', '吐舌'],
                ['耶', '跳舞','恐惧','失望','脸红','无语','奸笑','嘿哈'],
                ['鬼混','福','合十','强壮','红包','发财','庆祝','礼物']
              ],
              reg: /\S{1,3}/gi,
              lists:[],
              listss:[]
			}
		},
       
        
        mounted() {
        	    
        	let that = this;
       // #ifdef APP-PLUS
    recorderManager.onStart((e)=>{
           
         	this.recordBegin(e);
         })
          recorderManager.onStop(res => {
         this.recordStop(res);
               	 			
               	 			});
         
         
         
   
          // #endif
       var value = '';
       this.list = this.list.map((line,index) => {
           this.listss = [];
           line = line.map((item,idx) => {
               
               value = item;
              
               item = item.replace(/\S{1,3}/gi,this.emotion(item));
              
               this.listss.push({"name":item,"index":index,"value":value,"idx":idx})
              
               return item;
          
           })
           
           this.lists.push(this.listss);
           
           return line;
       })
       


         
       
        				
},
		computed: {

			sendShowing() {
				return this.value.length > 0 
			},
      
           
		},
		methods: {
        
        
            emotion(res) {
            	//let word = res.replace(/\#|\;/gi,'')
            
            	const list =['微笑','撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动','闭嘴', '笑哭', '吐舌','耶', '跳舞','恐惧','失望','脸红','无语','奸笑','嘿哈','鬼混','福','合十','强壮','红包','发财','庆祝','礼物']
            	let index = list.indexOf(res)
                var index1=index+100;
            	return index1
            },
            showemoji(){
                this.showPanel=false;
                this.emoji=true;
            //   this.setChatHeight();
            },
            hideemoji(){
                this.showPanel=false;
           
                this.emoji=false;
         //  this.setChatHeight();
            },
            
            show_panel(){
                this.showPanel=true;
                this.emoji=false;
               this.setChatHeight();
            },
            hide_panel(){
                this.showPanel=false;
                this.emoji=false;
              this.setChatHeight();
            },
         
            setChatHeight(){
            // 
               
                //  console.log(this.sendHeight);
                   var that=this;
                 setTimeout(() =>{
              
                  var that=this;
                     var  query = uni.createSelectorQuery(); // 这里要加上select
                  
                      query.in(that).select('#v-send').boundingClientRect(res => {
                      		var hh=(parseInt(res.height)-60);
                          this.$emit("senderheight",hh);
                           
                        }).exec(); 
         
              },100);
            },
 
			sendVedio(type) {
				let that = this
				uni.chooseVideo({
                    sourceType:[type],
                    maxDuration: 15, 
                    compressed:false,
                    
					success(re) {
                       // console.log(re.tempFilePath);
                         //console.log(re.tempFilePaths[0]);
                         that.sendertap();
                      
                            var mids='m' + Math.random().toString(36).substring(2);
                           
                              
                            var duration=re.duration;
                             that.$emit('sendVedio', {mid:mids,src: re.tempFilePath,time:duration});
                             var _that=that;
                             helper.uploadFiles([re.tempFilePath], 'Vedio', {
                             	type: 'vedio'
                             }).then(res => {
                               
                             	that.$emit('sendVedio', {mid:mids,src: res,time:duration});
                             });
                         
						
					}
				})
			},
            
            sendImg(type) {
            	let that = this
            	uni.chooseImage({
                    sourceType:[type],
                    sizeType: ['original', 'compressed'], 
            		success(re) {
                        //console.log(re.tempFilePaths.length);
                         //console.log(re.tempFilePaths[0]);
                         that.sendertap();
                         that.uploadnum=0;
                         for(var i=0;i<re.tempFilePaths.length;i++){
                            that.mids[i]='m' + Math.random().toString(36).substring(2);
                            // that.$emit('sendImage', {mid:that.mids[i],src: re.tempFilePaths[i]});
                             var _that=that;
                           //  console.log(re.tempFilePaths[i]);
                             helper.uploadFiles([re.tempFilePaths[i]], 'images', {
                             	type: 'images'
                             }).then(res => {
                              
                             	that.$emit('sendImage', {mid:_that.mids[that.uploadnum],src: res});
                             });
                         }
            			
            		}
            	})
            },
            
            
            sendRedpactet(){
                
                if(this.user.banknum<1){
                    uni.showModal({
                    	title: '提示',
                    	content: "绑定银行卡后才可以发送红包",
                    	showCancel: true,
                    	cancelText: '关闭',
                    	confirmText: '立即绑定',
                    	success: res => { 
                    		if(res.confirm) {
                              uni.navigateTo({
                                url:"/pages/mine/bank" 
                              })
                    		}
                    	}
                    });  
                    return  false;
                }else{
                    uni.navigateTo({
                        url:'../friend/readpacket?isgroup='+this.isgroup+'&id='+this.groupid
                    })
                }
              
                this.hide_panel();
                
            },
			listen(name, eventOrValue) {

				this.$emit(name, eventOrValue);
                this.focus=false;
			},
            set_focos(){
                if(this.focus==false) this.focus=true;
            },
            getfocus(detail){
                
               this.boardheight=detail.height;
                    // #ifdef APP-PLUS
                  if(plus.os.name=='Android')    this.$emit("keyboardheight",detail.height);
                     // #endif
             
      
            },
            unfocus(){
                  this.boardheight=0;
             //   console.log('sender失去焦点')
                   this.$emit("keyboardheight",0);
                  
            },
            unfocus1(){
                // console.log('box失去焦点')
                   this.$emit("keyboardheight",0);
                  
            },
            sendertap(){
     
     this.showPanel=false;
                
     this.emoji=false; 
    // z  uni.hideKeyboard();
           
            },
            
            setinputvalue(e){
              this.input_value=this.input_value+e+' ';  
              this.$emit('input',   this.input_value);
            },
     istap(){
         
     },       
  tapsender(){
     
 //this.inputclass='textarea sending'
 if(this.input_value!=''){
 


   var that=this;
 //  setTimeout(function(){that.$emit('send',that.$event);},1000)
that.$emit('send',that.$event);
 this.area_value='';
 this.input_value='';
//that.$emit("senderheight",0);   
//this.keyboardheight=this.boardheight;

//  this.$emit("senderheight",300);
   if(this.sendtype!='text'){
       this.hideemoji();
       this.hide_panel();
   }
  // #ifdef APP-PLUS
     //if(plus.os.name=="iOS") uni.hideKeyboard();
  // #endif

   
 }



  },
  
  listen1(e){
   //   console.log(e);
      this.input_value=e;
      this.listen('input',e);
   //   console.log(e);
      
  },
          clickbox(e){
              var x=e.touches[0].clientX;
              var y=e.touches[0].clientY;
            //  console.log( windowWidth-x, windowHeight-y)
              if( windowWidth-x<65) this.tapsender();
          }  ,
			startVoice(e) {
				this.setting = true;
                this.willStop = false;
                 this.voiceTis = '手指上滑 取消发送'
				recorderManager.start({
                    format:'mp3',
                    numberOfChannels:2,
                    duration:6000  
				});
                 this.starttime=new Date().getTime();
                this.initPoint.Y = e.touches[0].clientY;
                this.initPoint.identifier = e.touches[0].identifier;
				console.log('start');
			},
            //录音开始UI效果
            recordBegin(e){
            	
            	/** 暂停语音播放 */
                console.log('录音开始UI效果');
            	recorderManager.pause();
            	
            	this.setting = true;
            	this.voiceTis='松开 结束';
            	this.recordLength = 0;
            	this.recordTimer = setInterval(()=>{
            		this.recordLength++;
            	},1000)
            },
            //录音停止   上传到服务器
            recordStop(res){
               var that=this;
               this.endtime=new Date().getTime();
                  	that.voicePath = res.tempFilePath;
               if(!this.willStop){
     
                    if ( this.endtime-this.starttime < 1000) return that.$toast('时间太短了');
                       var duration=(this.endtime-this.starttime)/1000;
                       this.voice_mid='m' + Math.random().toString(36).substring(2);
                       that.$emit('face', {
                       	url: that.voicePath,
                       	time: duration.toFixed(2),
                           mid:this.voice_mid
                       })
                  	 					helper.uploadFiles([that.voicePath], 'audio', {
                  	 						type: 'audio'
                  	 					}).then(res => {
                        
                  	 						that.$emit('face', {
                  	 							url: res,
                  	 							time: duration.toFixed(2),
                                               mid:this.voice_mid
                  	 						})
                      
                  	 					});
                                         action.playVoice('/static/voice/voice.mp3');
                    }
                    else{
                        console.log('取消发送录音');
                    } 
            },
            // 录音被打断
            voiceCancel(){
            	this.setting = false;
           
            	this.willStop = true;//不发送录音
            	recorderManager.stop();//录音结束
                this.voiceTis='按住 说话';
                this.recordTis = '手指上滑 取消发送'
            },
            // 录音中(判断是否触发上滑取消发送)
            voiceIng(e){
            	if(!this.setting){
            		return;
            	}
            	let touche = e.touches[0];
            	//上滑一个导航栏的高度触发上滑取消发送
            	if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
            		this.willStop = true;
            		this.recordTis = '松开手指 取消发送'
            	}else{
            		this.willStop = false;
            		this.recordTis = '手指上滑 取消发送'
            	}
            },
            
			endVoice() {
				this.setting = false
				recorderManager.stop();
                this.voiceTis='按住 说话';
                this.recordTis = '手指上滑 取消发送';
			
               
			},
			sendVoice() {
				this.voice = !this.voice;
			},
			getEmoji() {
                
			},
			sendEmoji(e) {
				//this.showPanel = false;
				this.emoji = false
				this.$emit('emoji', e)
			},
			handleEmotion(item) {
                var v=item.value;
	
				this.input_value += '['+v+']';
		        this.area_value=this.input_value
                this.listen1(this.input_value );
              
				this.$emit('handleEmotion', this.input_value);
                
			},
		},
		created() {
			this.getEmoji()
		},
		onLoad() {
 
           
		},
	}
</script>

<style lang="scss" scoped>
    @import "@/static/css/chat/style.scss";
	$control-height: 120upx;
	$input-height: $control-height - $uni-spacing-col-base * 2;
    .face_box{
        position: fixed;
        bottom: 60px;;
        left: 1px; width: calc(100% - 4px);
        z-index: 99;
        background-color: #fff;
        border: 1px #ddd solid;
        padding-top: 5px;;
        border-top-right-radius: 5px;
          border-top-left-radius: 5px;
    }
	.faceImg {
		width: 100upx;
		flex-basis: 100upx;
	}

	.n-icon {
		font-size: 33px;
		line-height: 33px;
		color: #333;
        vertical-align: middle;
	}
    .icons{
        height: 70upx;
        line-height: 70upx;
        vertical-align: middle;
    }
    .icons image{
        width: 65upx;height: 55upx;vertical-align:middle ;
    }
    .bigbox{
        position: fixed;
        bottom: 0px;
        left:110upx;
        width: calc(100vw - 100upx);
        height: 120upx;
        line-height: 120upx;
        padding: 0px;
        z-index: 0;
        
        border: 0px #eee solid;
         color:transparent !important;
    }
    
    .bigbox2{
        position: absolute;
        top: 10px;
        right:80upx;
        width:84upx;
        height: 120upx;
        line-height: 120upx;
        padding: 0px;
        z-index: 10;
      border: 0px #eee solid;

    }
    .bigbox3{
        position: absolute;
        top: 10px;
        right:0upx;
        width:80upx;
        height: 120upx;
        line-height: 120upx;
        
        padding: 0px;
        z-index: 0;
        text-align: right;
        justify-content: right;
       border: 0px #eee solid;
    
 }
 
 
 

   .sending{
       color:transparent !important;
   }
   
	.v-sender {
		z-index: 99999999;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 99vw;
       padding-left: 1vw;
       background-color: #fafafa;
       border-top: 1px solid #eee;
             
		&__panel,
		&__control {
			position: relative;
			width: 100%;

			&::before {
				display: block;
				content: '\20';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				background-color: #ddd;
				height: 1upx;
				transform: scaleY(0.5);
			}
		}

		&__panel {
			width: 100%;
			display: table;
			padding: 20upx 0;
			font-size: 28upx;
			background: #fafafa;

			>view {
				.n-icon {
					font-size:33px;
					color: #999;
				}

				text-align: center;
				display: table-cell;
			}
		}

		&__control {
			height: $control-height;
			
			padding: $uni-spacing-col-base 0px $uni-spacing-col-base 0;

			&,
			.emoji,
			.btn {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				box-sizing: border-box;

			}

			>.emoji,
			>.btn,
			>input {
				margin-left: $uni-spacing-row-base;
			}

			view {
				
				height: $input-height;
				flex-shrink: 0;
			}

			.emoji {
				font-size: 64upx;
				line-height: $input-height;
			}

			input,
			.falseinput {
				flex: 1;
				height: $input-height;
				border-radius: $uni-border-radius-base;
				
				box-sizing: border-box;
				background-color: #ccc;
				height: 68upx;
				line-height: 68upx;
                margin-left: 10px;;
			}
   .falseinput.press{
       background-color: #666;
       color: #fff !important;
   }
			.btn {
				line-height: $input-height - 10upx;
				height: $input-height - 10upx;
				color: #fff;
				text-align: center;
				background-color: $uni-color-primary;
			}
		}
	}
	
	.textarea ,.textareas {
		font-size: 32upx;
		background: #fff;
		border: 1px solid #ddd;
		max-height: 80upx;
        min-height: 40upx;
		line-height: 40upx;
        padding: 12upx 10upx;
        border-radius: 3px;;
	}
    
    	.textarea {
            margin-left: 10px;
            /* #ifndef H5 */
              width: calc(100%  - 290upx);
            /* #endif */
            
            
            /* #ifdef H5 */
              width: calc(100%  - 210upx);
            /* #endif */
          
        }
        .textarea.input{
             /* #ifndef H5 */
               width: calc(100%  - 360upx);
             /* #endif */
             
             
             /* #ifdef H5 */
               width: calc(100%  - 280upx);
             /* #endif */
        }
 .sendbtn{

     margin-left: 16upx !important;
     padding: 0px 40upx !important;
 
 }
 .emotion-box {
 	margin: 0 auto;
 	width:calc(100% - 4px);
 	box-sizing: border-box;
 	padding: 2px;
 	overflow: hidden;
 	overflow-y: auto;
 }
 
 .emotion-box-line {
 	display: flex;
 }
 
 .emotion-item {
 	flex: 1;
 	text-align: center;
 	cursor: pointer;
 }
</style>

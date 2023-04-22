<template>


<block v-if="isshow">

    

    
    
    <view v-if="m.type=='tips' || m.message.type=='tips'" class="chat-tips">
    				<view v-if="m.message.content.type=='time'  && m.message.content.text!=''" class="chat-tips-time">{{m.message.content.text}}</view>
    				<view v-else  class="chat-tips-time">{{m.message.content}}</view>
                    <view v-if="m.message.content.type=='redpack_tip'" class="chat-tips-time">
    					<text class="redpack-icon"></text>
    					{{m.message.content.text}}
    				</view>
    			</view>
                
                
    			<!-- 消息类型 开始 -->
    	<view v-else :class="{'chat-item':true,'chat-item-reverse': m.sender.id==userid}" :id="m._mid" >
            
            
            <!-- 头像 -->
    				<view class="avatar" @tap="clickAvatar(m)" @longtap="atusuer(m)">
    					<image :src="image_cache(m.sender.avatar)"></image>
    				</view>
                 
           <view class="content" :id="'msg_'+m.msg_id" >
                     <!-- 用户昵称 -->
                   <view class="nickname" v-if="m.sender.id!=userid && m.group_id>0 || m.id==0" @tap="clickAvatar(m)" >{{m.sender.nickname}}</view> 
                           
                           
    		<view class="item"    >
                
                <view v-if="m.message.type=='text'" class="text" @longtap="msgAction($event,m)"  >
                              
                             <block v-if="m.message.content.type=='remind' || m.message.content.type=='emotion'">
                              
                                     <view v-if="m.message.content.remind.id==userid" style="color: #FF0000;">
     
                                         <block v-if="isindexhtml(m.message.content.content)">
                                           <rich-text :nodes="m.message.content.content"></rich-text>  
                                         </block>
                                         <block v-else>  {{m.message.content.content}}</block> 
                                     </view>
                             <block v-else>
                                 <block v-if="isindexhtml(m.message.content.content)">
                                   <rich-text :nodes="m.message.content.content"></rich-text>  
                                 </block>
                                 <block v-else>  {{m.message.content.content}}</block> 
                                 
                             </block>   
                             </block>
                             
                             <block v-else>
                                 
                                 <block v-if="isindexhtml(m.message.content)">
                                   <rich-text :nodes="m.message.content"></rich-text>  
                                 </block>
                                 <block v-else>  {{m.message.content}}</block>
                             </block>
                		
                </view>
                    
                    
                     <!-- 表情 -->
                <view v-if="m.message.type=='emotion' " class="text" @longtap="msgAction($event,m)"  >
                    	<block  v-for="(m1,index1) in faces" :key="index1" >
                            <block  v-if="m1.type=='img'">
                           <image :src="m1.content" class="emotion"></image>      
                            </block>
                          
                           <block v-else>{{m1.content}}</block>
                        </block>
                </view>
                    
                    
                    <!-- 超链接 -->
                <view v-if="m.message.type=='url'"  class="text" @longtap="msgAction($event,m)" >
                    	<url :content="m.message.content" :self="m.self"  @clickurl="clickurl"/>
                </view>
                     <!-- 加群申请 -->
                     <view v-if="m.message.type=='apply'" class="text" style="font-size: 14px;" @longtap="msgAction($event,m)">
                         <view class="showname">{{m.message.content.other.nickname}}</view>                         
                         申请加入<view class="showname">{{m.message.content.other.groupname}}</view>
                          <view v-if="m.message.content.other.content">
                              <span style="color: #666;">附言：</span>
                              {{m.message.content.other.content}}
                          </view>            
                              
                     </view>
                     
                     <!-- 视频 -->
                <view v-if="m.message.type=='vedio'" class="vedio" @tap="play_vedio(m)" @longtap="msgAction($event,m)"  >
                  <block v-if="m.isloading==1">
                    
                   </block>
                  <block v-else>
                       <image :src="poster_show(m)" class="vedio_src"  ></image>  
                       <image src="/static/img/play.png" class="play_btn"></image>
                    	<view class="timeshow" v-if="m.message.content.time>0">{{showtime(m.message.content.time)}}</view>
                     
                  </block>
                </view>
                	<!-- 图片 -->
                <view v-if="m.message.type=='image'" class="image" @longtap="msgAction($event,m)"  >
                		<image @click="onPreview(m.message.content,m.message.type!='face')" :src="image_show(m)" :data-src="image_show(m)" mode="aspectFit"
                		 @load="onSetImageSize($event,m.message.content)" class='chatimg' :style="{width: (isizes[m.message.content] && isizes[m.message.content].width || 0) + 'px', 'height': (isizes[m.message.content] && isizes[m.message.content].height || 200) + 'px'}">
                		</image>
                </view>
                	
                
                	<!-- 语音 -->
                	<view v-if="m.message.type=='voice'" :class="{'voice': true,'voice-play': playVoiceId == m._mid}" @tap="playVoice(m)"  @longtap="msgAction($event,m)"  >
                		<view class="box">
                			<view class="wifi-symbol">
                				<view class="wifi-circle first"></view>
                				<view class="wifi-circle second"></view>
                				<view class="wifi-circle third"></view>
                			</view>
                		</view>
                		<view :class="{'voice-text': true,'voice-text-right': m.self}">
                			{{m.message.content.time}}''
                		</view>
                	</view>
            
                    <!-- 红包 -->
                    <view v-if="m.message.type=='redpacket' " @tap='redpack_open(m)' :class="{'redpack':true,'redpack-open':m.message.content.isopen==1}" @longtap="msgAction($event,m)"  >
                      <view class="info">
                          <block v-if="m.sender.id==userid">
                              <view class="showtext">{{m.message.content.title}}</view>
                              <view class="icon">
                                  <image :src="m.message.content.isopen==1?'/static/img/redpackopen-icon.png':'/static/img/redpack-icon.png'"></image>
                              </view>
                              
                              </block>
                              
                              <block v-else>
                                  
                                  <view class="icon">
                                       <image :src="m.message.content.isopen==1?'/static/img/redpackopen-icon.png':'/static/img/redpack-icon.png'"></image>
                                  </view>
                                  <view class="showtext">{{m.message.content.title}}</view>
                              </block>
                       
                      </view>
                      <view class="title">红包</view>
                    </view>
            
            </view>
                   
              
                    
                    <!-- 加载中 -->
           <view class="loadingbox"  v-if="m._mid==loading_id || m.isloading==1  ||  m.isloading==2">
                         <image src="/static/loading.gif" v-if="m._mid==loading_id || m.isloading==1"></image>
                        <image src="/static/fail.png" v-if="m.isloading==2"></image>
           </view>
        </view>
                 
    </view>
    
</block>
				
</template>

<script>
    import url from './url.vue'
	export default {
        components: {
        	url
         
        },
        props: {
            item: {
                required: true
            },
            loading_id:{
                default:0
            },
            playVoiceId:{
                default:0
            },
            userid:{
                default:0
            },
            unreadid:{
                default:0
            },
            
           
        },
        
		data() {
			return {
		isizes: {},
        faces:[],
        m:[],
        isshow:false,
       
        
			}
		},
        computed:{
         
        },
		methods: {
            touchend(){
               return false; 
            },
            clickAvatar(m){
                this.$emit('clickAvatar',m)
            },
            msgAction(e,m){
                this.$emit('msgAction',e,m)
            },
            play_vedio(m){
              this.$emit('play_vedio',m)  
            },
            playVoice(m){
              this.$emit('playVoice',m)  
            },
            atusuer(m){
               
             this.$emit('atusuer',m)  
            },
            redpack_open(m){
               
               if( m.message.content.isgroup!=1  && (m.message.content.money>0 || m.sender.id==this.userid)){
                   uni.navigateTo({
                       url:'../friend/redpacket_detail?msg_id='+m.msg_id+'&storekey='+m.cache_key
                   })
               }else
               this.$emit('redpack_open',m)  
            },
            updatedata(m){
              console.log(m);  
            },
            toText(str) {
                    str=str.replace(/&nbsp;/g," ");
                    str=str.replace(/<br>/g," \n");
                    return str;
                },
                
                toHtml(str) {
                  var text= msg.replace(/<\/?[^>]*>/g, '');
                    text=text.replace(/\n/g, '<br>'); 
                    text=text.replace(/ /g, '&nbsp;');             
                    return text;
                    },
            isindexhtml(str){
              var arr=['<br','&nbsp;',"<div" ,"<span"  ] ;
              str=str.toString();
               for(var i=0;i<arr.length;i++){
                   //console.log(str,arr[i])
                 if(str.indexOf(arr[i])>-1) return true;
               }
               return false;
            },
            poster_show(m){
                if(m.isloading==1){
                return false;
                }
                else {
            
                       var src=m.message.content.src;
                    try{
                        var arr=src.split('/');
                        var filename=arr[arr.length-1];
                         var arr1=filename.split('.');
                         var newname=arr1[0]+"_video.jpg";
                          var poster= src.replace(filename,newname);
                        return poster;
                    }catch(e){
                        //TODO handle the exception
                      return "/static/img/vediobanner.jpg";
                    }
                 
                  
                }
                 
                       
            },
            clickurl(url){
              //  console.log(url);
              if(url.indexOf('http')<=-1) url='http://'+url;
                let params = {url: url};
                
                return this.$jump('web.index',params)
            },
            httpString(str) {
                if(str.toString().indexOf('http')<=-1) {
                    //  str='https://'+str;
                    //  str=str.toString()
                    // console.log(str)
                }
                
            // var reg = /(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                var reg=/(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9\/][-a-zA-Z0-9\/]{0,62})+(:\d+)*(\/\w+\.\w+)*$/g
                 // console.log(str);
                
                try{
                    
                  var s = str.match(reg);
                  if (s != null) {
                      return s;
                  } else {
                      return false;
                  }  
                }catch(e){
                   return false; 
                }
                
                
            
            },
            showtime(time){
               var lost_s=parseInt(time);
               if(lost_s>=0){
                       var l_s=Math.floor(lost_s%60);
                       var next_s=Math.floor(lost_s/60);
                       var l_m=Math.floor(next_s%60);
                       var next_m=Math.floor(next_s/60);
                       var l_h=Math.floor(next_m%60);
               
               
               
                       if(l_h-10<0){var n_h="0"+(l_h);}else{var n_h=(l_h);}
                       if(l_m-10<0){var n_m="0"+(l_m);}else{var n_m=(l_m);}
                       if(l_s-10<0){var n_s="0"+(l_s);}else{var n_s=(l_s);}
               
                       if(n_h!='00') var hh = n_h+":";
                       else var hh='';
                         var   str=hh+n_m+':'+n_s+'';
                         return str;
                       }
                       else{
                         return "00:00";  
                       }          
                         },
                         image_show(m){
                          var src=m.message.content;
                            if(src.indexOf('"')>-1)   src=src.replace(/"/g,'');
                           if(m.isloading==1){ 
                           return src;
                           }
                           else 
                           return this.image_cache(src)  
                             
                         },
                         onSetImageSize(e, index) {
                         	let {width,height} = e.detail;
                         	let size = 150;
                         	if(height>size) {
                         		let p = size/height;
                         		height = size;
                         		width = width * p;
                         	}
                         	this.$set(this.isizes, index, {
                         		width,
                         		height
                         	});
                         },
                         onPreview(url, show) {
                         	if (show) {
                         		uni.previewImage({
                         			current:this.image_cache(url),
                         			urls: [this.image_cache(url)]
                         		});
                         	}
                         },
                         emotion(res) {
                         
                         				let word = res.replace(/\[|\]/gi, '')
               
                         const list = ['微笑','撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动',
                             '闭嘴', '笑哭', '吐舌','耶', '跳舞','恐惧','失望','脸红','无语','奸笑','嘿哈','鬼混','福','合十','强壮','红包','发财','庆祝','礼物'
                         ]
                         				let index = list.indexOf(word);
                                         var index1=index+100;
                                         return '^'+index1+'^';
                     
                 },
                 
                  getGroupmemebrs(group_id, userid) {
                    
                     var members = uni.getStorageSync(group_id + '_group_members');
                     if (!members) members = [];
                     let result = [];
                     members.forEach(item => {
                         if (item.id == userid) result = item;
                 
                     })
                     return result;
                 },
                 
                 message_format(v) {
                        
                   
                if (v.message.type == 'text' && v.message.content.type != 'emotion') {
                   
                 try {
                 v.message.content = JSON.parse(v.message.content);
                 
                   
                 } catch (e) {
                     //TODO handle the exception
                            var content = v.message.content;
                 }
                 var type=v.message.content.type;
                         if (type == 'remind') {
                                            
                           if ( v.message.content.remind.id == uni.getStorageSync('access_token')) {
                           
                           
                              
                              v.message.content.content = v.message.content.content.replace('@{' + v.message.content.remind.id + '}', '<span style="color:#ff0000;">有人@我</span>');
                           }
                                 else{
                                    var str=v.message.content.content;
                                        //    var reg =/@{(.*)}/g;
                                        // var tt=reg.exec(str);
                                  
                                     var mem = this.getGroupmemebrs(v.group_id, v.message.content.remind.id);
                                       
                                                        if (mem.id==v.message.content.remind.id  ) {
                                                            var atname = mem.nickname;
                                                        } else 
                                          var atname = v.message.content.remind.nickname;
                                             if(v.self==1) var color="#ff0000;"
                                             else var color="#2319dc";
                                          v.message.content.content = v.message.content.content.replace('@{'+v.message.content.remind.id+'}', '<span style="color:'+color+';">@' +atname+"</span>");
                                     
                                 }
                                    var content = v.message.content.content;       
                                  
                         }
                         else{
                            var content = v.message.content; 
                         }    
                                  
                     if(this.isindexhtml(content)) var content1=this.toText(content);
                     else var content1=content;
                   
                         var res = this.httpString(content);
                         if (res != false) {
                          
                             v.message.type = 'url';
                             v.message.content = {};
                             v.message.content.content = content;
                             v.message.content.urls = res;
                         }
                     }
                     if(v.message.type=='redpacket'){
                         try{
                            v.message.content=JSON.parse(v.message.content)
                         }catch(e){
                             //TODO handle the exception
                         }
                       //console.log( v.message.content)
                     }
                    this.isshow=true;
                     return v;
                 },
                 init(){
                
                   try{
                      if(this.item.message.type=='emotion'){
                          try{
                             this.item.message.content=JSON.parse(this.item.message.content);
                               
                          }catch(e){
                              //TODO handle the exception
                              
                    
                          }
                      
                          
                        var content= this.item.message.content.content.replace(/\[\S{1,3}\]/gi,this.emotion);
                      
                          content=content.split('^');
                     
                        
                        var imgs=[];
                        for(var i=0;i<content.length;i++){
                            if(content[i]>=100 && content[i]<=222){
                                imgs.push({'type':'img','content':"/static/emoji/"+content[i]+'.gif'})
                            }
                            else{
                                imgs.push({'type':'text','content':content[i]})
                            }
                        }
                        this.faces=imgs;
                              //  if(this.item.message.content.content.indexOf('[')>-1) console.log(imgs)
                      } 
                      
                      
                   }catch(e){
                       //TODO handle the exception
                    
                   }
                   
                   try{
                     
                      this.m=this.message_format(this.item);
                      //console.log(this.m)
                   }catch(e){
                       //TODO handle the exception
                     
                       this.m=this.item;
                    
                   }  
                 }
		},
        watch:{
            item(val){
               this.init();
            }
        },
        mounted() {
           
            this.init();
         
         /// 
        }
       
	}
</script>

<style lang="scss" scoped>
    
	$redpackBgColor: #fa9e3b;

	$reverseTextBgColor: #3388ff;


	$voiceBgColor: #fafafa;
	$voiceColor: #000;
	$reverseVoiceBgColor: #3388ff;
	$reverseVoiceColor: #fff;
    
   
    
	.emotion{
        height: 30px;
        width: 30px;;
        vertical-align: middle;
    }
    .chatimg{
        max-width: 70vw;
        vertical-align: top;
        border-radius: 5px;
    }
    .chatimg img{
        vertical-align: top;
    }

    .showname{
        display: inline-block;
        color:#2319DC;
    }
   

	.chat-tips {
		text-align: center;
	
		&-time {
			display: inline-block;
			padding: 0upx 20upx;
			font-size: 24upx;
            line-height: 40upx;
			
			color: #bbb;
			border-radius: 30upx;
		}
	}

	.chat-panel {
		width: 96%;
		padding: 0 2%;
		position: absolute;
		top: 0;
		left: 0;
    
      

	}
    
 .vedio{
    display: inline-block;
    float: left;
    width:calc(100% - 200upx);
    border-radius: 10upx;
     padding-top:0upx;
     padding-bottom: 0upx;
     overflow: hidden;
     position:relative;

     z-index: 0;
 } 
    .vedio .timeshow{
        position: absolute;
        right:12upx;
        bottom:16upx;
        font-size: 24upx;
        color: #FFFFFF;
        z-index: 999999999;
    }
    
    .vedio .play_btn{
        position: absolute;
        height: 80upx;
         width: 80upx;
         left: calc(50% - 40upx);
         top:calc(50% - 40upx);
        z-index: 999999999;
    }
.vedio_src{
    max-width: 100%;
    border-radius: 10upx;
     max-height: 70vw;
    z-index: 0 !important;
}
.chat-item .item{
    display: inline;
  
}

.touch_menu{
        position: fixed;
        z-index: 9999;
        background-color: rgba(0,0,0,0.8);
        border: 1px #000 solid;
        border-radius: 10px;
        padding: 0px 10px;
        line-height: 30px;
        max-width: 100%;
        
        font-size: 14px;
        min-height: 40px;
    }

	.chat-item {
		display: flex;
		font-size: 32upx;
		padding-bottom: 20upx;
      padding:10upx 12upx;
  position: relative;
		/*反向*/
		&-reverse {
			flex-direction: row-reverse;
.loadingbox,.vedio {
    float:right;
}
			.text,
			.redpack,
			.voice,
			.image{
                float: right;
				&:before {
					opacity: 0;
				}

				&:after {
					display: block;
					content: "";
					position: absolute;
					right: -12upx;
					top: 22upx;
					width: 0;
					height: 0;
					border-style: solid;
					border-width: 12upx 0upx 12upx 12upx;
				}
			}

			.image:after {
				opacity: 0
			}

			.text {
				color: #fff !important;
				background-color: $reverseTextBgColor !important;

				&:after {
					border-color: transparent transparent transparent $reverseTextBgColor;
				}
			}
            
			.redpack {
                text-align: right !important;
				&:after {
					border-color: transparent transparent transparent $redpackBgColor;
				}

				&-open {
					&:after {
						border-color: transparent transparent transparent #FDE1C3;
					}
				}
			}

			.voice {
				background-color: $reverseVoiceBgColor !important;
				color: $reverseVoiceColor !important;

				&:after {
					border-color: transparent transparent transparent $reverseVoiceBgColor;
				}

				.box {
					transform: rotate(180deg) translate(15px, 50%);
					transform-origin: center;
					right: 0;

					.first {
						background: $reverseVoiceColor;
					}

					.wifi-circle {
						border-color: $reverseVoiceColor;
					}
				}
			}
            .voice:hover,  .text:hover{
                background-color:#2319DC !important;
                &:after {
                	border-color: transparent transparent transparent #2319DC !important;
                }
            }
		}
		
		.avatar {
			width: 90upx;
			height: 90upx;
			border-radius: 12upx;
			background: rgba(0, 0, 0, 0.05);
			overflow: hidden;

			image {
				width: 90upx;
				height: 90upx;
			}
		}
       .content{
           margin: 0 20upx;

           width: 70%;
           position: relative;
            .nickname{
                max-width: 100%;
                height: 24upx;
                padding-bottom: 10upx;
                font-size: 24upx;
                line-height: 24upx;
                color:#222;
                text-align: left;
                
            }
       }
		.text,
		.redpack,
		.voice,
		.image {
            
			display: inline-block;
			width: auto;
			border-radius: 12upx;
			max-width: 100%;
			position: relative;

            
			&:before {
				display: block;
				content: "";
				position: absolute;
				left: -12upx;
				top: 26upx;
				width: 0;
				height: 0;
				border-style: solid;
				border-width: 12upx 12upx 12upx 0;
			}
		}

		.redpack {
			width:200px;
            height: 86px;
            text-align:left;
            padding: 0px 10px;
		}
        .redpack image{
            height: 40px;
            width: 30px;
        }
        .redpack .info{
            display: table;
            table-layout: fixed;
            width: 100%;
            height: 60px;
            line-height: 60px;
        }
        .redpack .info view{
            display: table-cell;
            vertical-align: middle;
            padding: 0px 0px;
            margin: 0px 0px;
        }
         .redpack .info view.icon{
             width: 55px;
             text-align: center;
         }
         .redpack .info view.showtext{
            color: #fff;
            font-size: 16px;;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
         }
         .redpack .info view.icon image{
             vertical-align: middle;
         }
          .redpack .title{
              height: 25px;
              line-height: 25px;
              color:#eee;
              font-size: 12px;
              border-top: #fdac53 solid 1px;
          }
           .redpack.redpack-open .title{
                color:#fef5ec;
                  border-top: #ffe6ca solid 1px;
           }

		.image:before {
			opacity: 0
		}

		.text {
			line-height: 50upx;
         
			padding: 12upx 20upx;
			background: #e5e5e5;
			color: #000;
			word-break:break-all;
            
			&:before {
				border-color: transparent #e5e5e5 transparent transparent;
			}
		}
          .text:hover,.voice:hover{
              background-color:#bbb ;
              &:after {
              	border-color:transparent #bbb transparent transparent;
              }
          }
		.redpack {
			background: $redpackBgColor;
			color: #fff;

			&:before {
				border-color: transparent $redpackBgColor transparent transparent;
			}

			&-open {
				background: #fce1c3;

				.redpack-body-image {
					background: #FB998A;
				}

				.redpack-body-image::before {
					background: #FFF3E7;
					top: -110upx;
				}

				&:before {
					border-color: transparent #FDE1C3 transparent transparent;
				}
			}

			&-body {
				padding: 20upx;
				display: flex;
				align-items: center;

				&-image {
					background: #CD3D35;
					width: 70upx;
					height: 90upx;
					overflow: hidden;
					position: relative;
					border-radius: 6upx;

					&:before {
						content: "";
						display: block;
						width: 140upx;
						height: 140upx;
						border-radius: 50%;
						position: absolute;
						top: -90upx;
						left: 50%;
						transform: translateX(-50%);
						background: #FA5151;
					}

					&:after {
						position: relative;
						display: block;
						content: '￥';
						width: 28upx;
						height: 28upx;
						background-color: #f2d252;
						color: #E08B34;
						border-radius: 28upx;
						line-height: 32upx;
						font-size: 24upx;
						transform: scale(.8);
						margin: 36upx auto;
						text-align: center;
					}
				}

				&-content {
					padding-left: 20upx;

				}
			}

			&-footer {
				font-size: 24upx;
				padding: 10upx 20upx;
				background: #fff;
				color: #999;
				border-bottom-left-radius: 12upx;
				border-bottom-right-radius: 12upx;
			}
		}

		.voice {
            display: inline-block;
			width: auto;
			position: relative;
			background: $voiceBgColor;
			color: $voiceColor;

			&:before {
				border-color: transparent $voiceBgColor transparent transparent;
			}

			&-text {
				margin-left: 60upx;
				line-height: 90upx;
				margin-right: 60upx;
			}

			&-text-right {
				text-align: right;
			}

			&-play {
				.second {
					animation: fadeInOut 1s infinite 0.2s;
				}

				.third {
					animation: fadeInOut 1s infinite 0.4s;
				}
			}

			.first {
				background: $voiceColor;
			}

			.wifi-circle {
				border-color: $voiceColor;
			}
		}
        
	}

	/*语音*/
	.box {
		position: absolute;
		top: 50%;
		transform:  translate(30upx, -50%);
	}

	.wifi-symbol {
		width: 25px;
		height: 25px;
		// box-sizing: border-box;
		position: relative;
		overflow: hidden;
		transform: rotate(135deg);
	}

	.wifi-circle {
		border: 2px solid #fff;
		border-radius: 50%;
		position: absolute;
	}

	.first {
		width: 2px;
		height: 2px;
		background: #fff;
		top: 22px;
		left: 22px;
	}

	.second {
		width: 12px;
		height: 12px;
		top: 17px;
		left: 17px;
	}

	.third {
		width: 20px;
		height: 20px;
		top: 12px;
		left: 12px;
	}

	@keyframes fadeInOut {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	/**/
	.loading {
		//loading动画
		display: flex;
		justify-content: center;

		@keyframes stretchdelay {

			0%,
			40%,
			100% {
				transform: scaleY(0.6);
			}

			20% {
				transform: scaleY(1.0);
			}
		}

		.spinner {
			margin: 20upx 0;
			width: 60upx;
			height: 25px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			view {
				background-color: #ff9800;
				height: 25px;
				width: 3px;
				border-radius: 3px;
				animation: stretchdelay 1.2s infinite ease-in-out;
			}

			.rect2 {
				animation-delay: -1.1s;
			}

			.rect3 {
				animation-delay: -1.0s;
			}

			.rect4 {
				animation-delay: -0.9s;
			}

			.rect5 {
				animation-delay: -0.8s;
			}
		}
	}

	image {
		will-change: transform;
	}

	.cssload-container {
		width: 100%;
		height: 17px;
		text-align: center;
	}

	.cssload-zenith {
		width: 17px;
		height: 17px;
		margin: 0 auto;
		border-radius: 50%;
		border-top-color: transparent;
		border-left-color: transparent;
		border-right-color: transparent;
		box-shadow: 1px 1px 0px rgb(255, 255, 255);
		animation: cssload-spin 690ms infinite linear;
	}



	@keyframes cssload-spin {
		100% {
			transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	/*红包小图标*/
	@font-face {
		font-family: "redpackfont";
		src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMcAAsAAAAABugAAALQAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBcIFeATYCJAMICwYABCAFhG0HMxsHBsgekiRQQKEUijquIAIkxMPT2v/OnZ1ns188qUZtAmSTkEikJCKpEeqHRDTvtP2zrv7NrtNrZEk0khlnKp3laf0BnYSTeFbdobqDbWl6PM0n7p3+3wAKZL7zLse1N03qAowDKdA9MIoSaIOE3jB2aQnpNIFiWjbDidbuYfCS+ZMCcdVslMGrEZBlNd0V2gMrM8Qd7rppT3oD3M6+H38UhhdIWhX4VaevtGhQ/z01yKrWmjXTCUF4nA3qOipsApk4P5g4yVWoDFcl4WYePKs8+J7aNIlJPFUv1L/OL+0Dk1BAJ2EkoipvApn+nAIub7oZVV8Fsvvcfx/XkiXV7fwRrfc9Xj8bhgx5N8NvRp3cG3I8vXz0pNfOhI4AevDkzAlJgnItv/NQCR5e3ncqPFHa93z9JEKTSLl0Wf+9d7H/8b9vP/xyu1l5D8uN++wTNuD/dvTrq4HRX5++i6PliVOv3/vVN+4mmI509oYOH87wpAxnjKF36eWbsXxfn8if3nCxfjnxz78PxF438/vx8d+vz3HqAZovldk1RXJ/Y/bnnX1z/tX/vSQ3gA//VuXM13zJsMwFulRwBlIpXNiWHbFvTNkSDmaSU1ypWFMUNIA9Iz5v1YzTOxO6xmnv6piqUOlaJDN9Ey21LbR17aPY0La+NopzFdkbWLcNEIbcRTLgLSpD3pKZ/gktE76jbShcUVyM4B1ry2FGTZzIgmhYWcFmlTloaBYoLx8kxgWbzOvijDlKuG4O44Lc/Ha6jTgIP2KOvmgsFIJiypkdt4LziM3GsJMzC1FFrkkIZ2VeHh26Uq7K7IAcxxEygdBgihWYmYpxoEl3AXU+P4gwWmAj4xMtbf5RBKczD44VyJW/gGxTOBa1fMolukVGhQSBwiiOscNagY2wBQkGcw4PsyBUQi7ThphTpTzUiS5V5F6vsotuDxS+NkVgd4UezfNzBNEFAA==') format('woff2');
	}

	.redpack-icon {
		font-family: "redpackfont" !important;
	}

	.redpack-icon:before {
		content: "\e626";
		color: red;
		display: inline-block;
		transform: scale(1.5);
		margin-right: 10upx;
	}
    
    .loadingbox{
        height: 80upx;
        width: 70upx;
        justify-content: center;
        line-height: 80upx;
        display: inline-block;
        text-align: center;
        vertical-align: top;
    }
    .loadingbox image{
        height:36upx;
        width: 36upx;
        vertical-align: middle;
    }
</style>

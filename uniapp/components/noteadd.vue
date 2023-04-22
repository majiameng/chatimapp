<template>
	<view class="page">
        <view class="group_note">
            <div class="menu">
                 <block v-if="noteinfo.id>0">编辑公告</block><block v-else>发布公告</block>
                    <div class="btn" @tap="back()" ><uni-icons type="undo" style="color:#fff;margin-right: 3px;;"></uni-icons>返回</div>
              
                </div>
            <div class="group_note" style="background-color: #fff;">
            
                <div class="contentadd">
            
               <textarea placeholder="请输入通知内容" v-model="noteinfo.content"></textarea>
               
               <view style="margin-top: 15px;">
                   <block v-for="(m,index) in imglist" :key="index"  >
                          <view :class="{'images':true,'uploading':index>=images.length}">
                              <image :src="imgshow(m)" ></image>
                              <uni-icons class="close" type="close" @tap="delimg(index)"></uni-icons>
                              <view class="status">上传中</view>
                          </view>
                          
                      </block>
                   
                   <view class="images">
                    <image src="../static/img/icon-plus.png"  @tap="uploadImage"   ></image>
                    </view>
                   
                   
               </view>
              
                </div>
            
            
            <view style="width: 80%;margin: 15px auto;display: block">
                    <div class="button1" @tap="click_add()">确认<block v-if="noteinfo.id>0">编辑</block><block v-else>发布</block></div>
            </view>
            
           
            
            </div>
            
        </view>
	
	</view>
</template>

<script>
      import uniIcons from './uni-icons/uni-icons.vue'
       	import config from "../config.js"
        import http from "../library/http.js"
        	import helper from "../library/helper.js"
	export default {
        components: {
        uniIcons,
      
        },
        props: {
            group: {
                required: true
            },
            noteinfo:{
                default:{
                    id:0,
                    content:'',
                    imgs:''
                }
            },
           
        },
		data() {
			return {
				imglist:[],
                images:[],
                action:'noteadd'
			};
		},
        methods:{
            click_add() {
                    if(this.noteinfo.content.length<10){
                   uni.showToast({
                       title:'公告内容最少10个字符',
                       icon:'none'
                   })  
                        return false;
                    }
                    if(this.images.length!=this.imglist.length){
                        ni.showToast({
                            title:'图片正在上传中，请稍后',
                            icon:'none'
                        })  
                             return false;
                    }
                    
                   var postdata={id:this.noteinfo.id,group_id:this.group.id,content:this.noteinfo.content,imgs:this.images.join('|'),userid:uni.getStorageSync('access_token')};
                   http.setWait(true).post('group.php?act='+this.action,postdata).then(res=>{
                     if(res.code==200){
                         if(this.action=='noteadd'){
                             uni.showToast({
                                 title:'发布成功'
                             }) 
                         }else{
                             uni.showToast({
                                 title:'编辑成功'
                             }) 
                         }
                      
                          this.$emit('getnoteinfo');
                          this.back();       
                     }else{
                      uni.showToast({
                          title:'网络错误，请稍后再试',
                          icon:'none'
                      })     
                     }
                                    
                   
                   })
            
                   
                },
            uploadImage() {
                if(this.imglist.length>=1){
                    uni.showToast({
                        title:'只能上传一张图片',
                        icon:'none'
                    })  
                    return false;
                }
                
            	uni.chooseImage({
                    count:1,
            		success: (chooseImageRes) => {
                           for(var i=0;i<chooseImageRes.tempFilePaths.length;i++){
            			var  tempFilePaths = chooseImageRes.tempFilePaths[i];
                           
                         this.imglist.push(tempFilePaths);
                     
            
            			helper.uploadFiles([tempFilePaths],'images',{type:'avatar'}).then(res=>{
                        
                         this.images.push(res.replace(config.imgUri,''));
                      
                         
            			})
            		}
                    }
            	});
            },
            delimg(num){
                 this.images.splice(num, 1);
                  this.imglist.splice(num, 1);
              
            },
           back(){
               this.$emit('back');
           } ,
           imgshow(image_url){
                  if(image_url.indexOf('http')<=-1) image_url=config.imgUri+image_url;
                 if(this.noteinfo.id>0)
                  return  image_url;
                  else
                  return this.image_cache(image_url)
           }
        },
        mounted() {
        if(this.noteinfo.id>0){
           this.images=this.noteinfo.imgs.split('|')
            this.imglist=this.noteinfo.imgs.split('|')
            this.action='noteedit';
        } 
        }
	}
</script>

<style>
   @import "@/static/css/group.css";
   .page{
       background-color: #fff;
   }
   .images{
       display: inline-block;
       width: 50px;;
       height: 50px;
       text-align: center;
       margin: 0px 5px;
       position: relative;
   }
   .images image{
       height: 50px;
       width: 50px;;
       vertical-align: middle;
       border-radius: 5px;;
   }
   .images .close{
       position: absolute;
       top:-7px;
       right:-7px;
       color:#666 !important;       font-size:18px !important;
       z-index: 1;
      font-weight: 700;
      
   }
    .images .status{
        position: absolute;z-index: 2;
       left: 0px;top:0px;
       width: 100%;height: 50px;line-height: 50px;
       background-color: rgba(0,0,0,0.7);
       color:#fff;
       font-size: 12px;
       text-align: center;
       display: none;
    }
   .images.uploading  .close{
       display: none;
   } 
   .images.uploading  .status{
       display: block;
   } 
</style>

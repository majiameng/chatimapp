<template>
    <view :class="{'self':self}">
        <block v-if="messages.length==1 && messages[0].type=='url'">
            
            <view v-if="showinfo" class="des" @tap="click_url(messages[0].content)">
                
                <view class="des_title">{{title}}</view>
                 <view class="des_content" v-if="description!=''">{{description}}</view>
                  <view class="des_url">
                  <uni-icons type='chatboxes' class="icon"></uni-icons>
                 
                 {{messages[0].content}}
                  
                  </view>
            </view>
            
           <view  class="url" v-else  @tap="click_url(messages[0].content)">
               
           {{messages[0].content}}
           </view>  
            
            
        </block>
        <block v-else>
           <block v-for="(m,index) in messages" :key="index"   >
              <view v-if="m.type=='url'" class="url"  @tap="click_url(m.content)">
           {{m.content}} 
              </view> 
              <block v-else >
                
              <rich-text :nodes="m.content" class="text"></rich-text>
                 </block>

           </block>   
            
            
        </block>
         
   
    </view>
</template>

<script>
      import uniIcons from './uni-icons/uni-icons.vue'
    export default {
        components: {
            uniIcons
        },
        props: {
            content: {
                required: true,
            },
           self:{
               default:0
           }
        },
        data() {
            return {
                res: {},
                messages:[],
                showinfo:false,
                title:'',
                description:'',
            }
        },
       
        methods: {
          showdata(){
              
              for(var i=0;i<this.content.urls.length;i++){
                  var url=this.content.urls[i];
                  try{
                      
                   var content=this.content.content.replace(url,'^'+url+"^") ;    
                  }catch(e){
                      //TODO handle the exception
                     // console.log(this.content.content.content)
                    var content=this.content.content.content.replace(url,'^'+url) ; 
                  }
                
              }
          
              var arr=content.split('^');
                 var reg=/(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9\/][-a-zA-Z0-9\/]{0,62})+(:\d+)*(\/\w+\.\w+)*$/g
              // console.log(arr)
            for(var i=0;i<arr.length;i++){
                var isin=0;
               for(var j=0;j<this.content.urls.length;j++){
                   // console.log(arr[i],this.content.urls[j])
                   if(arr[i]==this.content.urls[j]) isin=1;
               }
               if(arr[i]!=''){
                   if(isin==1){
                      var data={type:'url',content:arr[i]} 
                   }
                   else{
                      
                     var data={type:'text',content:arr[i]} 
                   
                   }
                  this.messages.push(data);
               }
            }
           
              // #ifdef APP-PLUS
            if(this.messages.length==1 && this.messages[0].type=='url'){
                
               
                if(this.messages[0].content.indexOf('http')<=-1) this.messages[0].content='http://'+this.messages[0].content;
                 var url=this.messages[0].content;
                 
            //    console.log(url);
                uni.request({
                    url:url,
                    method:'GET',
                    success: (res) => {
                      
                       this.gethtmlinfo(res.data);
       
                    }
                })
            }
            // #endif
            
           // console.log( this.messages);
             //this.res=this.content.content; 
          },
          gethtmlinfo(data){
            
              var reg = /<title(.*)>(.*)<\/title/;
                var match=reg.exec(data);
                
                var title=match[2];
               if(title!=undefined && title.length>1){
                   this.showinfo=true;
                   this.title=title;
                   this.description="";
               }
                var reg = /<meta(\s)name=[\'\"]description[\'\"](\s)content=[\'\"]?([^\'\"]*)[\'\"]?/i;
                  var match=reg.exec(data);
                  
                  try{
                     var content=match[3];
                     if(title!=undefined && title.length>1 && content!=undefined && content.length>1  ){
                         this.showinfo=true;
                         this.title=title;
                         this.description=content;
                     }
                      
                  }catch(e){
                      //TODO handle the exception
                       //console.log(title);
                      if(title!=undefined && title.length>1){
                          this.showinfo=true;
                          this.title=title;
                          this.description="";
                      }
                  }
               
              
              
      },
          click_url(url){
              this.$emit('clickurl',url);
              //console.log(url)
          },
        },
    	created() {
            //console.log(this.content)
    	this.showdata(); 
    	},
       
        onLoad() {
           
    		
        }
    }
</script>

<style>
    .text ,.url {
  display:inline-block ;
    }
     .url{
         color: #2319DC;
         text-decoration: underline;
         
     }
     .des{}
     .des_content{
         font-size: 12px;
         line-height:18px;
         overflow : hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 3;
         -webkit-box-orient: vertical;
     }
     .des_url{
         font-size: 12px;
         color: #666;
   
     }
     .icon{
         font-size: 12px !important;
         color: #666 !important;
     }
     .self .des_url{
         color: #eee;
     }
      .self .icon{
           color: #eee !important;
      }
</style>

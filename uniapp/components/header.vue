<template>
    <view>
  <view  class="status-bar"  :style="{ height: statusbarheight }" ></view>
        	<view class="headerline"  :style="{ top: statusbarheight }">
                <block v-if="!showsearch && !showsearch1">
                    <view class="back" v-if="isback" @tap="clickback()">
                          
                          <uni-icons type='arrowleft'  class="icons"></uni-icons>
                      </view>
                    <view class="logo" v-if="islogo" > <image src="/static/logo.png" ></image> </view>
                    <view class="title" v-if="!shownav">{{title}}</view>
                    <view class="nav" v-if="shownav"  :style="navstyle">
                        <block v-for="(m,index) in navitem" :key="index"  >
                            <view :class="{'navitem':true,'active':index==navselect}"  @tap="tapnav(index)" :style="'width:'+(100/navitem.length)+'%'">{{m}}
                          
                         <view class="red" v-if="reditem1[index]>0"></view>
                            </view>
                        </block>
                    </view>
                    
                    <view  class="right" v-if="issearch || rightmenu || isright">
                        <uni-icons @tap="clickshowsearch()"  v-if="issearch" type="search" color="#ffffff" size="28" style="vertical-align: middle;margin-right: 1px;"/>
                                
                          <uni-icons @tap="clickmenu()"  v-if="rightmenu" type="plusempty" color="#ffffff" size="28" style="vertical-align: middle;"/>
                          <uni-icons @tap="click_right()"  v-if="isright" :type="righticon" color="#ffffff" size="28" style="vertical-align: middle;"/>
                </view>
                    
                </block>
                
                <block v-else>
                
                    
                    <view class="seacrchtop"  :style="{'display': 'table','margin-top':statusbarheight}">
                       <li class="back"  @tap="closesearch()">
                              <uni-icons type='arrowleft'  class="icons"></uni-icons>
                       </li>
                        <li><input class="input1" id="keyword" :placeholder="searchtips" v-model="keyword" @input="listen_input($event.detail.value)" /> </li>
                    
                        <li  @tap="click_type('all');">
                            <div class="btn"><uni-icons style="font-size: 16px;color:#fff;margin-right:2px;font-weight: 600;" type="search"></uni-icons>搜索</div>
                        </li>
                    
                    </view>
                    
                   
                    
                    
                </block>
               
        	</view>
            
            
        	<view :class="{'menunav':true,'active':showmenu}" :style="'top:calc('+statusbarheight+' + 50px);'">
                
                <block v-for="(m,index) in menuitem" :key="index"  >    
                    <view   @tap="tapmenu(index)"><uni-icons :type='m.icon' class="iconshow" />{{m.title}}</view>
                </block>
        	    
        	</view>
              <view  :style="{ height: statusbarheight }" ></view>
   <view style="height: 45px;display: inline-block;width: 100%;"></view>
   	<view class="search_tips" v-if="keyword && showsearch1  && issearchresult==false">
   	    <view @tap="click_type('user')"><view> <image src="/static/img/user_add.png"></image>找人：</view><view>{{keyword}}</view></view>
   	    <view @tap="click_type('group')"><view><image src="../static/img/group_add.png"></image>找群：</view><view>{{keyword}}</view></view>
   
   	</view>
    <searchitem v-if="issearchresult==true" :data="serachdata" :type='searchtype' :keyword="keyword" :loading="loading" @showmore="click_type" @getnext="getnext"></searchitem>
    </view>
</template>

<script>
      import uniIcons from './uni-icons/uni-icons.vue'
      	import http from "../library/http.js"
        import searchitem from './searchitem.vue'
    export default {
        components: {
        	
            uniIcons,
            searchitem,
        },
        props: {
            shownav: {
         
              default: false 
            },
            rightmenu:{
                default:false
            },
            islogo: {
              
              default: false 
            },
            isback: {
              
              default: false 
            },
            gameshow:{
                
            },
            title:{
                
            },
            statusbarheight:{
                
            },
            navitem:{
                
            },
            reditem:{
                
               default:false,
            },
            navselect:{
                default:0
            },
            menuitem:{
                
            },
            navstyle:{
                
            },
            issearch:{
              default:false  
            },
           showsearch:{
             default:false  
           }, 
           searchtips:{
               default:'请输入要搜索的内容'
           },
           isright:{
               default:false
           },
           righticon:{
               default:false
           }
            
           
        },
        data() {
            return {
                showtrend:false,
                trendactive:false,
                showmenu:false,
                menutop:55,
             
                keyword:'',
                reditem1:[0,0,0,0],
                showsearch1:false,
                searchtype:'all',
                page:1,
                serachdata:[],
                issearchresult:false,
                loading:false,
            }
        },
       
        methods: {
            clickback(){
                var urls=  uni.getStorageSync('thisurl');
       
               if(urls && !uni.getStorageSync('access_token')){
                    uni.reLaunch({
                        url:urls
                    })
               }
                else{
                   
                 uni.navigateBack({
                     delta:1
                 });
                }
            
           
           
            },
            click_right(){
              this.$emit('click_right');  
            },
            clickmenu(){
               
              this.showmenu=!this.showmenu;  
                 },
                 tapnav(num){
                     this.$emit('tapnav',num);
                 },
                 tapmenu(num){
                     this.showmenu=false;
                     
                     this.$emit('tapmenu',num);
                 },
            clickshowsearch(){
              this.showsearch1=true
              this.showmenu=false;
              this.$emit('clicksearch',true) 
            },     
           clicksearch(){
              
               this.$emit('clicksearch',true)
           },  
           closesearch(){
                 this.showsearch1=false;
                 this.issearchresult=false;
                 this.keyword='';
                 this.searchtype='all';
                 this.page=1;
                this.$emit('clicksearch',false)
           },
           listen_input(value){
              this.issearchresult=false;
               this.searchtype='all';
               this.page=1;
           },
           click_type(type){
          
                 this.page=1;
                    this.issearchresult=false;
             this.searchtype=type;
             this.go_search();
           },
           getnext(e){
              
             this.loading=true;  
             this.page++;
             this.searchtype=e;
             this.go_search();
           },
           
           go_search(){
               if(this.keyword.length<1){
                   uni.showToast({
                       title:'搜索内容不能为空',
                       icon:'none'
                   }) 
                     return false;
               }
               
               http.setWait(false).get('index.php?act=search',{keyword:this.keyword,type:this.searchtype,page:this.page,userid:uni.getStorageSync('access_token')}).then(res=>{
                 var reg =/^\d{5}$/;
                  var reg1 =/^\d{6}$/;
                  
                 if(reg.test(this.keyword) && res.data.user.length==1){
                     
                      this.$jump('friend.detail',{id:res.data.user[0].id});
                 }else if(reg1.test(this.keyword) && res.data.group.length==1){
                     this.$jump('group.detail',{id:res.data.group[0].id});
                 }else{
                     if(res.data.user.length==0 && res.data.group.length==0  && this.page==1){
                        uni.showToast({
                            title:'没有搜索到相关内容',
                            icon:'none'
                        })  
                     }else{
                         if(this.page>1 && this.searchtype!='all'){
                             this.serachdata[this.searchtype].push(...res.data[this.searchtype])
                         }else{
                        this.serachdata=res.data;            
                         }
                 
                        this.issearchresult=true; 
                     }
                    
                 }
                this.loading=false;
               })
                 
             // this.$emit('go_search',this.keyword)
           
           },
          showdata(){
                
          },
          
         
        },
    	created() {
    	    this.showdata(); 
            if(this.reditem!=false) {
                this.reditem1=this.reditem;
            }
    	},
        watch:{
            reditem(val){
                if(val!=false)this.reditem1=val;
            }
        },
        onLoad() {
           
    		
        }
    }
</script>

<style>
  
      .status-bar{
         position: fixed;
         z-index: 10;
         left: 0px;
         top: 0px;
         width: 100%;
         background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
         background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
         background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
         background: linear-gradient(to right, #01d9ff , #01a9fe);
      }
      .headerline{
           position: fixed;
           z-index: 10;
           left: 0px;
           top:0px;
           width: 100%;
           height: 40px;
           line-height:40px;
           padding: 2px 0px;
           text-align: center;
           background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
           background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
           background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
           background: linear-gradient(to right, #01d9ff , #01a9fe);
           background-color:#01a9fe ;
           display: table;
           table-layout: fixed;
           text-align: center;
           color:#fff;
           font-size: 28upx;
           border-bottom: 0px ;
      }
      .headerline view{
          display: table-cell;
          vertical-align: middle;
      }
      .headerline .back {
            text-align: left;
            padding-left: 5px; 
            height: 40px;;
            line-height: 40px;;
         }
         .headerline .back .icons{
             color:#FFFFFF !important;
             font-size: 30px !important;
             height: 30px !important;
             vertical-align: middle;
         }
     .headerline .logo {
           text-align: left;
            padding-left: 7px;
        }
    .headerline .logo  image{
         height: 35px;
         vertical-align: middle;
         width: 90px;
     }
        .headerline .right{
            text-align: right;
            padding-right: 7px;
        }
      .headerline .title{
          position: absolute;
          left: 25%;
          width: 50%;
          top:5px;
          line-height: 35px;
          font-size: 16px;
          font-weight: 600;
      }
      .headerline .nav{
          position: absolute;
          left: 30%;
          top:9px;
          width: 40%;
          display: table;
          margin: 0px auto;
          height: 28px;
          line-height: 28px;
          color: #fff;
          border:1px solid #2319dc;
          border-radius: 5px;
      }
      .headerline .nav .navitem {
          display: table-cell;
          border-right:1px solid #2319dc;
        
      }
      .headerline .nav .navitem:first-child{
          border-left: 0px;
      }
      .headerline .nav .navitem.active{
          background-color: #2319dc;
      }
       .headerline .nav .navitem .red{
           display: inline-block;
           height: 7px;
           width: 7px;
           border-radius: 50%;
           margin-left: 1px;
           margin-top: 5px;
          background-color: #FF0000;
          vertical-align: top;
       }
      .menunav{
          position: fixed;
          top:70px;
          right: 1px;
          width: 120px;
      ;
          z-index: 99;
          background-color: rgba(0,0,0,0.8);
          line-height: 35px;
          padding: 5px 5px;
          transform: translate(0,-100vh);
          transition: .5s;
          font-size: 14px;
          border-radius: 5px;
      
      }
      .menunav.active{
          transform: translate(0,0);
      }
      .menunav:before{
          display: block;
          content: "";
          position: absolute;
          top: -6px;
          right:26upx;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0px 7px 7px 7px;
          border-color:  #000000 transparent;
      
      }
      .menunav >view{
          height: 35px;
          line-height: 35px;
          color: #fff;
          cursor: pointer;
          width: 100%;
          border-bottom:1px dashed #fff;
          font-size: 14px;
          text-align: center;
          display: flex;
          
          flex-direction: row;
          justify-content: center;
      }
  .menunav >view > .iconshow{
      color: #fff !important;
      font-size: 16px !important;
      margin-right: 5px;
      display:inline-block ;
  }
  
  .seacrchtop{
      background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
      background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
      background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
      background: linear-gradient(to right, #01d9ff , #01a9fe);
      position: fixed;
      top:0px;
      left: 0px;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color:#fff;
      padding-top: 10px;
  
   z-index: 19;
      display: none;
      table-layout: fixed;
  }
  .seacrchtop li{
      display: inline-block;
      text-align: center;
      vertical-align: top;
  }
  .seacrchtop li:first-child{
      width: 35px;
      line-height: 30px;
      text-align: center;
  }
  .seacrchtop li:first-child .icon{
     font-size: 20px;
      cursor: pointer;
      color: #fff;
  }
    
    .seacrchtop li:nth-child(2){
        width: calc(100% - 120px);
        overflow: hidden;
    }
  .seacrchtop li:last-child{
      width: 68px;
      padding-right: 10px;
      text-align: left;
  }
  .seacrchtop li .input1{
      width:100%;
      height: 28px;
      line-height: 28px;
      padding-left: 5px;
      font-size: 14px;
      background-color: #fff;
      color: #222;
      border:1px solid #2319dc;
      border-right: 0px;
      text-align: left;
      vertical-align: top;
      border-top-left-radius:5px;
      border-bottom-left-radius:5px;
      
  }
    .seacrchtop li .input1::placeholder{
        color:#999;
        font-size: 12px;
    }
  .seacrchtop li .btn{
      background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
      background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
      background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
      background: linear-gradient(to bottom right, #3388ff , #2319dc);
      height: 30px;line-height: 30px;
        border:1px solid #2319dc;
     width: 100%;
      text-align: center;
      padding: 0px 0px;
      display: inline-block;
      color: #fff;
      border: 0px;
      cursor: pointer;
      border-top-left-radius: 0px;
           border-bottom-left-radius: 0px;
           vertical-align: top;
  }
.search_tips {
    font-size: 14px;
    line-height: 40px;
    display: flex;
      flex-direction: column;
    width: 100%;
    
    
}
.search_tips  > view{
    height: 50px;
    line-height: 50px;
  background-color: #fff;
    border-bottom: 1px solid #eee;
    color: #000;
    display: flex;
    flex-direction: row;
}

.search_tips  > view >view:nth-child(1){
    width: 78px;
    justify-content: right;
    text-align: right;
    align-items: right;
    color: #888;
    display: inline-flex;
    flex-direction: row;  
     padding-left: 10px;
}
.search_tips > view  image{
    height: 30px;
    width: 30px;
    vertical-align: middle;
    border-radius: 5px;
    margin-right: 5px;
    margin-top: 10px;
    justify-content: right;
    justify-items: ;
    text-align: right;
    align-items: right
}

</style>

<template>
	<view >
<view class="query-form" style="height:65px;top:0px;">
<view class="menu">
    <block v-for="(item,index1) in toparr" :key="index1"  >
    <view :class="index1==topselect?'current':''" @tap="change_num(index1)" >{{item}}</view>
   </block>

 </view>
   <view class="menu2">

        <view @tap="show_gamenav1()" style="float: left;padding-left: 10px;color: #2319dc;">{{gameshow['title']}}
         <uni-icons  :type="gameico" style="color: #2319dc;display: inline-block;"/>
         </view>

<view id="wanfa_title" style="display: inline-block;color: #2319dc" @tap="tapshowmenu()">{{wanfa_title}}</view>
        <input type="checkbox" name="checkbox2" value="checkbox" id="has_line" style="display:none ">
        <input type="checkbox" name="checkbox" value="checkbox" id="no_miss" checked="checked" style="display:none ">
       
        <view style="display: inline-block;float: right;width: 50px;text-align: center;color: #2319dc" @tap="tapshowmenu()">
           <uni-icons  :type="showmenu?'gear-filled':'gear'" style="color: #2319dc;display: inline-block;"/>切换
        </view>
    </view>   
</view>

<view :class="{'gamenav':true,'active':gamenav}">
    <view v-for="(m,index) in gametype" :key="index"  >
        <view>{{m}}</view>
        <view>
            <block v-for="(game,index1) in gamelist" :key="index1"  >
                <view v-if="game['type']==index && game['id']!=gameid" @tap="change_game(game['id'])">{{game['title']}}</view>
              <view v-if="game['type']==index && game['id']==gameid" class="active">{{game['title']}}</view>
            </block>
        </view>
    </view>

</view>
<scroll-view  scroll-y="true" :class="{'showtabs':true,'active':showmenu}"  :style="{'height':tableheight}">
    <block v-for="(item,key) in tabs_nav1" :key="key"  >
         <view class="lines"> {{item}}</view>
        <view class="line-btn " >
           <block v-for="(item1,key1) in wei_arr[key]" :key="key1" >
   <view  :class="wanfa_key1==key && wanfa_key2==key1?'item current':'item'" @tap="show_wanfa(key,key1);">{{item1}}</view>
            </block>
        </view>
        
  </block>
<!-- #ifdef H5 -->
<view style="height: 50px;"></view>
          <!-- #endif -->
</scroll-view>

<scroll-view   scroll-y="true" id="tablebox" :scroll-top="scrollTop"  @scroll="table_scroll" upper-threshold="50" @scrolltoupper="scrolltoupper"   class="query-tablebox" :style="{'height':tableheight}">
    
    <table class="query-table" >
        <tr class="tr">
          <block v-for="(item1,key1) in LotteryHeadLines" :key="key1" >
          <th class="td">{{item1}}</th>
         </block>   
        </tr>
        
        
        <tr class="tr" v-for="(item1,key1) in LotteryLines" :key="key1">
          <block v-for="(item2,key2) in item1" :key="key2" >
          <td ><view :class="item2.class">{{item2.value}}</view>
              <view class="times" v-if="wanfa_key1=='duohao' && item2.times>1">{{item2.times}}</view>
          </td>
         </block>   
        </tr>
        
      
      <block  v-for="(item1,key1) in LotteryBottomLines" :key="'info2-'+key1">
      <tr :class="bottomcolor(key1)">
        <block v-for="(item2,key2) in item1" :key="key2" >
        <td :class="item2.class"><view>{{item2.value}}</view>
        
    
        </td>
       </block>   
      </tr>
     </block>
    </table>
    <block v-if="pagesum>1">
      
    <view class="pages" >
             <view @tap='next_page(-1)'>&lt;</view>
             <block v-for="(m,index) in pagenum" :key='index'>
                 
               <view  :class="{'active':m==page}"  @tap="click_page(m)">{{m}}</view>
             </block>
      <view @tap='next_page(1)'>&gt;</view>
             
             
         </view>  
         <view style="height: 20px;"></view>
    </block>

        
    
    <!-- #ifdef H5 -->
<view style="height: 50px;"></view>
          <!-- #endif -->
    <canvas canvas-id="ballchart" v-if="ischart" class="canvas" :style="{'height':31*LotteryLines.length+'px'}"></canvas>
    
</scroll-view>

     
	</view>
</template>

<script>
    
    	import uniIcons from './uni-icons/uni-icons.vue'
            import http from '../library/http.js'
            
            
	export default {
        components: {
        	
            uniIcons
        },
        props: {
            gamelist:{
             
            },
            lotterylist:{
               
            },
            gameid:{
               
                
            },
            gameshow:{
               
                
            },
            windowHeight:{
                
            }
           
        },
        
		data() {
			return {
                    tableheight:"",
			       gameico:'arrowdown',
                    toparr:{'30':'30期','50':'50期','day0':'今日数据','day1':'昨日数据','day2':'前日数据'},
                    topselect:'30',
                    tabs_nav1:{'danhao':'单号走势','duohao':'多号走势','lhh':'龙虎和','dx':'大小走势','ds':'单双走势','5xhz':'五星和值','hz':'和值','kd':'跨度'},
                    wei_arr:[],
                    wanfa_key1:'danhao',
                    wanfa_key2:'0',
                    showmenu:false,
                    historylist:[],
                    LotteryHeadLines:[],
                    LotteryLines:[],
                    LotteryBottomLines:[],
                    charttop:'96px',
                    scrollTop:1200,
                    wanfa_title:'',
                    last_issue:"",
                    lotteryTime1:null,
                    lotteryTime2:null,
                    gamenav:false,
                    ischart:false,
                    gametype:uni.getStorageSync('gametype'),
                    listall:[],
                    isscrolltop:false,
                    page:1,
                    pagesum:0,
                    pagenum:[],
                    pagebottom:10,
			}
		},
        computed:{
       
        },
		methods: {
          change_num(num){
              this.topselect=num; 
              this.load_lottery(true);
          },
          change_game(id){
              this.$emit('change_game',id);
         // this.load_lottery(true);
         var that=this;
         setTimeout(function(){
                 that.load_trend();
         },100)
              this.init_data(true);
               //this.load_trend();
              this.gamenav=false;
          },
          show_gamenav1(){
            this.gamenav=!this.gamenav;
              
          },
          tapshowmenu(){
            this.showmenu=!this.showmenu;  
          },
     
          loadmethod(){
              this.tableheight="calc("+this.windowHeight+" - 65px)";
              var wei_arr=[];
              var type=this.gameshow.type;
              if(type=='ssc' || type=='ffc'){
                  
                  this.tabs_nav1={'danhao':'单号走势','duohao':'多号走势','lhh':'龙虎和','dx':'大小走势','ds':'单双走势','5xhz':'五星和值','hz':'和值','kd':'跨度'}  
             wei_arr['danhao']={'0':'万位','1':'千位','2':'百位','3':'十位','4':'个位'};
             wei_arr['duohao']={'0-4':'五星','1-4':'后四','0-2':'前四','2-4':'后三','1-3':'中三','0-2':'前三','3-4':'后二','0-1':'前二'};
              wei_arr['dx']={'0-2':'万千百','2-4':'百十个'};
              wei_arr['ds']={'0-2':'万千百','2-4':'百十个'};
              wei_arr['5xhz']=['大小单双'];
               wei_arr['hz']=['各类'];
              wei_arr['kd']=['各类'];
              wei_arr['lhh']={'01-02':'万千 万百','03-04':'万十 万个','12-13':'千百 千十','14-23':'千个 百十','24-34':'百个 十个'};
             
              }
              else if(type=='11x5'){
                  this.tabs_nav1={'danhao':'单号走势','duohao':'多号走势','dx':'大小走势','ds':'单双走势','hmds':'号码单双'}
                  wei_arr['danhao']={'0':'第一名','1':'第二名','2':'第三名','3':'第四名','4':'第五名'};
                  wei_arr['duohao']={'0-4':'五星','0-1':'前二','0-2':'前三'};
                   wei_arr['dx']={'0-2':'一二三','2-4':'三四五'};
                   wei_arr['ds']={'0-2':'一二三','2-4':'三四五'};
                   wei_arr['hmds']=['个数比'];
              }
              else if(type=='pk10'){
                  this.tabs_nav1={'danhao':'单号走势','duohao':'多号走势','dx':'大小走势','ds':'单双走势'}
                  wei_arr['danhao']={'0':'第一名','1':'第二名','2':'第三名','3':'第四名','4':'第五名','5':'第六名','6':'第七名','7':'第八名','8':'第九名','9':'第十名'};
                  wei_arr['duohao']={'0-1':'前二','0-2':'前三','0-4':'前五','5-9':'后五'};
                   wei_arr['dx']={'0-2':'一二三'};
                   wei_arr['ds']={'0-2':'一二三'};
              }
              else if(type=='k3'){
                  this.tabs_nav1={'danhao':'单号走势','duohao':'多号走势','dx':'大小走势','ds':'单双走势','hzxt':'和值形态'}
                  wei_arr['danhao']={'0':'一位','1':'二位','2':'三位'};
                  wei_arr['duohao']={'0-2':'三码','0-1':'前二','1-2':'后二'};
                   wei_arr['dx']={'0-2':'百十个'};
                   wei_arr['ds']={'0-2':'百十个'};
                   wei_arr['hzxt']=['三码'];
              }
 

     this.wei_arr=wei_arr;
     this.wanfa_key1='danhao'
     this.wanfa_key2='0'
       this.init_data(false);
           },
           
           init_data(type){
               this.set_wanfatitle();
               if(this.lotterylist.length<parseInt(this.topselect))
               this.historylist=this.lotterylist;
               else {
                   for(var i=0;i<parseInt(this.topselect);i++){
                       this.historylist.push(this.lotterylist[i]);
                   }
               }
               
               var that=this;
               setTimeout(function(){
                       that.load_lottery(type);
               },100)
           
           },
           set_wanfatitle(){
               var title='';
               for(var ii in this.tabs_nav1){
                   if(ii==this.wanfa_key1) {
                    title+=this.tabs_nav1[ii];
                       break;
                   }
               }
               
               for(var ii in this.wei_arr[this.wanfa_key1]){
                  if(ii==this.wanfa_key2) {
                   title+="_"+this.wei_arr[this.wanfa_key1][ii];
                      break;
                  }
               }
               
               this.wanfa_title=title;
           },
           show_wanfa(key,key1){
                  this.wanfa_key1=key;
                  this.wanfa_key2=key1;
                     this.set_wanfatitle();  
                     this.showmenu=false;
            this.load_trend();
           },
           
           scrolltoupper(){
              
              // if(this.historylist.length<this.listall.length){
              //     var len=this.listall.length-this.historylist.length;
              //     if(len>50) len=50;
              //     var from=this.historylist.length;
              //     var historylist=[];
              //     for(var i=from;i<from+len;i++){
              //        historylist.push(this.listall[i]);
              //     }
              //     this.historylist=historylist;
              //     this.isscrolltop=true;
              // } 
              // else {
              //     this.isscrolltop=false;
              // }
              
              this.next_page(1);
           },
           
           pagedata(){
             var from=(this.page-1)*100;
               var to=from+100;
               if(to>this.listall.length) to=this.listall.length;
               var historylist=[];
               for(var i=from;i<to;i++){
                  historylist.push(this.listall[i]);
               }
               this.historylist=historylist;
               
           },
            click_page(num){
              if(num>0 && num<=this.pagesum && this.page!=num){
                  
                  this.page=num;
                  this.pagedata();
              }  
            },
            next_page(num){
              var page=this.page+num;
                this.click_page(page);
            },
            setpage() {
                 var sum=this.pagesum;
                 var page=this.page;
                 var pagenum=[];
                    var html="";
                      if(page>4){
                          var from=page-2;
                          var to=page+2;
                      }
                      else {var from=1;
                      var to=6;
                      }
                     if(to>sum)  to=sum;
                      if(from>2){
                       pagenum.push(1);
                       pagenum.push('...');
                      }
                       for(var i=from;i<=to;i++){
                             pagenum.push(i);
                    
                       }
                       if(to<sum-1)  {
                             pagenum.push('...');
                          pagenum.push(sum);
                         
                       }
                    this.pagenum=pagenum;
            
                },
         load_lottery(type){
             clearTimeout(this.lotteryTime1);
             clearTimeout(this.lotteryTime2);
             var pageSize=this.topselect;
           // console.log(this.gameid)
             http.setWait(type).get('index.php?act=lotterylist',{lotteryId:this.gameid,current:1,type:'trend',pageSize:pageSize,from:'app'}).then(res=>{    
                    
                    this.listall=res.data.records;
                  //  console.log(this.listall)
                  
                  this.pagesum=Math.ceil(this.listall.length/100);
                  this.page=1;
                  this.pagedata();
                  this.setpage();
                  
                    // if(res.data.records.length<=50)
                    // this.historylist=res.data.records;
                    // else{
                    //     var historylist=[];
                    //     for(var i=0;i<50;i++){
                    //         historylist.push( this.listall[i]);
                    //     }
                    //     this.historylist=historylist;
                          
                    // }
                
                    
                   //已开奖
                    if(this.last_issue!=res.data.records[0].issueNo){
                      this.last_issue=res.data.records[0].issueNo;
                    //  this.load_trend();
                      // var that=this;      
                      //         //  console.log(1000*parseInt(res.data.records[0]['lastsecond']));
                      // this.lotteryTime1=setTimeout(function(){
                      //     that.load_lottery(false);
                      //    // console.log('222')
                      // },1000*parseInt(res.data.records[0]['lastsecond']))
                    }
                    else{
                     //    //未开奖   3秒监控
                     //      var that=this; 
                     // // clearTimeout(this.lotteryTime2);
                     //  this.lotteryTime2=clearTimeout(function(){
                     //     // console.log('lottery');
                     //      that.load_lottery(false); 
                     //  },3000)  
                    }
                                          
             });
         },
         update_lottery(data){
             var that=this;
           if(data.length>0){ 
               for(var i=0;i<data.length;i++){
                   var item=data[i];
                  
                   var gameitem=this.getgamebykey(item.gamekey);
                   var id=gameitem.id;
                   var data1=this.dataformat(item,gameitem);
                
                       if(item.expect!=this.last_issue){
                          
                          
                          if(id==this.gameid){
                              this.last_issue=data1.issueNo;
                              this.historylist.unshift(data1);
                              this.historylist.splice(this.historylist.length-1,1);
                                
                           //  this.load_trend();
                              //console.log(this.historylist)
                          }  
                        
                     }
                 
               }
           }
           
           
         },
         timestampToTime(timestamp) {
                 var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                 var Y = date.getFullYear() ;
                 var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
                 var D = date.getDate();
                 var h = date.getHours();
                 var m = date.getMinutes();
                 var s = date.getSeconds();
                 if(D<10) D='0'+D;
                  if(h<10) h='0'+h;
                   if(m<10) m='0'+m;
                    if(s<10) s='0'+s;
                 return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s;
         },
             
         dataformat(item,game){
           var data={};
             data.gametype=game.type;
             data.issueNo=item.expect;
             data.openCode=item.number;
             if(item.lasttime>parseInt((new Date()).getTime() / 1000))
                data.lastsecond=item.lastsecond - parseInt((new Date()).getTime() / 1000)
             else
             data.lastsecond=item.lasttime;
             data.predictedTime=this.timestampToTime(item.time);
            
             return data;
         },
         getgamebykey(gamekey){
             var key1=gamekey.toLowerCase();
             var key2=gamekey.toUpperCase();
             for(var i=0;i<this.gamelist.length;i++){
                 if(this.gamelist[i].showkey==key1 || this.gamelist[i].showkey==key2){
                     return this.gamelist[i];
                   }
             }
             return false;
         },
                   
          scrollToBottom: function() {
         if(this.isscrolltop==false){
             var that=this;
              setTimeout(function(){
             that.scrollTop=  32*(that.LotteryLines.length+5)
               },500) 
         }
                  
          }, 
           table_scroll(e){
               var top=96-e.detail.scrollTop;
               this.charttop=top+'px';
           },
          bottomcolor(num){
           //    console.log(num)              
              return "tr color"+num;
          },
           issue(num){
               if(num.indexOf('-')>-1){
             var issue=num.split('-');
               return issue[1];      
               }
               else{
                   return num.substr(num.length-3,3);
               }
             
           },
           
           //单号走势
           danhaoList(){
               
               this.LotteryHeadLines=[];
               this.LotteryHeadLines.push('期号');
               var type=this.gameshow.type;
               if(type=='ssc' || type=='ffc'){
                   var min=0;
                   var max=9;
               }
               else if(type=='pk10'){
                   var min=1;
                   var max=10;
               }
               else if(type=='11x5'){
                   var min=1;
                   var max=11;
               }
               else if(type=='k3'){
                   var min=1;
                   var max=6;
               }
            
               for(var i=min;i<=max;i++){
                   this.LotteryHeadLines.push(i);
               }
                   var countArray = new Array();
                       var MaxNum = new Array();
                       var MaxNumArray = new Array();
                       var MaxLostNum = new Array();
                       var strArray = new Array();
                       var numArray = new Array();
                       var wei_num=this.wanfa_key2;
                      
                           for (var j = min; j <= max; j++) {
                               countArray[j] = 0;
                               MaxNum[j] = 0;
                               MaxNumArray[j] = 0;
                               MaxLostNum[j] = 0;
                               strArray[j] = 0;
                               numArray[j] = 0;
                           }
                       
               var lines=[];
           
               for(var i=this.historylist.length-1;i>=0;i--){
                   var item=this.historylist[i];
                   var line=[];
                
                   line.push({'class':'issue','value':this.issue(item['issueNo'])});
                    var strArray2 = item['openCode'].split(',');
                  var code= parseInt(strArray2[wei_num]);
                                  var  num0 = min;
                                   while (num0 <= max) {
                                       if (num0 == code) {
                                           countArray[num0]++;
                                           numArray[num0] = -1;
                                           MaxNumArray[num0]++;
                                           if (MaxNum[num0] < MaxNumArray[num0])
                                               MaxNum[num0] = MaxNumArray[num0];
                                       }
                                       else {
                                           MaxNumArray[num0] = 0;
                                           numArray[num0]++;
                                           if (MaxLostNum[num0] < numArray[num0])
                                               MaxLostNum[num0] = numArray[num0];
                                       }
                                       if (num0 ==code) {
                                           line.push({'class':'ball','value':code});
                                           numArray[num0]++;
                                       }
                                       else {
                                             line.push({'class':'num','value':numArray[num0]});
                   
                                       }
                                       num0++;
                                   }
                               
                lines.push(line);
               }
              // console.log(lines);
               this.LotteryLines=lines;
           this.drawchart();
              
             this.ischart=true;
              var lists=new Array();
              var line=[{'class':'issue','value':'最大连出'}];
   
                      
                var num0 = min;
                  while (num0 <= max) {
                       line.push({'class':'num','value':MaxNum[num0]});
                             num0++;
                 }
                 
               lists.push(line);
               var line=[{'class':'issue','value':'最大遗漏'}];
                  
                       
                 var num0 = min;
                   while (num0 <= max) {
                        line.push({'class':'num','value':MaxLostNum[num0]});
                              num0++;
                  }
                  
                lists.push(line);
               var line=[{'class':'issue','value':'出现次数'}];
                  
                 var num0 = min;
                   while (num0 <= max) {
                        line.push({'class':'num','value':countArray[num0]});
                              num0++;
                 
                  }
                lists.push(line);
                var line=[{'class':'issue','value':'平均遗漏'}];
                   
                       
                  var num0 = min;
                    while (num0 <= max) {
                               if(countArray[num0]>0)
                                      var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                        else
                                      var tt= this.historylist.length;
                                        tt=parseInt(tt);
                         line.push({'class':'num','value':tt});
                               num0++;
                   }
                  
                 lists.push(line);
           this.LotteryBottomLines=new Array();
           this.LotteryBottomLines=lists;
            this.scrollToBottom();
        
           },
           
           //多号走势
           duohaoList() {
                this.ischart=false;
           this.LotteryHeadLines=[];
           this.LotteryHeadLines.push('期号');
     var type=this.gameshow.type;
     if(type=='ssc' || type=='ffc'){
         var min=0;
         var max=9;
     }
     else if(type=='pk10'){
         var min=1;
         var max=10;
     }
     else if(type=='11x5'){
         var min=1;
         var max=11;
     }
     else if(type=='k3'){
         var min=1;
         var max=6;
     }
           for(var i=min;i<=max;i++){
               this.LotteryHeadLines.push(i);
           }
            var countArray = new Array();
                   var MaxNum = new Array();
                   var MaxNumArray = new Array();
                   var MaxLostNum = new Array();
                   var strArray = new Array();
                   var numArray = new Array();
                   var wei_num=this.wanfa_key2;
                  
                       for (var j = min; j <= max; j++) {
                           countArray[j] = 0;
                           MaxNum[j] = 0;
                           MaxNumArray[j] = 0;
                           MaxLostNum[j] = 0;
                           strArray[j] = 0;
                           numArray[j] = 0;
                       }
                      var wei_num = this.wanfa_key2.split('-');
                   
                           var wei_from = parseInt(wei_num[0]);
                           var wei_to = parseInt(wei_num[1]);
           var lines=[];
         
           
                for(var i=this.historylist.length-1;i>=0;i--){
                    var item=this.historylist[i];
                    var line=[];
                 //  console.log(item);
                    line.push({'class':'issue','value':this.issue(item['issueNo'])});
                     var strArray2 = item['openCode'].split(',');
                   var code= parseInt(strArray2[wei_num]);
                                   var  num0 = min;
                       strArray2 = this.Lot_New(strArray2,wei_from,wei_to);
           
                       num0 = min;
                       while (num0 <= max) {
           
           
                           var temp = this.in_arr_num(strArray2, num0);
                           if (temp>0) {
                               countArray[num0]= countArray[num0]+temp;
                               numArray[num0] = -1;
                               MaxNumArray[num0]++;
                               if (MaxNum[num0] < MaxNumArray[num0])
                                   MaxNum[num0] = MaxNumArray[num0];
                           }
                           else {
                               MaxNumArray[num0] = 0;
                               numArray[num0]++;
                               if (MaxLostNum[num0] < numArray[num0])
                                   MaxLostNum[num0] = numArray[num0];
                           }
           
                           if (temp > 0) {
                             
                            
                              // str3 += "<td class=\"charball td0\"><div class=\"ball01\">"+tt+ num0 + times_str+"</div></td>";
                                   line.push({'class':'ball','value': num0,'times':temp});
                               numArray[num0]++;
                           }
                           else {
                                    line.push({'class':'num','value':numArray[num0]});
                              // str3 += "<td class=\"wdh td0\"><div class=\"ball14\">" + numArray[num0] + "</div></td>";
           
                           }
                           num0++;
                       }
              
                  
                                lines.push(line);
                               }
                              // console.log(lines);
                               this.LotteryLines=lines;
                           this.drawchart();
                              
                             
                              var lists=new Array();
                              var line=[{'class':'issue','value':'最大连出'}];
                   
                                      
                                var num0 = min;
                                  while (num0 <= max) {
                                       line.push({'class':'num','value':MaxNum[num0]});
                                             num0++;
                                 }
                                 
                               lists.push(line);
                               var line=[{'class':'issue','value':'最大遗漏'}];
                                  
                                       
                                 var num0 = min;
                                   while (num0 <= max) {
                                        line.push({'class':'num','value':MaxLostNum[num0]});
                                              num0++;
                                  }
                                  
                                lists.push(line);
                               var line=[{'class':'issue','value':'出现次数'}];
                                  
                                 var num0 = min;
                                   while (num0 <= max) {
                                        line.push({'class':'num','value':countArray[num0]});
                                              num0++;
                                 
                                  }
                                lists.push(line);
                                var line=[{'class':'issue','value':'平均遗漏'}];
                                   
                                       
                                  var num0 = min;
                                    while (num0 <= max) {
                                               if(countArray[num0]>0)
                                                      var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                        else
                                                      var tt= this.historylist.length;
                                                        tt=parseInt(tt);
                                         line.push({'class':'num','value':tt});
                                               num0++;
                                   }
                                  
                                 lists.push(line);
                  this.LotteryBottomLines=new Array();
                           this.LotteryBottomLines=lists;
                            this.scrollToBottom();
         
               },
               
               //龙虎走势
               
               lhhList(type) {
   this.ischart=false;
                          var wei_num = this.wanfa_key2.split('-');
                            var wei_from = wei_num[0];
                               var wei_to = wei_num[1];
               var lines=[];
                     var min = 0;
                       var max = 5;
                       var count = 10;
                       var ballNum = 1;
                
               this.LotteryHeadLines=[];
               this.LotteryHeadLines.push('期号');
             
             
               var wanfa_title2='';
               for(var ii in this.wei_arr[this.wanfa_key1]){
                  if(ii==this.wanfa_key2) {
                    wanfa_title2= this.wei_arr[this.wanfa_key1][ii];
                      break;
                  }
               }
                       for (var j = 0; j <2; j++) {
                             this.LotteryHeadLines.push(wanfa_title2.substr(j,1));
                          
                       }
               this.LotteryHeadLines.push('龙');this.LotteryHeadLines.push('虎');this.LotteryHeadLines.push('和');
     
                       for (var j = 3; j <5; j++) {
                            this.LotteryHeadLines.push(wanfa_title2.substr(j,1));
                       }
                     this.LotteryHeadLines.push('龙');this.LotteryHeadLines.push('虎');this.LotteryHeadLines.push('和');
 
                       var countArray = new Array();
                       var MaxNum = new Array();
                       var MaxNumArray = new Array();
                       var MaxLostNum = new Array();
                       var strArray = new Array();
                       var numArray = new Array();
               
               
                       for (var j = min; j <= max; j++) {
                           countArray[j] = 0;
                           MaxNum[j] = 0;
                           MaxNumArray[j] = 0;
                           MaxLostNum[j] = 0;
                           strArray[j] = 0;
                           numArray[j] = 0;
                       }
              
                    for(var i=this.historylist.length-1;i>=0;i--){
                        var item=this.historylist[i];
                        var line=[];
                           var dt = item;
                           var num0;
                         var strArray2 = item['openCode'].split(',');
                              line.push({'class':'issue','value':this.issue(item['issueNo'])});
               
                           num0 = min;
                           var showarr=new Array('龙','和','虎');
                           var arr1= new Array(strArray2[parseInt(wei_from.substr(0,1))],strArray2[parseInt(wei_from.substr(1,1))]);
               
                           for(var tt=0;tt<arr1.length;tt++){
                                  line.push({'class':'noborder','value':arr1[tt]});
                               
                           }
                           var code1=parseInt(arr1[0]);
                           var code2=parseInt(arr1[1]);
                           for(var j=0;j<3;j++){
               
                               num0=j;
               
               
                               if((j%3==0 && code1>code2) || (j%3==1 && code1==code2) || (j%3==2 && code1<code2) ){
               
                                   var sta=1;
                                   var showname=showarr[j%3];
                               }else sta=0;
               
               
                               if (sta==1) {
                                   countArray[num0]++;
                                   numArray[num0] = -1;
                                   MaxNumArray[num0]++;
                                   if (MaxNum[num0] < MaxNumArray[num0])
                                       MaxNum[num0] = MaxNumArray[num0];
                                    line.push({'class':'numbg'+j%3,'value':showname});
                                  // str3 += "<td class='numbg"+j%3+"'>"+showname+"</td>";
                               }
                               else {
                                   MaxNumArray[num0] = 0;
                                   numArray[num0]++;
                                   if (MaxLostNum[num0] < numArray[num0])
                                       MaxLostNum[num0] = numArray[num0];
               
                                  // str3 += "<td class=\"wdh td0\">"+numArray[num0]+"</td>";
                                   line.push({'class':'noborder','value':numArray[num0]});
               
                               }

                           }
  
                           var arr1= new Array(strArray2[parseInt(wei_to.substr(0,1))],strArray2[parseInt(wei_to.substr(1,1))]);
               
               
                           for(var tt=0;tt<arr1.length;tt++){
                               line.push({'class':'noborder','value':arr1[tt]});
                           }
               
                           var code1=parseInt(arr1[0]);
                           var code2=parseInt(arr1[1]);
                           for(var j=3;j<6;j++){
               
                               num0=j;
               
               
                               if((j%3==0 && code1>code2) || (j%3==1 && code1==code2) || (j%3==2 && code1<code2) ){
               
                                   var sta=1;
                                   var showname=showarr[j%3];
                               }else sta=0;
               
               
                               if (sta==1) {
                                   countArray[num0]++;
                                   numArray[num0] = -1;
                                   MaxNumArray[num0]++;
                                   if (MaxNum[num0] < MaxNumArray[num0])
                                       MaxNum[num0] = MaxNumArray[num0];
                line.push({'class':'numbg'+j%3,'value':showname});
                                  // str3 += "<td class='numbg"+j%3+"'>"+showname+"</td>";
                               }
                               else {
                                   MaxNumArray[num0] = 0;
                                   numArray[num0]++;
                                   if (MaxLostNum[num0] < numArray[num0])
                                       MaxLostNum[num0] = numArray[num0];
               
                                 //  str3 += "<td class=\"wdh td0\">"+numArray[num0]+"</td>";
               line.push({'class':'noborder','value':numArray[num0]});
                               }
                    }
               

                   lines.push(line);
                    }
                   // console.log(lines);
                    this.LotteryLines=lines;
               
               
               
               var lists=new Array();
                           var line=[{'class':'issue','value':'最大连出'}];
                
                                  line.push({'class':'num','value':''});
                                  line.push({'class':'num','value':''}); 
                             var num0 = min;
                               while (num0 <= max) {
                                    
                                    line.push({'class':'num','value':MaxNum[num0]});
                                    if(num0==2){
                                        line.push({'class':'num','value':''});
                                        line.push({'class':'num','value':''}); 
                                    }
                                          num0++;
                              }
                              
                            lists.push(line);
                            var line=[{'class':'issue','value':'最大遗漏'}];
                     line.push({'class':'num','value':''});
                     line.push({'class':'num','value':''}); 
                                    
                              var num0 = min;
                                while (num0 <= max) {
                                     line.push({'class':'num','value':MaxLostNum[num0]});
                                     if(num0==2){
                                         line.push({'class':'num','value':''});
                                         line.push({'class':'num','value':''}); 
                                     }
                                           num0++;
                               }
                               
                             lists.push(line);
                            var line=[{'class':'issue','value':'出现次数'}];
                            line.push({'class':'num','value':''});
                            line.push({'class':'num','value':''}); 
                              var num0 = min;
                                while (num0 <= max) {
                                     line.push({'class':'num','value':countArray[num0]});
                                     if(num0==2){
                                         line.push({'class':'num','value':''});
                                         line.push({'class':'num','value':''}); 
                                     }
                                           num0++;
                              
                               }
                             lists.push(line);
                             var line=[{'class':'issue','value':'平均遗漏'}];
                                
                                 line.push({'class':'num','value':''});
                                 line.push({'class':'num','value':''}); 
                               var num0 = min;
                                 while (num0 <= max) {
                                            if(countArray[num0]>0)
                                                   var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                     else
                                                   var tt= this.historylist.length;
                                                     tt=parseInt(tt);
                                      line.push({'class':'num','value':tt});
                                      if(num0==2){
                                         line.push({'class':'num','value':''});
                                         line.push({'class':'num','value':''}); 
                                      }
                                            num0++;
                                }
                               
                              lists.push(line);
               this.LotteryBottomLines=new Array();
                        this.LotteryBottomLines=lists;
                         this.scrollToBottom();
  
                   },
                   
                   //大小单双
                    dxList(type) {
                   
                          this.ischart=false;
                           var wei_num = this.wanfa_key2.split('-');
                   
                           var wei_from = parseInt(wei_num[0]);
                           var wei_to = parseInt(wei_num[1]);
                   
                       
                           var min = 0;
                           var max = 5;
                           var count = 10;
                           var ballNum = 1;
                   
          this.LotteryHeadLines=[];
          this.LotteryHeadLines.push('期号');
            var gametype=this.gameshow.type;          
                       var type=this.wanfa_key1;
          var wanfa_title2='';
          for(var ii in this.wei_arr[this.wanfa_key1]){
             if(ii==this.wanfa_key2) {
               wanfa_title2= this.wei_arr[this.wanfa_key1][ii];
                 break;
             }
          }
                   
                         
                           for (var j = 0; j < wanfa_title2.length; j++) {
                                 this.LotteryHeadLines.push(wanfa_title2.substr(j,1));

                           }
                   
                   
                           for (var j = 0; j < wanfa_title2.length; j++) {
                     this.LotteryHeadLines.push(wanfa_title2.substr(j,1)); 
                     this.LotteryHeadLines.push('位');
                   
                           }
                        
                           var countArray = new Array();
                           var MaxNum = new Array();
                           var MaxNumArray = new Array();
                           var MaxLostNum = new Array();
                           var strArray = new Array();
                           var numArray = new Array();
                   
                   
                           for (var j = min; j <= max; j++) {
                               countArray[j] = 0;
                               MaxNum[j] = 0;
                               MaxNumArray[j] = 0;
                               MaxLostNum[j] = 0;
                               strArray[j] = 0;
                               numArray[j] = 0;
                           }
                   
                           var lines=[];
                        for(var i=this.historylist.length-1;i>=0;i--){
                            var item=this.historylist[i];
                            var line=[];
                               var dt = item;
                               var num0;
                             var strArray2 = item['openCode'].split(',');
                                  line.push({'class':'issue','value':this.issue(item['issueNo'])});
                                       
                              
                   
                               num0 = min;
                               strArray2=this.Lot_New(strArray2,wei_from,wei_to);
                               for(var tt=0;tt<strArray2.length;tt++){
                                    line.push({'class':'noborder','value':strArray2[tt]});
                                   //str3+="<td class='noborder'>"+strArray2[tt]+"</td>";
                               }
                   
                   
                   
                   
                               for(var j=0;j<3;j++){
                   
                                   for(var k=0;k<2;k++){
                                    var   code=parseInt(strArray2[j]);
                                       num0=2*j+k;
                                       if(k==0){
                   
                                           if((type=='ds' && code%2==1) || (type=='dx' && (((gametype=='ssc' || gametype=='dp') && code>=5) || (gametype=='11x5'
                                                   && code>=7)|| (gametype=='k3' && code>=4) || (gametype=='pk10' && code>=6))) ){
                   
                                               var sta=1;
                                               if(type=='ds') var showname='单';
                                               else var showname='大';
                                           }else sta=0;
                  
                                       }else{
                                           if((type=='ds' && code%2==0) || (type=='dx' &&  (((gametype=='ssc' || gametype=='dp')  && code<5) || (gametype=='11x5'
                                                   && code<7) || (gametype=='k3' && code<4)|| (gametype=='pk10' && code<6))) ){
                   
                                               var sta=1;
                                               if(type=='ds') var showname='双';
                                               else var showname='小';
                                           }else sta=0;
                   
                                       }
                   
                                       if (sta==1) {
                                           countArray[num0]++;
                                           numArray[num0] = -1;
                                           MaxNumArray[num0]++;
                                           if (MaxNum[num0] < MaxNumArray[num0])
                                               MaxNum[num0] = MaxNumArray[num0];
                                            line.push({'class':'numbg'+k,'value':showname});
                                           //str3 += "<td class='numbg"+k+"'>"+showname+"</td>";
                                       }
                                       else {
                                           MaxNumArray[num0] = 0;
                                           numArray[num0]++;
                                           if (MaxLostNum[num0] < numArray[num0])
                                               MaxLostNum[num0] = numArray[num0];
                   line.push({'class':'','value':numArray[num0]});
                                       //    str3 += "<td class=\"wdh td0\">"+numArray[num0]+"</td>";
                   
                                       }
                   
                                   }
                   
                               }
                   
                   
                              lines.push(line);
                               }
                              // console.log(lines);
                               this.LotteryLines=lines;
                   
                         var lists=new Array();
                                     var line=[{'class':'issue','value':'最大连出'}];
                                          line.push({'class':'num','value':''});
                                               line.push({'class':'num','value':''});
                                                line.push({'class':'num','value':''});
                          
                                       var num0 = min;
                                         while (num0 <= max) {
                                              line.push({'class':'num','value':MaxNum[num0]});
                                                    num0++;
                                        }
                                        
                                      lists.push(line);
                                      var line=[{'class':'issue','value':'最大遗漏'}];
                                         
                                              line.push({'class':'num','value':''});
                                                   line.push({'class':'num','value':''});
                                                    line.push({'class':'num','value':''});
                                        var num0 = min;
                                          while (num0 <= max) {
                                               line.push({'class':'num','value':MaxLostNum[num0]});
                                                     num0++;
                                         }
                                         
                                       lists.push(line);
                                      var line=[{'class':'issue','value':'出现次数'}];
                                         line.push({'class':'num','value':''});
                                              line.push({'class':'num','value':''});
                                               line.push({'class':'num','value':''});
                                        var num0 = min;
                                          while (num0 <= max) {
                                               line.push({'class':'num','value':countArray[num0]});
                                                     num0++;
                                        
                                         }
                                       lists.push(line);
                                       var line=[{'class':'issue','value':'平均遗漏'}];
                                          line.push({'class':'num','value':''});
                                               line.push({'class':'num','value':''});
                                                line.push({'class':'num','value':''});
                                              
                                         var num0 = min;
                                           while (num0 <= max) {
                                                      if(countArray[num0]>0)
                                                             var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                               else
                                                             var tt= this.historylist.length;
                                                               tt=parseInt(tt);
                                                line.push({'class':'num','value':tt});
                                                      num0++;
                                          }
                                         
                                        lists.push(line);
                         this.LotteryBottomLines=new Array();
                                  this.LotteryBottomLines=lists;
                                   this.scrollToBottom();
                  
                   
                       },
                       //快三和值形态
                       hzxtList() {
                       
                       
                            this.ischart=false;
                                   
                                   
                                     
                            this.LotteryHeadLines=[];
                            this.LotteryHeadLines.push('期号');
                           
                               var min = 0;
                               var max = 2;
                       
                       
                            this.LotteryHeadLines.push('一');
                             this.LotteryHeadLines.push('二');
                              this.LotteryHeadLines.push('三');
                               this.LotteryHeadLines.push('和值');
                                this.LotteryHeadLines.push('三同号');
                                 this.LotteryHeadLines.push('三不同号');
                                  this.LotteryHeadLines.push('二同号');
                      
                               var countArray = new Array();
                               var MaxNum = new Array();
                               var MaxNumArray = new Array();
                               var MaxLostNum = new Array();
                               var strArray = new Array();
                               var numArray = new Array();
                       
                       
                               for (var j = min; j <= max; j++) {
                                   countArray[j] = 0;
                                   MaxNum[j] = 0;
                                   MaxNumArray[j] = 0;
                                   MaxLostNum[j] = 0;
                                   strArray[j] = 0;
                                   numArray[j] = 0;
                               }
                  
                             var lines=[];
                             for(var i=this.historylist.length-1;i>=0;i--){
                                 var line=[];
                                 var item=this.historylist[i];
                                   
                       var strArray2 = item['openCode'].split(',');
                            line.push({'class':'issue','value':this.issue(item['issueNo'])});
                       
                       

                       
                                   num0 = min;
                                   for(var tt=0;tt<strArray2.length;tt++){
                                  
                                       line.push({'class':'noborder','value':strArray2[tt]});
                                   }
                                   var sum=this.arr_sum(strArray2);
                                   
                                     line.push({'class':'numbg4','value':sum});
                                  
                       
                                   var showarr=new Array('三同号','三不同号','二同号');
                                  
                                   for(var j=0;j<3;j++){
                       
                       
                       
                                       if(strArray2[0]==strArray2[1] && strArray2[1]==strArray2[2] ){
                       
                                          if(j==0) var sta=1;
                                          else sta=0;
                       
                                       }else if(strArray2[0]!=strArray2[1] && strArray2[1]!=strArray2[2] && strArray2[0]!=strArray2[2]) {
                       
                                           if(j==1) var sta=1;
                                           else sta=0;
                                       }
                                       else{
                                           if(j==2) var sta=1;
                                           else sta=0;
                                       }
                       
                       
                                       var showname=showarr[j];
                       num0=j;
                                       if (sta==1) {
                                           countArray[num0]++;
                                           numArray[num0] = -1;
                                           MaxNumArray[num0]++;
                                           if (MaxNum[num0] < MaxNumArray[num0])
                                               MaxNum[num0] = MaxNumArray[num0];
                        line.push({'class':'numbg'+j,'value':showname});
                                           //str3 += "<td class='numbg"+j+"'>"+showname+"</td>";
                                       }
                                       else {
                                           MaxNumArray[num0] = 0;
                                           numArray[num0]++;
                                           if (MaxLostNum[num0] < numArray[num0])
                                               MaxLostNum[num0] = numArray[num0];
                       line.push({'class':'noborder','value':numArray[num0]});
                                       
                       
                                       }
                       
                                     num0++;
                       
                                   }
                       
                       
                                   lines.push(line);
                                                  }
                                                 // console.log(lines);
                                                  this.LotteryLines=lines;
                                             
                                             
                                             
                                             var lists=new Array();
                                                         var line=[{'class':'issue','value':'最大连出'}];
                                              
                                                                line.push({'class':'num','value':''});
                                                                line.push({'class':'num','value':''}); 
                                                                line.push({'class':'num','value':''});
                                                         line.push({'class':'num','value':''});
                                                               
                                                           var num0 = min;
                                                             while (num0 <= max) {
                                                                  
                                                                  line.push({'class':'num','value':MaxNum[num0]});
                                                                 
                                                                        num0++;
                                                            }
                                                            
                                                          lists.push(line);
                                                          var line=[{'class':'issue','value':'最大遗漏'}];
                                                line.push({'class':'num','value':''});
                                                line.push({'class':'num','value':''}); 
                                                line.push({'class':'num','value':''});
                                          line.push({'class':'num','value':''});
                                                            var num0 = min;
                                                              while (num0 <= max) {
                                                                   line.push({'class':'num','value':MaxLostNum[num0]});
                                                                 
                                                                         num0++;
                                                             }
                                                             
                                                           lists.push(line);
                                                          var line=[{'class':'issue','value':'出现次数'}];
                                               line.push({'class':'num','value':''});
                                               line.push({'class':'num','value':''}); 
                                               line.push({'class':'num','value':''});
                                              line.push({'class':'num','value':''});
                                                            var num0 = min;
                                                              while (num0 <= max) {
                                                                   line.push({'class':'num','value':countArray[num0]});
                                                                 
                                                                         num0++;
                                                            
                                                             }
                                                           lists.push(line);
                                                           var line=[{'class':'issue','value':'平均遗漏'}];
                                                              
                                                             line.push({'class':'num','value':''});
                                                             line.push({'class':'num','value':''}); 
                                                             line.push({'class':'num','value':''});
                                                             line.push({'class':'num','value':''}); 
                                                             
                                                             var num0 = min;
                                                               while (num0 <= max) {
                                                                          if(countArray[num0]>0)
                                                                                 var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                                                   else
                                                                                 var tt= this.historylist.length;
                                                                                   tt=parseInt(tt);
                                                                    line.push({'class':'num','value':tt});
                                                                   
                                                                          num0++;
                                                              }
                                                       
                                   
                                   lists.push(line);
                                   this.LotteryBottomLines=new Array();
                                       this.LotteryBottomLines=lists;
                                        this.scrollToBottom();
                                   
                       
                           },
                       
                       
                       
            //11选5和值个数比
                       hmdsList() {
                       
                       this.ischart=false;
                             this.LotteryHeadLines=[];
                             this.LotteryHeadLines.push('期号');
                          this.LotteryHeadLines.push('一');
                             this.LotteryHeadLines.push('二');
                          this.LotteryHeadLines.push('三');
                             this.LotteryHeadLines.push('四');
                                this.LotteryHeadLines.push('五');
                                   this.LotteryHeadLines.push('5:0');
                                      this.LotteryHeadLines.push('4:1');
                                         this.LotteryHeadLines.push('3:2');
                                            this.LotteryHeadLines.push('2:3');
                                               this.LotteryHeadLines.push('1:4');
                                                  this.LotteryHeadLines.push('0:5');
                             
                               var min = 0;
                               var max = 5;
                       
                      
                       
                      
                       
                       
                               var countArray = new Array();
                               var MaxNum = new Array();
                               var MaxNumArray = new Array();
                               var MaxLostNum = new Array();
                               var strArray = new Array();
                               var numArray = new Array();
                       
                       
                               for (var j = min; j <= max; j++) {
                                   countArray[j] = 0;
                                   MaxNum[j] = 0;
                                   MaxNumArray[j] = 0;
                                   MaxLostNum[j] = 0;
                                   strArray[j] = 0;
                                   numArray[j] = 0;
                               }
                       
                             var lines=[];
                      
                             for(var i=this.historylist.length-1;i>=0;i--){
                                 var item=this.historylist[i];
                                    var line=[];
                                  
                                   var num0=min;
                               
                              
                       var strArray2 = item['openCode'].split(',');
                            line.push({'class':'issue','value':this.issue(item['issueNo'])});
                       
                       

                       
                                  
                                   for(var tt=0;tt<strArray2.length;tt++){
                                        line.push({'class':'noborder','value':strArray2[tt]});
                                   }
                       
                       
                       
                                   var showarr=new Array('5:0','4:1','3:2','2:3','1:4','0:5');
                                   for(var j=0;j<6;j++){
                                       var dan=0;
                                       var shuang=0;
                                       for(var tt=0;tt<strArray2.length;tt++){
                       
                                           if(strArray2[tt]%2==1) dan++;
                                           else shuang++;
                                       }
                                       var code=showarr[j].split(':');
                                       if(dan==parseInt(code[0])){
                       
                                           var sta=1;
                                           var showname=showarr[j];
                                       }else sta=0;
                       
                       
                       
                                       if (sta==1) {
                                           countArray[num0]++;
                                           numArray[num0] = -1;
                                           MaxNumArray[num0]++;
                                           if (MaxNum[num0] < MaxNumArray[num0])
                                               MaxNum[num0] = MaxNumArray[num0];
                                              line.push({'class':'numbg'+j,'value':showname});
                                         
                                       }
                                       else {
                                           MaxNumArray[num0] = 0;
                                           numArray[num0]++;
                                           if (MaxLostNum[num0] < numArray[num0])
                                               MaxLostNum[num0] = numArray[num0];
                       
                                                line.push({'class':'noborder','value':numArray[num0]});
                                          
                                       }
                       
                         num0++;
                       
                                   }
                       
                       
                                 lines.push(line);
                                      }
                                     // console.log(lines);
                                      this.LotteryLines=lines;
                                 
                                 
                                 
                                 var lists=new Array();
                                             var line=[{'class':'issue','value':'最大连出'}];
                                  
                                                    line.push({'class':'num','value':''});
                                                    line.push({'class':'num','value':''}); 
                                                    line.push({'class':'num','value':''});
                                                    line.push({'class':'num','value':''}); 
                                                    line.push({'class':'num','value':''});
                                                   
                                               var num0 = min;
                                                 while (num0 <= max) {
                                                      
                                                      line.push({'class':'num','value':MaxNum[num0]});
                                                     
                                                            num0++;
                                                }
                                                
                                              lists.push(line);
                                              var line=[{'class':'issue','value':'最大遗漏'}];
                                    line.push({'class':'num','value':''});
                                    line.push({'class':'num','value':''}); 
                                    line.push({'class':'num','value':''});
                                    line.push({'class':'num','value':''}); 
                                    line.push({'class':'num','value':''});     
                                                var num0 = min;
                                                  while (num0 <= max) {
                                                       line.push({'class':'num','value':MaxLostNum[num0]});
                                                     
                                                             num0++;
                                                 }
                                                 
                                               lists.push(line);
                                              var line=[{'class':'issue','value':'出现次数'}];
                                   line.push({'class':'num','value':''});
                                   line.push({'class':'num','value':''}); 
                                   line.push({'class':'num','value':''});
                                   line.push({'class':'num','value':''}); 
                                   line.push({'class':'num','value':''});
                                                var num0 = min;
                                                  while (num0 <= max) {
                                                       line.push({'class':'num','value':countArray[num0]});
                                                     
                                                             num0++;
                                                
                                                 }
                                               lists.push(line);
                                               var line=[{'class':'issue','value':'平均遗漏'}];
                                                  
                                                 line.push({'class':'num','value':''});
                                                 line.push({'class':'num','value':''}); 
                                                 line.push({'class':'num','value':''});
                                                 line.push({'class':'num','value':''}); 
                                                 line.push({'class':'num','value':''});
                                                 var num0 = min;
                                                   while (num0 <= max) {
                                                              if(countArray[num0]>0)
                                                                     var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                                       else
                                                                     var tt= this.historylist.length;
                                                                       tt=parseInt(tt);
                                                        line.push({'class':'num','value':tt});
                                                       
                                                              num0++;
                                                  }
                                           
                       
                       lists.push(line);
                       this.LotteryBottomLines=new Array();
                           this.LotteryBottomLines=lists;
                            this.scrollToBottom();
                       
                           },

                       //五星和值
       hz5xList() {
            this.ischart=false;
      
        var LotteryHeadLines = "";
        var LotteryLines = "";
        var min = 0;
        var max = 9;


        min = 0;
        max = 3;

this.LotteryHeadLines=[];
          this.LotteryHeadLines.push('期号');
            this.LotteryHeadLines.push('万');
             this.LotteryHeadLines.push('千');
              this.LotteryHeadLines.push('百');
               this.LotteryHeadLines.push('十');
                this.LotteryHeadLines.push('个');
                 this.LotteryHeadLines.push('和值');
                  this.LotteryHeadLines.push('大');
                   this.LotteryHeadLines.push('小');
                    this.LotteryHeadLines.push('单');
                     this.LotteryHeadLines.push('双');
       
 
        var countArray = new Array();
        var MaxNum = new Array();
        var MaxNumArray = new Array();
        var MaxLostNum = new Array();
        var strArray = new Array();
        var numArray = new Array();


        for (var j = min; j <= max; j++) {
            countArray[j] = 0;
            MaxNum[j] = 0;
            MaxNumArray[j] = 0;
            MaxLostNum[j] = 0;
            strArray[j] = 0;
            numArray[j] = 0;
        }

       var lines=[];
       for(var i=this.historylist.length-1;i>=0;i--){
           var item=this.historylist[i];
           var line=[];
              var dt = item;
              var num0;
            var strArray2 = item['openCode'].split(',');
                 line.push({'class':'issue','value':this.issue(item['issueNo'])});
         
            num0 = min;
            for(var tt=0;tt<strArray2.length;tt++){
                 line.push({'class':'noborder','value':strArray2[tt]});
              //  str3+="<td class='noborder'>"+strArray2[tt]+"</td>";
            }
            var sum=this.arr_sum(strArray2);
             line.push({'class':'numbg4','value':sum});
           

            var showarr=new Array('大','小','单','双');
            for(var j=0;j<4;j++){


               var  code=parseInt(strArray2[j]);
                num0=j;

                if((j==0 && code>5) || (j==1 && code<5) || (j==2 && code%2==1) || (j==3 && code%2==0) ){

                    var sta=1;
                    var showname=showarr[j];
                }else sta=0;



                if (sta==1) {
                    countArray[num0]++;
                    numArray[num0] = -1;
                    MaxNumArray[num0]++;
                    if (MaxNum[num0] < MaxNumArray[num0])
                        MaxNum[num0] = MaxNumArray[num0];
      line.push({'class':'numbg'+j,'value':showname});
                  //  str3 += "<td class='numbg"+j+"'>"+showname+"</td>";
                }
                else {
                    MaxNumArray[num0] = 0;
                    numArray[num0]++;
                    if (MaxLostNum[num0] < numArray[num0])
                        MaxLostNum[num0] = numArray[num0];
                   line.push({'class':'','value':numArray[num0]});
                  //  str3 += "<td class=\"wdh td0\">"+numArray[num0]+"</td>";
                }
            }
       lines.push(line);
        }
       // console.log(lines);
        this.LotteryLines=lines;
  var lists=new Array();
                                     var line=[{'class':'issue','value':'最大连出'}];
                                     for(var i=0;i<6;i++){
                                        line.push({'class':'num','value':''}); 
                                     }
                                    
                                       var num0 = min;
                                         while (num0 <= max) {
                                              line.push({'class':'num','value':MaxNum[num0]});
                                                    num0++;
                                        }
                                        
                                      lists.push(line);
                                      var line=[{'class':'issue','value':'最大遗漏'}];
                               for(var i=0;i<6;i++){
                                  line.push({'class':'num','value':''}); 
                               }
                                                                   
                                        var num0 = min;
                                          while (num0 <= max) {
                                               line.push({'class':'num','value':MaxLostNum[num0]});
                                                     num0++;
                                         }
                                         
                                       lists.push(line);
                                      var line=[{'class':'issue','value':'出现次数'}];
                                       for(var i=0;i<6;i++){
                                          line.push({'class':'num','value':''}); 
                                       }
                                                                           
                                        var num0 = min;
                                          while (num0 <= max) {
                                               line.push({'class':'num','value':countArray[num0]});
                                                     num0++;
                                        
                                         }
                                       lists.push(line);
                                       var line=[{'class':'issue','value':'平均遗漏'}];
                                         for(var i=0;i<6;i++){
                                            line.push({'class':'num','value':''}); 
                                         }
                                                                             
                                         var num0 = min;
                                           while (num0 <= max) {
                                                      if(countArray[num0]>0)
                                                             var tt= (this.historylist.length-countArray[num0])/countArray[num0];
                                                               else
                                                             var tt= this.historylist.length;
                                                               tt=parseInt(tt);
                                                line.push({'class':'num','value':tt});
                                                      num0++;
                                          }
                                         
                                        lists.push(line);
                              this.LotteryBottomLines=new Array();
                                  this.LotteryBottomLines=lists;
                                   this.scrollToBottom();
                

    },
    
    //和值跨度
    hzList(type) {
    this.ischart=false;
    

            var min = 0;
            var max = 9;
    
 
            min = 0;
            max = 3;
    
    this.LotteryHeadLines=[];
              this.LotteryHeadLines.push('期号');
                this.LotteryHeadLines.push('万');
                 this.LotteryHeadLines.push('千');
                  this.LotteryHeadLines.push('百');
                   this.LotteryHeadLines.push('十');
                    this.LotteryHeadLines.push('个');
             
                      this.LotteryHeadLines.push('前二');
                       this.LotteryHeadLines.push('前三');
                        this.LotteryHeadLines.push('中三');
                         this.LotteryHeadLines.push('后三');
                          this.LotteryHeadLines.push('后二');
                 var type= this.wanfa_key1; 

 var lines=[];
 for(var i=this.historylist.length-1;i>=0;i--){
     var item=this.historylist[i];
     var line=[];
        var dt = item;
        var num0;
      var strArray2 = item['openCode'].split(',');
           line.push({'class':'issue','value':this.issue(item['issueNo'])});
               
  
              
                num0 = min;
                for(var tt=0;tt<strArray2.length;tt++){
                   
                     line.push({'class':'','value':strArray2[tt]});
                    
                }
    
    
                var showarr=new Array('0-1','0-2','1-3','2-4','3-4');
                for(var j=0;j<5;j++){
                    var weinum=showarr[j].split('-');
    
                    var codearr=this.Lot_New(strArray2,parseInt(weinum[0]),parseInt(weinum[1]));
                    if(type=='hz')
                        var sum=this.arr_sum(codearr);
                    else var sum=this.arr_kd(codearr);
                    //str3 += "<td class='numbg"+j+"'>"+sum+"</td>";
                     line.push({'class':'numbg'+j,'value':sum});
    
    
                }
    
  
            lines.push(line);
             }
            // console.log(lines);
             this.LotteryLines=lines;
               this.LotteryBottomLines=new Array();
        },
       arr_sum( arr ) {
            var sum=0;
            for(var i=0;i<arr.length;i++){
                sum+=parseInt(arr[i]);
            }
            return sum;
        },
        arr_kd( arr ) {
                var sum=0;
                for(var i=0;i<arr.length-1;i++){
                    for(var j=i+1;j<arr.length;j++){
                        var cha=arr[i]-arr[j];
                        if(cha<0) cha=-cha;
                        if(cha>sum) sum=cha;
                    }
                }
                return sum;
            },
                Lot_New(arr,begin,to){
                       var arr11=Array();
                       for(var i=begin;i<to+1;i++){
               
                           arr11[arr11.length]=arr[i];
                       }
                       return arr11;
               
                   },
                   in_arr_num(arr,str) {
                           var num=0;
                           for(var i=0;i<arr.length;i++){
                   
                               if(arr[i]==str) num++;
                           }
                           return num;
                       },
           drawchart(){
            var windowWidth= uni.getSystemInfoSync().windowWidth;
              var type=this.gameshow.type;
              if(type=='k3') var ballnum=6;
              else if(type=='11x5') var ballnum=11;
              else var ballnum=10;
            
            var w=(windowWidth - 56)/ballnum;
               var context = uni.createCanvasContext('ballchart',this);
               var lineheight=31;
               //#ifdef APP-PLUS
              if(plus.os.name=='iOS')
               var lineheight=31;
               else var lineheight=30.5;
               //#endif
                   context.setStrokeStyle("#5250ae")
                   context.setLineWidth(1)
                   context.clearRect(0,0,windowWidth,this.historylist.length*lineheight);
                      var num=0;
                   for(var i=this.historylist.length-1;i>=0;i--){
                         var item=this.historylist[i];
                          var strArray2 = item['openCode'].split(',');
                          var code=strArray2[this.wanfa_key2];
                          if(type!='ssc' && type!='ffc') code=parseInt(code)-1;
                          var y=lineheight*num+16;
                         
                          var x=w*code+w/2;
                          if(num==0){
                               context.moveTo(x,y);
                          }
                          else{
                               context.lineTo(x,y);
                          }
                       num++;
                   
                   }

                   setTimeout(function() { //必须延迟执行 不然H5不显示
                   context.stroke()
                   context.draw()
                   }, 200)
                  
           },
           
           load_trend(){
              if(this.wanfa_key1=='danhao') this.danhaoList();
                if(this.wanfa_key1=='duohao') this.duohaoList();
                if(this.wanfa_key1=='lhh') this.lhhList();
                if(this.wanfa_key1=='ds' || this.wanfa_key1=='dx') this.dxList();
               if(this.wanfa_key1=='5xhz') this.hz5xList();
               if(this.wanfa_key1=='hz' || this.wanfa_key1=='kd') this.hzList();
               if(this.wanfa_key1=='hmds') this.hmdsList();
               if(this.wanfa_key1=='hzxt') this.hzxtList();
           },
			showdata(){
           
            this.loadmethod();
          //  this.load_trend();
               
            }
		},
        watch:{
          historylist(){
       
              this.load_trend();
          }  ,
          gameid(){
                this.historylist=this.lotterylist;
               this.loadmethod();
          }
        },
        created() {
            this.showdata(); 
            // #ifndef APP-PLUS
               this.pagebottom='55'
            // #endif
            
            
            this.$socket.on('sendlottery', (res) => {
             //  console.log(res.data)
               this.update_lottery(res.data)
             })  
        },
        destroyed() {
         
            this.$socket.off('sendlottery');
        }
	}
</script>

<style>
    .pages{
         height: 35px;
         line-height: 35px;
         text-align: center;
         font-size: 14px;
       
         
     }
     
     .pages > view{
         display: inline-block;
         height: 35px;
         width: 34px;
         line-height: 35px;
         border: 1px #eee solid;
         margin: 10px auto;
         background-color: #fff;
    
     }
    .pages > view.active{
        color:#fff;
        border: 1px solid #2319DC;
        background-color: #2319DC;
    }
       
    .canvas{
        position: absolute;
     top:32px;
        left:56px;
        width: calc(100% - 56px);
        display: inline-block;
        z-index: 1;
        border: 0px #FF0000 solid;
    }
.query-form
{
   position: fixed;
top:-2px;
    left: 0px;
    width: 100%;
    height:60px;
    line-height: 30px;
    display: inline-block;
    background-color: #fff;
    border-bottom: 1px #ccc solid;
    z-index: 999999;
    text-align: center;
}
.showtabs{
    position: fixed;
    top:65px;
    left: 0px;
    width: 100%;
  
    line-height: 35px;

    background-color: #fff;

    z-index: 9999999;
    text-align: center;
overflow-y: scroll;
    -webkit-transform: translate(100vw,-50%);
    -moz-transform: translate(100vw,-50%);
    -ms-transform: translate(100vw,-50%);
    transform: translate(100vw,-50%);
    -webkit-transition: .5s;
    -moz-transition: .5s;
    -ms-transition: .5s;
    transition: .5s;
   font-size: 14px;
    -webkit-overflow-scrolling: touch;

}
.showtabs.active{
    transform: translate(0,0%);

}
.showtabs::-webkit-scrollbar{
    display: none;
}
.showtabs .lines{

    height:28;
    line-height:28px;
    background-color: #ccc;
    color: #333;
    text-align: left;padding-left: 10px;
    clear: both;
    margin-top: 0px;
}
.showtabs .line-btn{
    clear: both;
    display:inline-block;
    padding:5px 0px;
    width: 100%;
    margin-bottom: 0px;
}
.showtabs .line-btn .item{
    display: inline-block;
    width: 80px;
    margin: 5px 20px;
text-align: center;
    border: 1px #ddd solid;
    border-radius: 15px;
    height:30px;
    line-height:30px;

}
.showtabs .line-btn .item:nth-child(3n+1){
    float: left;

}
.showtabs .line-btn .item:nth-child(3n+2){
    float: left;

}
.showtabs .line-btn .item:nth-child(3n){
    float: right;

}
.showtabs .line-btn .item.current{
    background-color: #5250ae;
    color: #fff;
}
.query-form .menu{
    height: 30px;
    line-height: 30px;
}
.query-form .menu view{
    display: inline-block;
    height:25px;
    line-height: 25px;
    width: 60px;
    text-align: center;
    border:1px solid  #5250ae;
    border-radius: 5px;
    color: #5250ae;
    background-color: #fff;
    font-size: 12px;
    margin: 0 2px;
    vertical-align:middle;
}
.query-form .menu view.current{
    background-color: #5250ae;
    color: #fff;

}
.query-form .menu2{
    height: 30px;
    line-height: 30px;
    font-size: 28upx;
    margin-top: 10upx;
}
.query-form .lab, .query-form .ipt, .query-form select, .query-form .to, .query-form .btn, .query-form .query-date
{
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
}
.query-form .ipt, .query-form select
{
    border: 1px solid #e7eaeb;
}
.query-form .ipt
{
    width: 100px;
    height: 24px;
    padding: 2px 9px;
}
.query-form .lab, .query-form .to
{
    height: 30px;
    line-height: 30px;
    overflow: hidden;
}
.query-form .query-date
{
    position: relative;
}
.query-form .query-date .ipt
{
    margin-right: 0;
    margin-bottom: 0;
}

.query-form select
{
    width: 100px;
    height: 30px;
    padding-left: 5px;
}
.query-form .btn-query
{
    width: 60px;
    height: 30px;
    margin-right: 5px;
    border-radius: 3px;
    color: #fff;
    background-color: #fba026;
}
.query-form .btn-query2
{
    width: 60px;
    height: 30px;
    line-height: 30px;
    margin: auto 5px auto 0px;
    border-radius: 3px;
    color: #fff;
    background-color: #fba026;
}
.query-form .time-range
{
    float: left;
}
.query-form .time-range li
{
    float: left;
    width: 88px;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
    border: 1px solid #e7eaeb;
    text-align: center;
    color: #999;
    cursor: pointer;
}
.query-form .time-range .selected
{
    color: #fff;
    border-color: #fba026;
    background-color: #fba026;
}

.query-tablebox{
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    position: fixed;
    top:65px;
    left:0px;
    width: 100%;;
    display: inline-block;
    z-index: 2;
}
.query-table
{
    width: 100%;
    max-width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: center;
    display: table;
    table-layout: fixed;
 
     font-size: 12px;
     line-height: 30px;;

}


.query-table th, .query-table td {
    height: 30px;
    line-height: 30px;
    padding: 0px 0px !important;
      margin: 0px 0px !important;
    text-align: center;
    border: 1px solid #ddd;
}
.query-table tr th:first-child, .query-table tr td:first-child{
    width: 55px;;
}
.query-table th {
    background-color: #f2f2f2;
}
.query-table td.num{
    color: #ccc;
}
.query-table td{
    position: relative;
}
.query-table td .ball
{
    
    position: absolute;
    z-index: 100;
    left: calc(50% -16px);
    top:0px;
    color: #FFF;
    font-size: 12px;
    color: #fff;
    background: -webkit-linear-gradient(#5250ae,#702dfe);
    background: -moz-linear-gradient(#262732,#702dfe);
    background: -o-linear-gradient(#5250ae,#702dfe);
    background: linear-gradient(#5250ae,#702dfe);

    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    display: inline-block;
    margin: 0 auto;
    position:relative ;
}
.query-table td  .times{

    position: absolute;
    top:0px;
    right:0px;
    background-color: #1d830d;
    color: #fff;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    z-index: 101;
    font-size:20upx;
;
}

.color1 td,.color1 view{
    color:#872db1;
}
.color2 td,.color2 view{
    color:#4b87d0;
}
.color3 td,.color3 view{
    color:#409940;
}
.color0 td,.color0 view{
    color:#ed6e08;
}
.numbg0,.numbg5{
    background-color: #7b9ce3;
    color:#fff;
}
.numbg1{
    background-color: #3fc7b5;
    color:#fff;
}
.numbg2{
    background-color: #98b658;
    color:#fff;
}
.numbg3{
    background-color: #cc9f33;
    color:#fff;
}
.numbg4{
    background-color: #179d69;
    color:#fff;
}
.noborder{

    border-right: 0px !important;
    border-left: 0px !important;
}
.f12{
    font-size: 12px;
    line-height: 14px !important;

}
  .gamenav{
      position: fixed;
    top:65px;
      left: 0px;
      width: calc(100% - 10px);
      z-index:5;
      background-color: rgba(0,0,0,0.8);
      line-height: 35px;
      padding: 5px 5px;
      transform: translate(0,-100vh);
      transition: .5s;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
  }
  .gamenav.active{
      transform: translate(0,0);
  }
  
  .gamenav > view{
      display: table;
      table-layout: fixed;
      color: #fff;
      width: 100%;
      margin: 5px auto;
  }
  
  .gamenav > view > view{
      display: table-cell;
      text-align: left;
  }
  .gamenav > view > view:first-child{
      width: 60px;
      text-align: right;
      padding-right: 5px;
      font-size: 14px;
  }
  .gamenav > view > view:last-child {
      line-height: 30px;
  }
  .gamenav > view > view:last-child > view{
      display:inline-block ;
  
      margin: 0px 5px;
      background: #ffffff;
      font-size: 12px;
      color: #000;
      height: 20px;
      line-height: 20px;
      width: 80px;
      text-align: center;
      border-radius: 10px;
  
  }
  .gamenav > view > view:last-child >view:hover,.gamenav > view > view:last-child >view.active{
      text-decoration: underline;
      color:#2319dc ;
  }

</style>

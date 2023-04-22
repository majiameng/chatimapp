<template>
	<view class="gameitem">
	<view><view class="issue">{{item.issueNo}}期</view><view class="time">{{item.predictedTime}}</view></view>	
    <view>
        <view :class="ballclass" >
            <block v-for="(m1,index1) in number" :key="index1"   >
                <view class="ball" v-if="gametype=='ssc' || gametype=='ffc' || gametype=='11x5'" >{{m1}}</view>
                <view :class="k3class(m1)" v-if="gametype=='k3'" ></view>
                <view :class="pk10class(m1)" v-if="gametype=='pk10'" >{{m1}}</view>
            </block>      
             <view :class="SXclass" v-if="gametype=='ssc' || gametype=='ffc'" >组选{{SX}}</view>
        </view> 
    </view>
	</view>
</template>

<script>
	export default {
        props: {
            item: {
                required: true
            },
            num:{
                type: Number,
                default: 1
            },
            isloading:{
              type: Number,
              default: 0  
            }
           
        },
        
		data() {
			return {
			     number:'',
                  gametype:"",
                    SX:"24",
                    SXclass:"zx"
                   
			}
		},
        computed:{
            ballclass(){
               if(this.item.isloading==1) {
                   return "balls code_loading";
               } 
               else return 'balls';
                
            }
        },
		methods: {
            k3class(num){
              
              return 'k3 num_'+num;  
            },
            pk10class(num){
              
              return 'pk10 num_'+num;  
            },
			showdata(){
                  var ball='';
                       this.gametype=this.item['gametype'];
                       this.number=this.item['openCode'].split(',');
                      if(this.gametype=='ffc' || this.gametype=='ssc') this.setsxnum();
                 
            },
            setsxnum(){
                var number=this.number.toString().split(',');
              
                var arr1=[];
                for(var i=1;i<number.length;i++){
                   var isin=0;
                    if(i==1) arr1.push(number[i]);
                    else{
                        for(var j=0;j<arr1.length;j++){
                            if(arr1[j]==number[i]){
                               isin=1;
                               break;
                            }
                        }
                        if(isin==0) arr1.push(number[i]);
                    }
                }
              
              
          
                var len=arr1.length;
               
                if(len==4) this.SX='24';
                    else if(len==3) this.SX=12;
                    else if(len==2) {
                        this.SX=6;
                        for(var j=0;j<arr1.length;j++){
                            var times=0;
                           for(var i=1;i<number.length;i++){
                              if(arr1[j]==number[i]){
                                  times++;
                                  if(times==3){
                                      this.SX=4;
                                  break;
                                  }
                              }
                           }
                        }
                       
                    }
           if(this.SX>0){
                         this.SXclass="zx zx"+this.SX;
                     }
            }
		},
        created() {
            this.showdata(); 
        },
	}
</script>

<style>
.gameitem{
	    padding: 5px 15px;
	    border-bottom:1px dashed #5250ae;
	    background-color: #fff;
	    font-size: 14px;
	    clear: both;
         display: inline-block;
         width: calc(100% - 30px);
         
	
	}
	
	 .gameitem >view{
         width: 100%;
	    clear: both;
	}
	 .gameitem >view:first-child{
	    height: 25px;
	    line-height: 25px;
	}
	 .gameitem .issue{
         display: inline-block;
	    font-size: 16px;
	    color: #333;
	    float: left;
	}
	
	 .gameitem .time{
          display: inline-block;
	    font-size: 12px;
	    color: #ccc;
	    float: right;
	}
	.gameitem >view:nth-child(2){
	    height: 40px;
	    line-height: 40px;
	
	}
    .gameitem .balls view{
        display: inline-block;
    }
      .gameitem .balls .zx{
          float: right;
      }
	 .gameitem .ball{
	    display: inline-block;
	    width: 28px;
	    height: 28px;
	    text-align: center;
	    line-height: 28px;
	    border-radius: 50%;
	    background: -webkit-linear-gradient(#5250ae,#702dfe);
	    background: -moz-linear-gradient(#262732,#702dfe);
	    background: -o-linear-gradient(#5250ae,#702dfe);
	    background: linear-gradient(#5250ae,#702dfe);
	    margin-left: 20px;
	    vertical-align: middle;
	    color: #fff;
	    font-size: 16px;
	
	}
.zx24{
    color: #872db1;
}
.zx12{
    color: #4b87d0;
}
.zx6{
    color: #409940;
}
.zx4{
    color: #ed6e08;
}
.k3{
    display: inline-block;
    height: 30px;
    width: 30px;
    margin: 0px 5px;
    background-size: 100% 100%;
    vertical-align:middle ;
}
.balls .k3:first-child{
 margin-left: 180upx;   
}
.k3.num_1{
    background-image: url("../static/img/num-1.png");
}
.k3.num_2{
    background-image: url("../static/img/num-2.png");
}
.k3.num_3{
    background-image: url("../static/img/num-3.png");
}
.k3.num_4{
    background-image: url("../static/img/num-4.png");
}
.k3.num_5{
    background-image: url("../static/img/num-5.png");
}
.k3.num_6{
    background-image: url("../static/img/num-6.png");
}

.pk10{
    display: inline-block;
    height: 25px;
    width: 25px;
    line-height: 25px;
    margin: 0px 4px;
    border-radius: 5px;
    text-align: center;
    color: #fff;
}

.pk10.num_01{
    background-color: #e7df00;
}
.pk10.num_02{
    background-color: #0093dd;
}
.pk10.num_03{
    background-color: #4a4a4a;
}
.pk10.num_04{
    background-color: #ff7600;
}
.pk10.num_05{
    background-color: #16e3e5;
}
.pk10.num_06{
    background-color: #5234ff;
}
.pk10.num_07{
    background-color: #ff0066;
}
.pk10.num_08{
    background-color: #ff2600;
}
.pk10.num_09{
    background-color: #780a00;
}
.pk10{
    background-color: #06bf00;
}

@keyframes issueBoxH {
    0% {
        transform: translateY(-39px); }
    25% {
        transform: translateY(20px); }
    50% {
        transform: translateY(-9px); }
    75% {
        transform: translateY(5px); }
    100% {
        transform: translateY(0); } }

@-webkit-keyframes issueBoxH {
    0% {
        transform: translateY(-39px); }
    25% {
        transform: translateY(20px); }
    50% {
        transform: translateY(-9px); }
    75% {
        transform: translateY(5px); }
    100% {
        transform: translateY(0); } }


.lotterylist .code_loading view:nth-child(1) {
    animation: issueBoxH 0.6s forwards; }
.lotterylist .code_loading view:nth-child(2) {
    animation: issueBoxH 0.8s forwards; }
.lotterylist .code_loading view:nth-child(3) {
    animation: issueBoxH 1.0s forwards; }
.lotterylist .code_loading view:nth-child(4) {
    animation: issueBoxH 1.2s forwards; }
.lotterylist .code_loading view:nth-child(5) {
    animation: issueBoxH 1.4s forwards; }
.lotterylist .code_loading view:nth-child(6) {
    animation: issueBoxH 1.6s forwards; }
.lotterylist .code_loading view:nth-child(7) {
    animation: issueBoxH 1.8s forwards; }
.lotterylist .code_loading view:nth-child(8) {
    animation: issueBoxH 2s forwards; }
.lotterylist .code_loading view:nth-child(9) {
    animation: issueBoxH 2.1s forwards; }
.lotterylist .code_loading view:nth-child(9) {
    animation: issueBoxH 2.2s forwards; }
.lotterylist .code_loading view:nth-child(10) {
    animation: issueBoxH 2.3s forwards; }
.lotterylist .code_loading view:nth-child(11) {
    animation: issueBoxH 2.4s forwards; }
.lotterylist .code_loading view:nth-child(12) {
    animation: issueBoxH 2.5s forwards; }
.lotterylist .code_loading view:nth-child(13) {
    animation: issueBoxH 2.6s forwards; }
.lotterylist .code_loading view:nth-child(14) {
    animation: issueBoxH 2.7s forwards; }
.lotterylist .code_loading view:nth-child(15) {
    animation: issueBoxH 2.8s forwards; }
.lotterylist .code_loading view:nth-child(16) {
    animation: issueBoxH 2.9s forwards; }
.lotterylist .code_loading view:nth-child(17) {
    animation: issueBoxH 3s forwards; }
.lotterylist .code_loading view:nth-child(18) {
    animation: issueBoxH 3.1s forwards; }
.lotterylist .code_loading view:nth-child(19) {
    animation: issueBoxH 3.2s forwards; }
</style>

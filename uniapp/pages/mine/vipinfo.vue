<template>
	<view class="page">
		<image src="../../static/img/vipbg.png" :style="{'width':windowWidth,'height':windowWidth}"></image>
        <view class="duibBox">
            <p>VIP会员权益对比</p>
            <table class="duibtable">
                                   <thead>
                                   <tr>
                                       <th class="viphuibg02">权益描述</th>
                                       <th class="viphuibg">普通用户</th>
                                       <th class="vipbluebg">代理</th>
                                       <th class="orgbg">个人VIP</th>
                                       <th class="vipzisbg">团队VIP</th>
           
                                   </tr>
                                   </thead>
                                  <tbody>
                                                         
                                                         <tr>
                                                             <td>创建群组</td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                 
                                                         </tr>
                                                         
                                                         <tr>
                                                             <td>专属图标</td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                 
                                                         </tr>
                                                         <tr>
                                                             <td>发布计划</td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                 
                                                         </tr>
                                                         
                                 
                                                        
                                                         <tr>
                                                             <td>关键词屏蔽</td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                 
                                                         </tr>

                                                         <tr>
                                                             <td>赠送下级VIP</td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/wrong.png"></td>
                                                             <td><image src="../../static/img/right.png"></td>
                                 
                                                         </tr>
                                                           <tr>
                                                                                     <td>VIP使用人数</td>
                                                                                     <td>0</td>
                                                                                     <td>0</td>
                                                                                     <td class="vipred">1</td>
                                                                                     <td class="vipzis">{{system['vip1_max']}}</td>
                                                         
                                                                                 </tr>
                                                         
                                                                                 <tr>
                                                                                     <td>群组最大人数</td>
                                                                                     <td>{{system['people_sum0']}}</td>
                                                                                     <td>{{system['people_sum1']}}</td>
                                                                                     <td class="vipred">{{system['people_sum2']}}</td>
                                                                                     <td class="vipzis">{{system['people_sum3']}}</td>
                                                         
                                                                                 </tr>
                                                                                 <tr>
                                                                                     <td>创建群组数量</td>
                                                                                     <td>{{system['group_sum0']}}</td>
                                                                                     <td>{{system['group_sum1']}}</td>
                                                                                     <td class="vipred">{{system['group_sum2']}}</td>
                                                                                     <td class="vipzis">{{system['group_sum3']}}</td>
                                                         
                                                                                 </tr>
                                                                                 <tr>
                                                                                     <td>加入群组数量</td>
                                                                                     <td>{{system['group_join0']}}</td>
                                                                                     <td>{{system['group_join1']}}</td>
                                                                                     <td class="vipred">{{system['group_join2']}}</td>
                                                                                     <td class="vipzis">{{system['group_join3']}}</td>
                                                         
                                                                                 </tr>
                                                                                 <tr>
                                                                                     <td>好友最多人数</td>
                                                                                     <td>{{system['friend_num0']}}</td>
                                                                                     <td>{{system['friend_num1']}}</td>
                                                                                     <td class="vipred">{{system['friend_num2']}}</td>
                                                                                     <td class="vipzis">{{system['friend_num3']}}</td>
                                                         
                                                                                 </tr>
                                                         
                                                         
                                                         
                                                                                 <tr>
                                                                                     <td>价格</td>
                                                                                     <td class="vipblue"><strong>免费</strong></td>
                                                                                     <td class="vipblue"><strong>免费</strong></td>
                                                                                     <td class="vipred"><strong>{{system['vip_month']}}元/月</strong></td>
                                                                                     <td class="vipzis"><strong>{{system['vip1_month']}}元/月</strong></td>
                                                         
                                                                                 </tr>
                                                         
                                                         
                                                                                 <tr>
                                                                                     <td colspan="3"></td>
                                                         
                                                                                     <td class="vipred">
                                                                                         <button  class="btn1"  @tap="joinvip(0);">加入</button>
                                                                                        
                                                                                     </td>
                                                                                     <td class="vipzis">
                                                         <button  class="btn2"  @tap="joinvip(2);">加入</button>
                                                                                      
                                                                                     </td>
                                                         
                                                                                 </tr>

                                                      </tbody>
                                    </table>
                 <view style="height: 30px;line-height: 30px;text-align: center;font-size: 14px;color: #666;margin-bottom: 10px;margin-top: 10px;">注：VIP的最终解释权归本站所有</view>
        </view>
	</view> 
</template>

<script>
  var windowWidth=  uni.getSystemInfoSync().windowWidth
	export default {
		data() {
			return {
				windowWidth:windowWidth+'px',
                system:uni.getStorageSync('system'),
			};
		},
        methods:{
            joinvip(type){
                uni.redirectTo({
                    url:'joinvip?type='+type
                })
            }
        }
	}
</script>

<style lang="scss">
 .page{
     font-size: 14px;
 }
 .duibBox{
     margin-top: 20px;
     text-align: center;
     border-top: 1px solid #e5e5e5;
 }
 .duibBox > p{
     background-color: #FFF;
     margin-top: -15px;
     height: 30px;
     line-height: 30px;
     text-align: center;
     font-size: 16px;
     font-weight: 600;
   width: 140px;
   margin-left: calc(50% - 70px);
 }
 .duibtable{
     width: 100%;
     border-spacing: 0px;
     margin-top: 20px;
 }
  .duibtable th,  .duibtable td {
     width: 18%;
     line-height: 35px;
  
 }
  .duibtable th:first-child {
     color: #666;
     width: 26%;
 }
  .duibtable th {
     color: #fff;
     text-align: center;
     font-size: 14px;
 }
  .duibtable td {
     text-align: center;
        border-right: 1px solid #e5e5e5;
     border-bottom: 1px solid #e5e5e5;
 }
   .duibtable  image{
       height: 14px;
       width: 14px;
       vertical-align: middle;
   }
 .vipgreen {
     color: #2f9945
 }
 .viporg {
     color: #ff8728
 }
 .viphui {
     color: #999
 }
 .vipblue {
     color: #64c8ca
 }
 .vipblue01 {
     color: #3984e5
 }
 .qqqun01 {
     color: #F00;
     margin: 0 10px;
 }
 .qqqun02 {
     margin: 0 10px;
 }
 .vipred {
     color: #ff8728
 }
 .vipzis {
     color: #c562e6
 }
 .viphuibg01 {
     background: #f9f9f9;
 }
 .viphuibg02 {
     background: #eee;
 }
 .vipzisbg {
     background: #c562e6;
 }
 .orgbg {
     background: #ff8728;
 }
 .viphuibg {
     background: #b4b4c0;
 }
 .vipbluebg {
     background: #64c8ca;
 }
 .vipredbg {
     background: #f4614f;
 }
 .vipblack {
     color: #606266;
     font-size: 15px
 }
 .viphui {
     color: #999;
 }
 .vipMainBox, .vipMainBox .vipContent .tabbtnBox {
     width: 1200px;
     margin: 20px auto;
     background: #fff;
 }
 .vipMainBox {
     box-shadow: 0 1px 3px rgba(27,95,160,.1);
 }
 
 .btn1{
     display: inline-block;
     cursor: pointer;
     height: 30px;
     line-height: 30px;
     padding: 0 10px;
     text-align: center;
 

     background-color: #ff8728;
     color: #fff !important;
     font-size: 12px;
     border: 0px;
     border-radius:  5px;
     vertical-align: middle;
 }
 .btn2{
     display: inline-block;
     cursor: pointer;
     height: 30px;
     line-height: 30px;
     padding: 0 10px;
     text-align: center;
 
     margin: 0px 5px;
     background-color: #c562e6;
     color: #fff !important;
     font-size: 14px;
     border: 0px;
     border-radius: 5px;
     vertical-align: middle;
 }
</style>

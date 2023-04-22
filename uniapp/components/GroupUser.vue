<template>
	<view v-if="show" class="page" style="position: fixed;z-index: 1000;top:0px;height: 100vh;width: 100vw;padding-top: 100upx;overflow-y: scroll;">
	      <view class="header">
              <view class="showtitle" v-if="!showsearch">
                        <view class="title">
                               <uni-icons type='arrowleft' @tap="close()" color="#ffffff"></uni-icons>
            
                            选择要提醒的人
                            </view> 
                  <view class="search-icon" @tap="showsearch=1">
                         <uni-icons type="search" color="#ffffff" size="28" style="vertical-align: middle;"/>
                     
                  </view>
              </view>
       <view class="inputbar" v-else>
       	<input placeholder="搜索" class="searchbox" v-model="name" @input="search( $event.detail.value);" />
       	<view class="btn" @tap="showsearch=0;members=members1">取消</view>
       </view>
          </view>
	
		<v-contracts :items="members" @click="paramClick" @avatar="paramClick" v-if="members.length" />

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import api from '../library/index.js'

  import uniIcons from './uni-icons/uni-icons.vue'
    export default {
        components: {
        	
            uniIcons
        },
            props: {
            	
            	groupid: {
            		type: [Number,String],
            		default: 0
            	},
                show: {
            		type: Number,
            		default: 0
            	},
                },
		data() {
			return {
				initializing: true,
			members:[],
            members1:[],
               showsearch:0 
			}
		},
		computed: {

		},
		methods: {
            getGroupUsers() {
            	api.getGroupUsers({
            		group_id: this.groupid,
                    userid: this.$store.state.userinfo.id,
            	}).then(res => {
                    uni.setStorageSync(this.groupid+'_group_members',res.data);
            	this.members1=this.members=res.data
            	this.initializing = false
            	})
            },
			paramClick(e) {
				let page, params;
	
					const {
						id,
						nickname,
						avatar
					} = e;
					params = {
						id,
						nickname,
						avatar
					};
				this.$emit('atuser',params); 
			
			},
            search(value){
            if(value.length>0){
             var arr=[];
             this.members1.forEach(item=>{
                 if(item.nickname.indexOf(value)>-1) arr.push(item);
                 
             })
             this.members=arr;   
            }else{
                this.members=this.members1
            }
               
                
            },
            close(){
              this.$emit('atuser');  
            },
		},
	   
		mounted() {
             this.members1= this.members= uni.getStorageSync(this.groupid+'_group_members');
			this.getGroupUsers();
            uni.hideKeyboard();
		},
        onShow() {
           uni.hideKeyboard();  
        }
	}

	function complement(a, b) {
		return a.filter(function(v) {
				return !(b.indexOf(v) > -1)
			})
			.concat(b.filter(function(v) {
				return !(a.indexOf(v) > -1)
			}))
	}
</script>

<style lang="scss">
	.inputbar {
		display: flex;
		align-items: center;
		height: 45px;
	background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
	background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
		box-sizing: border-box;
		padding: $uni-spacing-col-base $uni-spacing-row-base;

		input {
			background-color: #eee;
			border-radius: $uni-border-radius-base;
			height: 100%;
			padding: 0 $uni-spacing-row-base;
			flex: 1;

			&.disabled {
			background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
			background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
			background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
			background: linear-gradient(to right, #01d9ff , #01a9fe);
				border: 1upx solid #eee;
			}
		}
.searchbox{
    background-color: #fff;
}
		.btn {
			padding-top: 0;
			padding-bottom: 0;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-left: $uni-spacing-row-base;
 background: -webkit-linear-gradient(left top, #3388ff , #2319dc);
      background: -o-linear-gradient(bottom right, #3388ff, #2319dc);
      background: -moz-linear-gradient(bottom right, #3388ff, #2319dc);
      background: linear-gradient(to bottom right, #3388ff , #2319dc);
      color: #FFF;
			&:not(.btn-primary) {
				background-color: #eee;
			}
		}
	}
    .header{
        position: fixed;
        top:0px;
        width: 100vw;
        line-height: 45px;
        height: 45px;
        border-bottom: 1px #eee solid;
        color: #fff;z-index: 10000;
        background: -webkit-linear-gradient(left top, #01d9ff , #01a9fe);
        background: -o-linear-gradient(bottom right, #01d9ff, #01a9fe);
        background: -moz-linear-gradient(bottom right, #01d9ff, #01a9fe);
        background: linear-gradient(to right, #01d9ff , #01a9fe);
    }
     .header .title{
         font-size: 32upx;
         padding-left: 20upx;
         font-weight: 600;
         display: inline-block;
     }
     .header .search-icon{
          display: inline-block;
         float: right;
         justify-content: right;
         padding-right: 26upx;
         width: 80upx;
         text-align: right;
     }
      .header .search-icon image{
          height:40upx;width: 40upx;
          vertical-align: middle;
      }
</style>

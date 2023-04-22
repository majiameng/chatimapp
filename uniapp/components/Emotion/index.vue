<template>
	<view>
		<view class="emotion-box" :style="{height: height + 'px'}">
			<view class="emotion-box-line" v-for="(line, i) in lists" :key="i">
				<view class="emotion-item" v-for="(item, index) in line" :key="index" @click="clickHandler(item)">
            <image :src="'/static/emoji/'+item.name+'.gif'" style="width: 50rpx;height: 50rpx;"></image>				  
			
           
				</view> 
                
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		props: {
			height: {
				type: Number,
				default: 200
			}
		},
		data() {
			return {
				list: [
					// [{'name':'微笑'}, {'name':撇嘴'}, {'色'}, {'发呆'}, {'得意'}, {'流泪'}, {'害羞'}, {'闭嘴'}],
					['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴'],
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
					['磕头', '回头', '跳绳', '挥手', '激动', '街舞', '左太极', '右太极'],
				],
				reg: /\S{1,3}/gi,
                lists:[],
                listss:[]
				// item: []
			}
		},
		mounted() {
		    
            // function get_img('[weixiao]')
            // 
            // list[0]. 
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
            
         //   console.log(this.lists);
		  
		},

		methods: {
			
			clickHandler(i) {
              //  console.log(i)
				// let emotion = `#${i};`
             console.log(i.value)
				let emotion = `${i}`
				this.$emit('emotion', i.value)
			},
			emotion(res) {
				//let word = res.replace(/\#|\;/gi,'')
				const list =['微笑','撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
				let index = list.indexOf(res)
                
                var index1=index+100;
                
                
				return index1
			}
		}
	}
</script>

<style scoped>
	.emotion-box {
		margin: 0 auto;
		width: 98%;
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

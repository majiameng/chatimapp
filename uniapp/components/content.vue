<template>
	<view>
		
	</view>
</template>

<script>
	export default {
        props: {
        	posts: {
        		type: [Number, String,Object],
        		require: true
        	},
            manager: {
            	type: [Number, String],
            	default: 0
            },
        	sending: {
        		type: Boolean,
        		default: false
        	},
            no_add: {
            	type: Boolean,
            	default: false
            },
                     
        },
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>

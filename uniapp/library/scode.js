import api from './index.js'
export default {
	getScode(data){
		try{
			let res = JSON.parse(data.result)
            //用户
			if(res.action == 'user'){
               let params = `?id=${res.id}&from=qrcode`;
                uni.navigateTo({
                	url:'../friend/detail'+params
                })
            
			}
            //群组
            else if(res.action == "group"){
				api.joinGroup({group_id:res.id,userid:uni.getStorageSync('access_token')}).then(()=>{
					if(res.data==true){
                   let params = `?id=${res.id}`
                   uni.navigateTo({
                   	url:'../group/chat'+params
                   })     
                    }
                   else{
                       uni.showToast({
                       	icon:'none',
                       	title:res.message
                       })
                   }
				}).catch((e)=>{
					if(!e.message){
						let params = `?id=${res.id}`
						uni.navigateTo({
							url:'../group/chat'+params
						})
					}
				})
			}
            else if(res.action=='login' && res.from=='cj666'){
             
              uni.navigateTo({
                  url:"/pages/login/qrcode?agent="+res.agent
              })
            }
		}catch(e){
            
            var reg= /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
            //  console.log(str);
             
              var s = data.result.match(reg);
              if(s!=null){
               
                  
                  if(data.result.indexOf('detail?from=qrcode&id=')>-1){
                      var arr=data.result.split('#');
                     
                      uni.navigateTo({
                          url:arr[1]
                      })
                    
                  }
                  else if(data.result.indexOf('from=invite&invite_code=')>-1){
                      var arr=data.result.split('=');
                     
                      uni.navigateTo({
                          url:"/pages/login/index?invite_code="+arr[arr.length-1]
                      })
                    
                  }
                  else{
                      let params = `?url=`+data.result;
                       uni.navigateTo({
                       	url:'../web/index'+params
                       })
                  }
                  
                  
              
              
                 
              }else{
                uni.showToast({
                	icon:'none',
                	title:data.result
                })
              }
              
		
		}
		
	}
}
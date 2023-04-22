import http from './http.js'
class Ht{
    
    update(data){
    	return http.setWait(false).post('index.php?act=update',data)
    }
	//注册
	register(data){
		return http.setWait(false).post('user.php?act=reg',data)
	}
	//登录
	login(data){
		return http.setWait(false).post('user.php?act=userlogin',data)
	}
	// 搜索好友
	searchFriend(data){
		return http.get('user.php?act=searchUser',data)
	}
    
    setmark(data){
        return http.post('user.php?act=setmark',data)
        
    }
	
	//添加好友
	applyAddFriend(data){
		return http.setWait(false).post('user.php?act=applyAddFriend',data)
	}
	//处理好友请求
	handleFriendApply(data){
		return http.setWait(false).post('user.php?act=handleFriendApply',data)
	}
	//获取新朋友
	getFriendApply(data){
		return http.setWait(false).post('user.php?act=getFriendApply',data)
	}
	//获取新朋友数量
	getFriendApplyCount(data){
		return http.setWait(false).post('user.php?act=getFriendApplyCount',data)
	}
	
	//获取用户信息
	getUserInfo(data){
		return http.setWait(false).post('user.php?act=getUserInfo',data)
	}
	// 重置登录密码
	resetPas(data){
		return http.setWait(false).post('user.php?act=resetPassword',data)
	}
	changePass(data){
		return http.setWait(false).post('user.php?act=changePass',data)
	}
	// 获取我的好友
	getMyFriend(data){
		return http.setWait(false).get('user.php?act=getMyFriend',data)
	}
	// 获取我的好友
	createGroup(data){
        
		return http.setWait(false).post('group.php?act=createGroup',data)
	}
	// 获取加入的群
	getMyGroup(data){
		return http.setWait(false).get('group.php?act=getMyGroup',data)
	}
	// 加入群聊
	joinGroup(data){
		return http.get('group.php?act=joinGroup',data)
	}
	// 发送红包
	sendPacket(data){
		return http.setWait(false).post('api/v1.redpack/create',data)
	}
	// 编辑用户信息
	changeProfile(data){
		return http.setWait(false).post('user.php?act=changeProfile',data)
	}
	
	//获取二维码链接
	getMyQrcodeCard(data){
		return http.get('index.php?act=getMyQrcodeCard',data)
	}
	
	//获取群成员
	getGroupUsers(data){
		return http.setWait(false).post('group.php?act=getGroupUsers',data)
	}
    setGroupNickname(data){
    	return http.setWait(false).post('group.php?act=setGroupNickname',data)
    }
	//获取群信息
	getGroupInfo(data){
		return http.setWait(false).post('group.php?act=getGroupInfo',data)
	}
	//获取群二维码
	getQrcodeCard(data){
		return http.setWait(false).post('group.php?act=getQrcodeCard',data)
	}
	//修改群名
	changeGroupName(data){
		return http.setWait(false).post('group.php?act=changeGroupName',data)
	}
	//群移除用户
	removeUserForGroup(data){
		return http.setWait(false).post('group.php?act=removeUserForGroup',data)
	}
	//群邀请用户
	inviteIntoGroup(data){
		return http.setWait(false).post('group.php?act=inviteIntoGroup',data)
	}
	//获取验证码
	sendCode(data){
		return http.setWait(false).post('user.php?act=sendCode',data)
	}
	
	
	//删除好友
	deleteFriend(data){
		return http.setWait(false).post('user.php?act=deleteFriend',data)
	}
	//删除群
	removeGroup(data){
		return http.setWait(false).post('group.php?act=removeGroup',data)
	}
	//退出群
	quitGroup(data){
		return http.setWait(false).post('group.php?act=quitGroup',data)
	}
	//全体成员是否禁言
	changeSpeak(data){
		return http.setWait(false).post('group.php?act=changeSpeak',data)
	}
	
	//获取群红包记录
	getPayWays(data){
		return http.setWait(false).post('user.php?act=chargeways',data)
	}
    
    sendCircle(data){
    	return http.setWait(false).post('circle.php?act=send',data)
    }
    getCircleList(data){
        return http.setWait(false).post('circle.php?act=list',data)
        
    }
    getMyCircle(data){
        return http.setWait(false).post('circle.php?act=mycircle',data)
        
    }
    setCircleLike(data){
        return http.setWait(false).post('circle.php?act=like',data)
        
    }
    setCircleComment(data){
        return http.setWait(false).post('circle.php?act=comment',data)
     
    }
    getCircleMsg(data){
        return http.setWait(false).post('circle.php?act=msg',data)
     
    }
    getCircleImg(data){
        return http.setWait(false).post('user.php?act=circleImg',data)
     
    }
    CircleDelete(data){
        
         return http.setWait(false).post('circle.php?act=delete',data)
    }
    CommentDelete(data){
        return http.setWait(false).post('circle.php?act=delete_comment',data)
    }
    
}
export default new Ht()
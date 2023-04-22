<template>
    <view class="page">
        <ul class="profile">
            <li>名称：</li>
            <li><input type="text" class="input1" id="name" v-model="title" placeholder="请输入聊天室名称" /></li>
        </ul>

        <ul class="profile">
            <li>介绍：</li>
            <li><textarea id="content" placeholder="请输入聊天室介绍" v-model="content"></textarea></li>
        </ul>
        <ul class="profile">
            <li>Logo：</li>
            <li>
                <image :src="avatarsrc" class="avatar" :style="{ width: imgshow ? '60px' : '1px' }"></image>
                <view class="add_btn" @tap="uploadImage">
                    <uni-icons class="icons1" type="upload"></uni-icons>
                    浏览
                </view>
            </li>
        </ul>
        <ul class="profile">
            <li>加群验证：</li>
            <li>
                <radio :checked="no_invite === 1" @click="no_invite = 1">需要验证</radio>
                <radio style="margin-left: 30px;" :checked="no_invite === 0" @click="no_invite = 0">无需验证</radio>
            </li>
        </ul>

        <ul class="profile">
            <li style="vertical-align: middle">标签：</li>
            <li style="vertical-align: middle;line-height: 30px;">
                <div class="tags_show" style="vertical-align: middle;margin-right: 5px;">{{ tags_select }}</div>
                <div style="vertical-align: middle" class="add_btn" @tap="tags_show = true">
                    <uni-icons class="icons1" type="plus"></uni-icons>
                    选择标签
                </div>
            </li>
        </ul>

        <view style="width: 80%;margin: 15px auto;display: block"><button class="button1" @tap="click_sub()" >确认并提交</button></view>

        <view class="tags" v-if="tags_show">
            <view class="content">
                <div class="title">选择标签（最多{{ system['tags_sum'] }}个）</div>
                <block v-for="(item, index) in tags" :key="index">
                    <span @tap="click_tags(index)" :class="{ active: tags_select.indexOf(item) > -1 }">{{ item }}</span>
                </block>
            </view>
            <image class="close_tags" @tap="tags_show = false" src="/static/close1.png"></image>
        </view>
    </view>
</template>

<script>
import http from '../../library/http.js';
import uniIcons from '../../components/uni-icons/uni-icons.vue';
import helper from '../../library/helper.js';
import config from '../../config.js';
export default {
    components: {
        uniIcons
    },
    data() {
        return {
            no_invite: 1,
            avatarsrc: false,
            avatar: '',
            imgshow: false,
            isuploading: false,
            system: uni.getStorageSync('system'),
            tags: '',
            tags_sum: 3,
            tags_show: false,
            tags_select: '',
            title: '',
            content: '',
            userid: 0,
            userlist:""
        };
    },
    computed: {},
    methods: {
        uploadImage() {
            uni.chooseImage({
                count: 1,
                success: chooseImageRes => {
                    for (var i = 0; i < chooseImageRes.tempFilePaths.length; i++) {
                        var tempFilePaths = chooseImageRes.tempFilePaths[i];

                        this.avatarsrc = tempFilePaths;

                        this.isuploading = true;
                        this.imgshow = true;
                        helper.uploadFiles([tempFilePaths], 'images', { type: 'avatar' }).then(res => {
                            // this.group.avatar=res;
                            //  this.avatarsrc=res;
                            this.avatar = res.replace(config.imgUri, '');
                            this.isuploading = false;
                        });
                    }
                }
            });
        },
        click_tags(num) {
            var item = this.tags[num];
            if (this.tags_select.indexOf(item) > -1) {
                var arr = this.tags_select.split(',');
                var select = '';
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != item) {
                        if (select != '') select += ',';
                        select += arr[i];
                    }
                }
                this.tags_select = select;
            } else {
                var arr = this.tags_select.split(',');
                if (arr.length >= this.tags_sum) {
                    uni.showToast({
                        title: '最多可以选择' + this.tags_sum + '个标签',
                        icon: 'none'
                    });
                } else {
                    if (this.tags_select != '') this.tags_select += ',';
                    this.tags_select += item;
                }
            }
        },
        click_sub() {
            if (this.title == '') {
                uni.showToast({
                    title: '请输入群组名称',
                    icon: 'none'
                });
                return false;
            }

            if (this.content == '') {
                uni.showToast({
                    title: '请输入群组介绍',
                    icon: 'none'
                });
                return false;
            }
            // if(this.imgshow==false){
            //    uni.showToast({
            //        title:'请上传群头像',
            //        icon:'none'
            //    })
            //    return false;
            // }
            if (this.tags_select == '') {
                uni.showToast({
                    title: '请设置群标签',
                    icon: 'none'
                });
                return false;
            }
            if (this.isuploading == true) {
                uni.showToast({
                    title: '头像正在上传中，请稍后提交',
                    icon: 'none'
                });
                return false;
            }
            var postdata = {
                id: uni.getStorageSync('access_token'),
                name: this.title,
                content: this.content,
                avatar: this.avatar,
                tags: this.tags_select,
                no_invite: this.no_invite,
                userlist:this.userlist
            };
           
            http.setWait(true).post('group.php?act=createGroup', postdata)
                .then(res => {
                    if (res.code == 200) {
                        var data = res.data;
                        uni.setStorageSync(uni.getStorageSync('access_token') + '_groups', res.groups);
                        uni.showToast({
                            title: '创建成功',
                            icon: 'none'
                        });

                        uni.redirectTo({
                            url: 'chat?id=' + data.id + '&nickname=' + data.nickname
                        });
                    } else {
                        uni.showToast({
                            title: '网络错误，请稍后再试',
                            icon: 'none'
                        });
                    }
                });
        }
    },

    onShow() {},
    onLoad(opts) {
        if (uni.getStorageSync('access_token') > 0) {
            this.tags = this.system.tags.split('|');
            this.tags_sum = parseInt(this.system.tags_sum);
            this.userid = uni.getStorageSync('access_token');
             if(opts.userlist)  this.userlist=opts.userlist;
        } else {
            uni.setStorageSync('gourl', '/pages/group/create');
            this.$jump('login.index');
        }
    }
};
</script>

<style lang="scss">
@import '@/static/css/group.css';
.profile {
    min-height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    margin-bottom: 10px;
    width: 100%;
    padding: 5px 0px;
}
.detail > div:last-child .info > ul > li:last-child {
    padding-left: 0px;
}
.btn2 {
    height: 25px;
    line-height: 25px;
    vertical-align: middle;
    border-radius: 5px;
    text-align: center;
    border: 0px;
    background-color: #ddd;
    color: #666;
    padding: 0px 10px;
}
.profile li:first-child {
    color: #999;
}
.page {
    background-color: #fafafa;
    font-size: 14px;
}
</style>

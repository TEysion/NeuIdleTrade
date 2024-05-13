<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { showToast } from 'vant';
import { showSuccessToast, showFailToast } from 'vant';

const store = useUserStore()

defineProps<{
    msg: string
}>()

const searchtext = ref('')
// const user: any = ref()

const user:any = computed(() => {
    // alert(0)
    return store.getUser();
})

const commentcontent = ref('')
const comments: any = ref([])
const showPopover = ref(true)
function Searchresult() {

}

function showSellerinfo() {

}
const avatar = ref()
const router = useRouter()
const editform = ref({ nickname: "", fullname: "", age: "", institude: "", gender: "", phone: "", qq: "", wechat: "", mysign: "" })
const editform2 = ref({ new_pwd: "" })


onMounted(() => {

})



function changeHead() {

    (document.querySelector("#upload") as any).click();
}


function EditProfile() {

}


function logoff() {
    localStorage.removeItem("idletrade_uid");
    store.logout();
    router.replace("/login")
}


function addImg() {

    var reader = new FileReader();
    var f = (document.querySelector("#upload") as any).files[0];
    var param = new FormData();
    param.append('file', f, f.name);
    param.append('id', store.getUserID() as any);


    axios.post("api/user/uploadAvatar", param, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((successResponse: any) => {

        })
        .catch((failResponse: any) => {

        });
}

function change_input(val1: any, val2: any) {

}

const editpng = '/public/price.png'

function showDrawer(var1: any) {

}

function showEdit() {
    editform.value.nickname = user.value.user_nickname as any
    editform.value.fullname = user.value.user_fullname as any
    editform.value.age = user.value.user_age as any
    editform.value.institude = user.value.user_institute as any
    editform.value.gender = user.value.user_gender as any
    editform.value.phone = user.value.user_phone as any
    editform.value.qq = user.value.user_qq as any
    editform.value.wechat = user.value.user_wechat as any
    editform.value.mysign = user.value.user_mysign as any
    show.value = true
}

function showEditPwd() {
    showEP.value = true
}



function updateUserProfile() {

    axios.post("api/user/editProfile", {
        nick: editform.value.nickname,
        truename: editform.value.fullname,
        age: editform.value.age,
        institute: editform.value.institude,
        phone: editform.value.phone,
        qq: editform.value.qq,
        wechat: editform.value.wechat,
        id: store.getUserID(),
        gender: editform.value.gender,
        selfsign: editform.value.mysign
    })
        .then((successResponse: any) => {

            show.value = false;
            store.update();

            // user.value = successResponse.data[0];
        })
        .catch((failResponse: any) => {

        });

}


function updateUserrPwd() {
    axios.post("api/user/modifyPsd", {
        id: store.getUserID(),
        newpsd: editform2.value.new_pwd
    })
        .then((successResponse: any) => {
            showSuccessToast('修改成功！');
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });
}

const showEP = ref(false);
const show = ref(false);
const showAbout = ref(false);

const active = ref(3)
</script>


<template>



    <van-action-sheet v-model:show="show" title="编辑信息">
        <van-cell-group inset>
            <!-- 输入任意文本 -->
            <van-field v-model="editform.nickname" label="昵称" />
            <van-field v-model="editform.fullname" label="姓名" />
            <van-field v-model="editform.gender" label="性别" />
            <van-field v-model="editform.mysign" label="个性签名" />
            <van-field v-model="editform.institude" label="学院" />
            <van-field v-model="editform.age" label="年龄" />
            <van-field v-model="editform.qq" label="QQ" />
            <van-field v-model="editform.wechat" label="微信" />
            <!-- 输入手机号，调起手机号键盘 -->
            <van-field v-model="editform.phone" type="tel" label="手机" />
            <!-- 允许输入正整数，调起纯数字键盘 -->
            <van-button type="primary" block @click="updateUserProfile">更新</van-button>

        </van-cell-group>
    </van-action-sheet>

    <van-action-sheet v-model:show="showEP" title="修改密码">
        <van-cell-group inset>
            <!-- 输入任意文本 -->
            <van-field v-model="editform2.new_pwd" label="请输入新密码" />
            <van-button type="primary" block @click="updateUserrPwd">确定</van-button>
        </van-cell-group>
    </van-action-sheet>

    <van-action-sheet v-model:show="showAbout" title="关于">
        <!-- <van-cell-group> -->
        <!-- 输入任意文本 -->
        <van-cell title="版本" value="v1.0.0" />
        <van-cell title="开发人员" value="庄志宇 葛政锟" />
        <van-cell title="测试人员" value="汪飞 赖泓峰 王宇暄" />
        <!-- </van-cell-group> -->
    </van-action-sheet>


    <div>
        <div class="body">
            <div class="card">
                <input type="file" id="upload" @change="addImg" style="display:none;">
                <div class="portrait">
                    <van-image v-if="user?.user_avatar == null"
                        :src="'api/common/getPicture/defaultAvatar.jpeg'" width="90" height="90"
                        id="head" @click="changeHead" ref="avatar"></van-image>
                    <van-image v-else :src="'api/common/getPicture/' + user?.user_avatar" width="90"
                        height="90" id="head" @click="changeHead" ref="avatar"></van-image>
                </div>
                <div class="user-info">
                    <div class="nick" v-text="user?.user_nickname"></div>
                    <div class="uid" v-text="'ID：' + user?.user_id"></div>
                    <div class="collectionwrap">
                        <div class="collection">{{ user?.user_mysign ? user?.user_mysign : '有个性，不签名！' }} </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <van-cell title="姓名" :value="user?.user_fullname" />
                <van-cell title="性别" :value="user?.user_gender" />
                <van-cell title="年龄" :value="user?.user_age?user?.user_age:'保密'" />
                <van-cell title="学院" :value="user?.user_institute?user?.user_institute:'保密'" />
                <van-cell title="QQ" :value="user?.user_qq?user?.user_qq:'保密'" />
                <van-cell title="微信" :value="user?.user_wechat?user?.user_wechat:'保密'" />

            </div>

            <div class="card">
                <van-cell title="编辑信息" @click="showEdit" is-link />
                <van-cell title="我的收藏" @click="router.push('/collect')" is-link />
                <van-cell title="我的商品" @click="router.push('/selling')" is-link />
                <van-cell title="我的购买" @click="router.push('/puchased')" is-link />
                <van-cell v-if="store.getUser().user_role===2" title="举报管理" @click="router.push('/reportmgr')" is-link />
                <van-cell title="修改密码" @click="showEditPwd" is-link />
                <van-cell title="关于" @click="showAbout = true" is-link />



            </div>
            <van-button style="border-radius: 15px;" @click="logoff" block>退出登录</van-button>
        </div>

    </div>


    <van-tabbar v-model="active">
        <van-tabbar-item icon="hot-o" @click="router.replace('/home')">推荐</van-tabbar-item>
        <van-tabbar-item icon="add-o" @click="router.replace('/publish')">发布</van-tabbar-item>
        <van-tabbar-item icon="friends-o" @click="router.replace('/friends')">消息</van-tabbar-item>
        <van-tabbar-item icon="contact-o" @click="router.replace('/mine')">我的</van-tabbar-item>
    </van-tabbar>
</template>


<style scoped>
.body {
    position: relative;
    /* margin-top: 10px; */
    /* top: 10%; */

    height: 90vh;
    width: 100%;
    padding: 0px 10px;
    overflow: auto;
}




.card {
    padding: 0px 0px;
    margin: 10px 0;
    background: rgb(255, 255, 255);
    border-radius: 10px;
    overflow: hidden;
}




li {
    /* background-color: #f2f2f2;
  border: 1px solid #ddd; */
    border-bottom: 1px solid #ddd;
    /* margin: 10px 0; */
    padding: 10px;
    text-align: center;
    /* border-left: 1px solid #bbd9fd; */
    border-image: -webkit-linear-gradient(left, transparent 2%, #eee 3%, #eee 97%, transparent 98%) 1;
}


HR {
    margin: 10px 0;
}





.body {
    background: #f1f1f1;
}


.user_left {
    width: 300px;
}

.userinfo {
    height: 222px;
    text-align: left;
    margin-top: 10px;
    border-radius: 10px;
}

.portrait,
.user-info,
.collection,
.nick {
    display: inline-block;
}

.portrait {
    width: 90px;
    height: 90px;
    overflow: hidden;
    border-radius: 45px;
    background-color: #ccc;
    margin: 30px 0 0 20px;
    cursor: pointer;
}

.user-info {
    height: 90px;
    width: 140px;
    margin: 32px;
    vertical-align: top;
}

.selfintro {
    height: 40px;
    line-height: 40px;
    width: 250px;
    margin: 5px auto;
    text-align: center;
}

.moreinfo {
    text-align: center;
}

.nick {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 110px;
    vertical-align: middle;
    color: #565050;
    font-weight: bold;
    text-decoration: none;
    font-size: 18px;
    height: 30px;
    line-height: 30px;
}

.uid {
    font-weight: 400;
    height: 30px;
    line-height: 30px;
}

.collectionwrap {
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
}


</style>

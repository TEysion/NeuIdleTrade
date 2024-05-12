<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { showToast, type ToastOptions } from 'vant';
import { LeftOutlined } from '@ant-design/icons-vue';
import GoodsItem from './GoodsItem.vue';
const store = useUserStore()

defineProps<{
    msg: string
}>()

const searchtext = ref('')
const user: any = ref()
const commentcontent = ref('')
const comments: any = ref([])
const showPopover = ref(true)
function Searchresult() {

}

function showSellerinfo() {

}
const activeNames = ref([])
const tabtitle = ref()
const avatar = ref()
const router = useRouter()
const editform = ref({ nickname: "", fullname: "", age: "", institude: "", gender: "", phone: "", qq: "", wechat: "", mysign: "" })
const editform2 = ref({ new_pwd: "" })

const goods = ref()
const credit = ref(4.5)
const showShare = ref(false);
const options = [
    { name: '复制链接', icon: 'link' }
];

onMounted(() => {

    axios.post("api/order/getSellingGoodsByUID", { id: router.currentRoute.value.query.user_id })
        .then((successResponse: any) => {

            goods.value = successResponse.data.message;
        })
        .catch((failResponse: any) => {

        });

    axios.post("api/user/getUserinfo", { user_id: router.currentRoute.value.query.user_id })
        .then((successResponse: any) => {

            user.value = successResponse.data.message[0];
        })
        .catch((failResponse: any) => {

        });

    window.onscroll = function () {
        //为了保证兼容性，这里取两个值，哪个有值取哪一个
        //scrollTop就是触发滚轮事件时滚轮的高度
        // alert(0)
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;


    }


})





function changeHead() {

    (document.querySelector("#upload") as any).click();
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

        })
        .catch((failResponse: any) => {

        });

}




const showEP = ref(false);
const show = ref(false);


const onShareSelect = (option: { name: string | ToastOptions | undefined; }) => {
    const url = window.location.href;

    navigator.clipboard.writeText(url)
        .then(() => {
            showToast('链接已复制到剪贴板');
        })
        .catch((error) => {
            showToast(error);
        });
   

    showShare.value = false;
};



const active = ref(0)

// 试图离开未保存的编辑文本界面
function back() {

    router.back()

}
const aaa = ref()
const titleText = ref("")
const titlebar = ref()
const titleBarColor = ref("")
const scrolling = (e: any) => {
    const clientHeight = e.target.clientHeight
    const scrollHeight = e.target.scrollHeight
    const scrollTop = e.target.scrollTop
    // aaa.value=tabtitle.value.offsetTop
    if (tabtitle.value.offsetTop == 0) {
        titleBarColor.value = "#789fff"
        titleText.value = user.value.user_nickname
    }
    else {
        titleBarColor.value = ""
        titleText.value = ""
    }

}


const goods_toTrade = computed(() => {
    let ans = []
    if (goods.value)
        for (let item of goods.value) {
            if (item.order_state == 1) {
                ans.push(item);
            }
        }
    return ans;
})

const goods_dealed = computed(() => {
    let ans = []
    if (goods.value)
        for (let item of goods.value) {
            if (item.order_state > 1) {
                ans.push(item);
            }
        }
    return ans;
})

const goods_noOrder = computed(() => {
    let ans = []
    if (goods.value)
        for (let item of goods.value) {
            if (!item.order_state) {
                ans.push(item);
            }
        }
    return ans;
})

</script>


<template>




    <div class="body" @scroll="scrolling">


        <div style="background: #55aacc;">
            <van-sticky>
                <div ref="titlebar" :style="{ background: titleBarColor }"
                    style="transition: all 0.3s;padding: 10px; display: flex; width: 100%; justify-content: space-between; align-items: center; height: 50px;">
                    <LeftOutlined @click="back" style="margin: auto 0; font-size: 18px;" />
                    <div>{{ titleText }}{{ aaa }}</div>
                    <div @click="showShare = true">更多</div>
                </div>

            </van-sticky>

            <div style="padding: 10px;" s>
                <div>
                    <van-image :src="'api/common/getPicture/' + user?.user_avatar" width="90"
                        height="90" title="头像" id="head" @click="changeHead" ref="avatar"></van-image>

                </div>

                <div class="nick" v-text="user?.user_nickname"></div>
                <div class="uid" v-text="'ID：' + user?.user_id"></div>
                <div class="collectionwrap">
                    <div class="collection">{{ user?.user_mysign }} </div>
                </div>





                <ul>
                    <li class="listitem">
                        <a>性别</a>
                        <a>{{ user?.user_gender }}</a>
                    </li>
                    <li class="listitem">
                        <a>年龄</a>
                        <a>{{ user?.user_age }}</a>
                    </li>
                    <li class="listitem">
                        <a>学院</a>
                        <a>{{ user?.user_institute }}</a>
                    </li>
                    <li class="listitem">
                        <a>姓名</a>
                        <a>{{ user?.user_fullname }}</a>
                    </li>

                    <li class="listitem">
                        <a>QQ</a>
                        <a>{{ user?.user_qq }}</a>
                    </li>

                    <li class="listitem">
                        <a>微信：</a>
                        <a>{{ user?.user_wechat }}</a>
                    </li>
                </ul>
            </div>
        </div>








        <div>

            <van-sticky :offset-top="50">
                <div ref="tabtitle"
                    style="display: flex; height: 50px; justify-content: space-around; align-items: center; background: #789fff;">

                    <div>
                        <div @click="active = 0">在售({{ goods_noOrder.length }})</div>
                        <div v-if="active == 0"
                            style="background: #F3F3F3; width: 3rem; height: 0.3rem; border-radius: 5px; margin: auto;">
                        </div>
                    </div>
                    <div>
                        <div @click="active = 1">已售({{ goods_dealed.length }})</div>
                        <div v-if="active == 1"
                            style="background: #F3F3F3; width: 3rem; height: 0.3rem; border-radius: 5px; margin: auto;">
                        </div>
                    </div>
                </div>
            </van-sticky>
            <div v-if="active == 0" style="overflow: auto; ">
                <van-empty v-if="goods_noOrder.length == 0" description="空空如也" />
                <div v-for="(item, index) in goods_noOrder" :price="item.goods_price" :desc="item.goods_desc"
                    :title="item.goods_name" :thumb="'api/common/getPicture/' + item.goods_photo"
                    @click="router.push('/detail?goods_id=' + item.goods_id)">
                    <GoodsItem :goods="item"></GoodsItem>
                </div>
            </div>

            <div v-else-if="active == 1">
                <van-empty v-if="goods_dealed.length == 0" description="空空如也" />
                <!-- <div>信誉度：<van-rate allow-half v-model="credit" icon="like" void-icon="like-o" /></div> -->
                <div v-for="(item, index) in goods_dealed" :price="item.goods_price" :desc="item.goods_desc"
                    :title="item.goods_name" :thumb="'api/common/getPicture/' + item.goods_photo"
                    @click="router.push('/detail?goods_id=' + item.goods_id)">
                    <GoodsItem :goods="item"></GoodsItem>
                </div>
            </div>


            <!-- </van-sticky> -->

        </div>

        <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" @select="onShareSelect" />
    </div>



</template>


<style scoped>
.body {
    position: relative;
    /* margin-top: 10px; */
    /* top: 10%; */

    height: 100vh;
    width: 100%;
    /* padding: 0px 10px; */
    overflow: auto;
    display: flex;
    flex-direction: column;
}

.content {
    position: relative;
    /* margin-top: 10px; */
    /* top: 10%; */

    height: 100%;
    width: 100%;
    padding: 10px 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
}


.publish option {
    background-color: #00bc9b;
    height: 100%;
    width: 100%;
}

.describ {
    padding: 20px 10px;
    margin: 10px 0px;
    background: rgb(255, 255, 255);
    border-radius: 10px;
}

.card {
    padding: 0px 0px;
    margin: 10px 0;
    background: rgb(255, 255, 255);
    border-radius: 10px;
}

.describ input {
    background: transparent;
    /* font-weight: bold; */
    font-size: 1rem;
    display: block;
    border: none;
    width: 100%;
}


.describ input:focus {
    /* background-color: red; */
    border-radius: 3px;
    border: 0;
    outline: 0px solid aqua;
    /* box-shadow: 1px 1px 10px 1px aqua; */
}


.describ textarea {
    background: transparent;
    width: 100%;
    height: 30vh;
    /* font-weight: bold; */
    font-size: 1rem;
    display: block;
    border: none;
}

.describ textarea:focus {
    /* background-color: red; */
    border-radius: 3px;
    border: 0;
    outline: 0px solid aqua;
    /* box-shadow: 1px 1px 10px 1px aqua; */
}


.listitem {
    display: flex;
    justify-content: space-between;
}

.uploadpic {
    width: 60px;
    height: 31px;
    margin: 0 auto;
}


.addpic {
    width: 58px;
    height: 25px;
    margin: 0 auto;
}


.picimg {
    cursor: pointer;
    width: 20vw;
    height: 20vw;
    margin: 3px;
}

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
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

ul li:last-child {
    border-bottom: none;
}

HR {
    margin: 10px 0;
}





.body {
    background: #f1f1f1;
}

.userinfo,
.usermenu,
.user_right {
    background: #fff;
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
    margin: 32px 0 0 20px;
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

.selfword {
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    color: #777;
    text-align: center;
    width: 250px;
    margin: 0 auto;
}
</style>

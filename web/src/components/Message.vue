<script setup lang="ts">

import axios from 'axios'
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import MsgGoods from './MsgGoods.vue'
import MsgOrder from './MsgOrder.vue'
import GoodsItem from './GoodsItem.vue';
import { useUserStore } from '../stores/user'
import { showSuccessToast, showFailToast } from 'vant';
const store = useUserStore()


const webfriends = ref([{ user_nickname: "用户1" }, { user_nickname: "用户2" }, { user_nickname: "用户3" }, { user_nickname: "用户4" }])
const inputValue = ref('')
const inputVisible = ref(false)
const webmessages: any = ref([])
const send2user = ref("")
const showType = ref(0)
var lastlookfriend = ref(null)
var hasnewmsg = ref(false)
const msginput = ref(null);
const webmsginput = ref("");
const originmsg = { sender: '小小', msg: '您好，我是智能客服小小，请描述您的问题：\n2.功能建议\n3.bug反馈', type: 'txt' }
const messages = ref([originmsg]);
const scrolldivwebmsg = ref(null);
const showMore = ref(false);
const showOrderEdit = ref(false);


const router = useRouter()
const address = ref('');
const time = ref();

const friend = ref({ user_nickname: send2user.value, user_avatar: null })


function sendwebmsg() {
    if (webmsginput.value == "" || !webmsginput.value)
        return;
    axios.post('api/message/sendMessage', {
        friend_user_id: send2user.value,
        type: 1,
        message_content: webmsginput.value
    })
        .then((successResponse) => {
            // alert("ok")
            // sendOK = true;
            getMessage();
        })
        .catch((failResponse) => {
            // alert(failResponse)
            showFailToast('发送失败');
            // sendOK = true;
        });
    webmsginput.value = "";
    // webmessages.value.push({ message_content: "123456" })
}



function sendMsg(type: any, content: any) {
    axios.post('api/message/sendMessage', {
        friend_user_id: send2user.value,
        type: type,
        message_content: content
    })
        .then((successResponse) => {
            // alert("ok")
            // sendOK = true;
            getMessage();
        })
        .catch((failResponse) => {
            showFailToast('发送失败');
        });
}

function getMessage() {
    axios.post('api/message/getMessages', {
        friend_user_id: send2user.value,
    })
        .then((successResponse) => {

            webmessages.value = successResponse.data.message;

            webmessages.value.sort((msg1: { message_time: number; }, msg2: { message_time: number; }) => {
                // if (a.donetime == null && b.donetime != null) return -1
                if (msg1.message_time < msg2.message_time) return -1
                return 0;
            })

            // alert(webmessages.value)
        })
        .catch((failResponse) => {
            alert(failResponse)
            // sendOK = true;
        });
    // webmsginput.value = "";
}

// let sendOK = false;
function updateWebMsg() {
    // 首先检查是否有新消息
    axios.post('api/message/getNewMessageNum', {
        fuid: send2user.value,
    })
        .then((successResponse) => {

                if (successResponse.data.message > 0) {
                    getMessage();
                }

        })
        .catch((failResponse) => {
            // alert(failResponse)
            // sendOK = true;
        });
}

// 单个 ref
watch(webmessages, (newX, oldX) => {
    // alert(newX)
    var div = scrolldivwebmsg.value as any;
    setTimeout(() => {
        if (oldX as any == "") div.scrollTop = div.scrollHeight;
        else div.scrollTo({ top: div.scrollHeight, behavior: 'smooth' })
    }, 0)
}, {
    deep: true
})

let timer: number;
const goods_id = ref()
onMounted(() => {
    send2user.value = router.currentRoute.value.query.fuid as any
    goods_id.value = router.currentRoute.value.query.gid as any
    friend.value.user_nickname = send2user.value

    router.replace('/message?fuid='+send2user.value)


    getMessage();
    timer = setInterval(() => {
        updateWebMsg()
    }, 1000 * 1);
    getFriendInfo();
    // alert(goods_id.value)
    if (goods_id.value) {
        // alert(goods_id.value)
        sendGoods();
    }

    // alert(goods_id.value)
})


const getFriendInfo = () => {
    axios.post("api/user/getUserinfo", { user_id: send2user.value })
        .then((successResponse: any) => {

            friend.value = successResponse.data.message[0];
        })
        .catch((failResponse: any) => {

        });
}

onUnmounted(() => {
    clearInterval(timer);
})


function formattime(time: any) {
    if (time == null) return ''
    var t = new Date(time)
    return `${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${(t.getMinutes()).toString().padStart(2, '0')}`
}


function onClickLeft() {
    router.back();
}

function onClickRight() {

}

const sendGoods = () => {
    sendMsg(6, goods_id.value);
}

// 发送订单
const sendOrder = () => {
    // 首先创建订单

    // currentTime.value
    let dateStr = `${currentDate.value[0]}/${currentDate.value[1]}/${currentDate.value[2]} ${currentTime.value[0]}:${currentTime.value[1]}`
    axios.post('api/order/createOrder', {
        goods_id: currentGoods,
        addr: address.value,
        buyer: send2user.value,
        dateTime: dateStr
    })
        .then((successResponse) => {

            sendMsg(9, successResponse.data.message);
            showOrderEdit.value = false;
        })
        .catch((failResponse) => {

        });

}


const active = ref(2)

const currentDate = ref()
const currentTime = ref()

const minDate = new Date();
let maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 100);


const msg7decode = (str: string) => {
    let val = JSON.parse(str);
    let dateStr = `${val.date[0]}/${val.date[1]}/${val.date[2]} ${val.time[0]}:${val.time[1]}`;
    let date = new Date(dateStr);
    // alert(date)
    return { dateTime: date, addr: val.addr, dateTimeStr: dateStr };


}

const msg88decode = (str: string) => {
    let val = {text: '', goods_id: null};
    try{
      val  = JSON.parse(str);
    }
    catch(e) {

    }
    return val;


}


let currentGoods: string;
const editOrder = (goods_id: string) => {
    // alert(12345)
    showOrderEdit.value = true;
    currentGoods = goods_id;
}

// makeup();


const showSelectDate = ref(false);
const showSelectTime = ref(false);

const formDate = ref();
const formTime = ref();

</script>

<template>


    <div class="root" style="height: 100vh; display: flex; flex-direction: column;">

        <van-nav-bar :title="friend?.user_nickname" left-text="消息" right-text="" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight">
            <template #right>
                <van-icon @click="router.push('/userhome?user_id=' + send2user)" style="font-size: 1.2rem;"
                    name="contact-o" />
            </template>
        </van-nav-bar>

        <div style="height: 100%; overflow: auto">

            <div ref="scrolldivwebmsg"
                style="height: 100%; overflow: auto; padding: 10px; display: flex; flex-direction: column;">


                <div v-for="msg in webmessages">
                    <div style="display: flex; justify-content: flex-end;" v-if="msg.message_type === 0">
                        <div style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="100%" color=#987cb9
                            SIZE=3>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;"
                        v-else-if="msg.message_sender === store.getUserID()">
                        <div style="white-space: pre-wrap; border-radius: 15px;">
                            <div class="d-flex justify-content-end" style="align-items:end;text-align: right;">
                                <a style="color: var(--color-text); font-size: small; margin-right: 10px;">{{
                                    formattime(msg.message_time) }}</a>

                                <a style="color: var(--color-text); font-size: small;">{{ store.getUser()?.user_nickname
                                    }}</a>
                            </div>


                            <div v-if="msg.message_type === 1"
                                style="padding: 10px; white-space: pre-wrap; background-color: #CCEEFF; border-radius: 10px;"
                                v-html="msg.message_content">
                            </div>


                            <div v-else-if="msg.message_type === 6">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <MsgGoods :goodsId="msg.message_content" :isMyself="true">
                                    </MsgGoods>
                                </div>
                            </div>

                            <div v-else-if="msg.message_type === 9">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <MsgOrder :orderId="msg.message_content" :isMyself="true"></MsgOrder>
                                </div>
                            </div>

                            
                            <div v-else-if="msg.message_type === 88">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <GoodsItem :orderId="msg.message_content.goods_id" :isMyself="true"></GoodsItem>
                                    {{ msg.message_content.text }}
                                </div>
                            </div>


                            <div v-else>
                                未知消息类型：{{ msg.message_type }} {{ msg.message_content }}
                            </div>


                        </div>

                        <van-image round width="3rem" height="3rem" style=" margin: 0.5rem; margin-left: 0.5rem;" @click="router.push('/userhome?user_id=' + msg.message_sender)"
                            :src="'api/common/getPicture/' + store.getUser()?.user_avatar" />

                    </div>
                    <div style="display: flex;" v-else-if="msg.message_sender !== store.getUserID()">

                        <van-image round width="3rem" height="3rem"
                            style="margin: 0.5rem; margin-right: 0.5rem; min-width: 3rem;" @click="router.push('/userhome?user_id=' + msg.message_sender)"
                            :src="'api/common/getPicture/' + friend?.user_avatar" />



                        <div style="white-space: pre-wrap; border-radius: 15px;">
                            <a style="font-size: small;color: var(--color-text);">{{ friend?.user_nickname }}</a>
                            <a style="font-size: small; margin-left: 10px; color: var(--color-text);">{{
                                formattime(msg.message_time) }}</a>



                            <div v-if="msg.message_type === 1"
                                style="padding: 10px; white-space: pre-wrap; background-color: #FFFFFF; border-radius: 10px;"
                                v-html="msg.message_content">
                            </div>

                            <div v-else-if="msg.message_type === 6">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <MsgGoods :goodsId="msg.message_content" :isMyself="false"
                                        @onEditOrder="editOrder(msg.message_content)">
                                    </MsgGoods>
                                </div>
                            </div>

                            <div v-else-if="msg.message_type === 9">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <MsgOrder :orderId="msg.message_content" :isMyself="false"></MsgOrder>
                                </div>
                            </div>


                            <div v-else-if="msg.message_type === 88">
                                <div
                                    style="background-color: white; border-radius: 15px; min-width: calc(100vw - 6rem); max-width: calc(100vw - 6rem)">
                                    <GoodsItem :goods_id="msg88decode(msg.message_content).goods_id" :isMyself="true"></GoodsItem>
                                    <div style="margin: 0 10px;">{{ msg88decode(msg.message_content).text }}</div>
                                </div>
                            </div>

                            <div v-else>
                                未知消息类型：{{ msg.message_type }} {{ msg.message_content }}
                            </div>

                        </div>
                    </div>

                    <div style="display: flex;justify-content: center; align-items: Center;" v-else>
                        <div style="white-space: pre-wrap; border-radius: 5px;">
                            <div class="d-flex justify-content-center "
                                style=" color: var(--color-text); font-size: small;">
                                <a> {{ formattime(msg.message_time) }}</a>
                            </div>
                            <div class="gncardreverse"
                                style="min-width: 20vw ;display: flex;justify-content: center; align-items: Center; padding: 5px; white-space: pre-wrap; border-radius: 5px;">
                                {{ msg.senderName }}{{ msg.message_content }}{{ msg.receiverName }}
                            </div>
                        </div>
                    </div>


                </div>
            </div>




        </div>


        <!-- <van-collapse v-model="showMore"> -->
        <!-- <van-collapse-item name="1"> -->
        <!-- <template #title> -->
        <div style="width: 100%; display: flex; padding: 0px;">
            <van-field v-model="webmsginput" placeholder="请输入" @keyup.enter="sendwebmsg()"></van-field>
            <!-- <button style="width: 20%" @click="showMore = !showMore;" type="button" id="button-addon2">更多</button> -->
            <van-button style="width: 20%" @click="sendwebmsg()" id="button-addon2">发送</van-button>
        </div>
        <!-- </template> -->
        <div v-if="showMore">
            <button @click="sendGoods">发送商品（买家）</button>
            <button>商家评价（买家）</button>
            <button @click="showOrderEdit = true;">发送订单（商家）</button>
        </div>


        <van-popup v-model:show="showOrderEdit" round position="bottom">
            <div>
                <van-nav-bar title="编辑订单" left-text="取消" right-text="发送" @click-left="showOrderEdit = false"
                    @click-right="sendOrder" />

                <!-- <div>商品：{{ currentGoods }}</div> -->
                <GoodsItem :goods_id="currentGoods"></GoodsItem>
                
                <van-cell title="卖家" :value="'我'"></van-cell>
                <van-cell title="买家" :value="send2user"></van-cell>
                <van-cell title="日期" :value="currentDate?currentDate[0]+'/'+currentDate[1]+'/'+currentDate[2]:''" readonly is-link @click="showSelectDate = true"></van-cell>
                <van-cell title="时间" :value="currentTime?currentTime[0]+':'+currentTime[1]:''" readonly is-link @click="showSelectTime = true"></van-cell>
                



                <van-field v-model="address" label="地址" placeholder="编辑地点" />
                <div style="margin: 50px;"></div>
            </div>
        </van-popup>

        <van-popup round position="bottom" v-model:show="showSelectDate" >
            <van-date-picker v-model="formDate" title="选择日期" :min-date="minDate" :max-date="maxDate" @cancel="showSelectDate=false" @confirm="currentDate=formDate;showSelectDate=false;" />
        </van-popup>

        <van-popup round position="bottom" v-model:show="showSelectTime">
            <van-time-picker v-model="formTime" title="选择时间" @cancel="showSelectTime=false" @confirm="currentTime=formTime;showSelectTime=false;" />
        </van-popup>




        <!-- </van-collapse-item> -->

        <!-- </van-collapse> -->


    </div>

</template>

<style scoped>
.head {
    display: flex;
    justify-content: space-between;
    position: fixed;
    height: 10%;
    width: 100%;
    z-index: 99;
    padding: 10px;
    background-color: #f3f3f3;
}

.head a {
    font-weight: bold;
    margin: auto 0;
    font-size: 1.2rem;
}

.head button {
    font-weight: bold;
    font-size: 0.9rem;
    background: #88ddff;
    border-radius: 5px;
    border: none;
    padding: 0 20px;
    /* position: absolute; */
    /* right: 0; */
}

.body {
    position: relative;
    /* margin-top: 10px; */
    /* top: 10%; */

    height: 90vh;
    width: 100%;
    padding: 0px 10px;
    padding-top: 10vh;
    overflow: auto;
}



::v-deep .el-input__inner {
    /* background-color: rgba(255, 255, 255, 0.329) !important;  */
    /* color: red !important; */
    color: white;
}

::v-deep .el-input__wrapper {
    background-color: rgba(255, 255, 255, 0.329) !important;
    /* color: red !important; */
    color: white;
}
</style>: { message_time: number; }: { message_time: number; }

<script setup lang="ts">

import axios from 'axios'
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';


import { useUserStore } from '../stores/user'

const store = useUserStore()

const webfriends: any = ref([])


const router = useRouter()


function getFriends() {
    axios.post('api/message/getFriends')
        .then((successResponse) => {
            webfriends.value = successResponse.data.message;
        })
        .catch((failResponse) => {
            alert(failResponse)
        });
}


onMounted(() => {
    getFriends();
})



const active = ref(2)
</script>

<template>



    <div class="head">
        <a>消息</a>
    </div>
    <div class="body">

        <van-empty v-if="webfriends.length == 0" description="无消息" />


        <div style="border-radius: 15px; background-color: #fff; padding: 15px; margin: 10px 0; "
            v-for="(item, index) in webfriends" :desc="item.user_nickname" :title="item.user_nickname"
            :thumb="'api/common/getPicture/' + item.user_nickname"
            @click="router.push('/message?fuid=' + item.friend_id)">

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center;">
                    <van-image width="40" height="40" round
                        :src="'api/common/getPicture/' + item?.user_avatar"></van-image>
                    <div style="margin: 0 10px;">
                        {{ item.user_nickname }}

                    </div>
                </div>

                <!-- <van-badge :content="200" max="99" /> -->
                <span v-if="item.unread_num > 0"
                    style="background-color: red; border-radius: 1rem; color: white; padding: 0 0.4rem; font-size: 0.8rem;">
                    {{ item.unread_num }}

                </span>

            </div>


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
}

.body {
    position: relative;

    height: 90vh;
    width: 100%;
    padding: 0px 10px;
    padding-top: 10vh;
    overflow: auto;
}



::v-deep .el-input__inner {
    color: white;
}

::v-deep .el-input__wrapper {
    background-color: rgba(255, 255, 255, 0.329) !important;
    color: white;
}
</style>

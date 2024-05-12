<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { LeftOutlined } from '@ant-design/icons-vue';
import GoodsItem from './GoodsItem.vue';
const store = useUserStore()

defineProps<{
    msg: string
}>()


const goods: any = ref()


const router = useRouter()


axios.post("api/goods/getCart", { id: store.getUserID() })
    .then((successResponse: any) => {
        goods.value = successResponse.data.message;
    })
    .catch((failResponse: any) => {
    });




function onClickLeft() {
    router.go(-1);
}

function onClickRight() {

}

</script>


<template>
    <div class="cart">
        <!-- <van-sticky class="head"> -->
        <van-nav-bar class="head" title="我的收藏" left-text="返回" right-text="" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />
        <!-- </van-sticky> -->

        <div class="body">

            <van-empty v-if="goods.length === 0" description="空空如也" />

            <GoodsItem v-for="(item, index) in goods" :goods="item"></GoodsItem>

        </div>

    </div>
</template>


<style scoped>


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

    height: calc(100vh - var(--van-nav-bar-height) - 20px);
    width: 100%;
    padding: 0px 10px;
    margin: 10px 0;
    /* padding-top: 10vh; */
    overflow: auto;
}
</style>

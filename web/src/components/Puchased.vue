<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { LeftOutlined } from '@ant-design/icons-vue';
import { showSuccessToast, showFailToast } from 'vant';
import GoodsItem from './GoodsItem.vue'
const store = useUserStore()

defineProps<{
    msg: string
}>()

const searchtext = ref('')
const goods: any = ref()
const commentcontent = ref('')
const comments: any = ref([{ comment_content: "骗人的，大家不要信" }, { comment_content: "请审核尽快屏蔽" }])
const pics: any = ref([])
function Searchresult() {

}

function showSellerinfo() {

}

const router = useRouter()

onMounted(() => {

    axios.post("api/order/getPuchasedGoodsByUID")
        .then((successResponse: any) => {

            goods.value = successResponse.data.message;
        })
        .catch((failResponse: any) => {

        });

})



function onClickLeft() {
    router.go(-1);
}

function onClickRight() {


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

const active = ref(0);
</script>


<template>
    <div class="cart">
        <van-nav-bar class="head" title="我的购买" left-text="返回" right-text="" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />

        <div class="body">

            <van-tabs v-model:active="active">
                <van-tab title="等待交易">
                    <van-empty v-if="goods_toTrade.length == 0" description="空空如也" />
                    <div v-for="(item, index) in goods_toTrade">
                        <GoodsItem :goods="item"
                            @onClickGoods="router.push('/detail?goods_id=' + item.goods_id)"></GoodsItem>
                    </div>
                </van-tab>
                <van-tab title="交易完成">
                    <van-empty v-if="goods_dealed.length == 0" description="空空如也" />
                    <div v-for="(item, index) in goods_dealed">
                        <GoodsItem :goods="item"
                            @onClickGoods="router.push('/detail?goods_id=' + item.goods_id)"></GoodsItem>
                    </div>
                </van-tab>
            </van-tabs>



        </div>
    </div>
</template>


<style scoped>
.head {}

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
    height: calc(100vh - var(--van-nav-bar-height) - 20px);
    width: 100%;
    padding: 0px 10px;
    margin: 10px 0;
    overflow: auto;
}
</style>

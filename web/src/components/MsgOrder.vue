<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useRouter } from 'vue-router';
const router = useRouter()
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { ref, onMounted } from 'vue'
import GoodsItem from './GoodsItem.vue';
const props = defineProps(['orderId', 'isMyself'])
const store = useUserStore()


let hasRecord = store.loadLocal();
let order = ref()

store.update();

onMounted(() => {
  axios.post("api/order/getOrder", { order_id: props.orderId })
    .then((successResponse: any) => {

      order.value = successResponse.data.message[0];
    })
    .catch((failResponse) => {

    })
})

const confirmOrder = (orderId: string) => {
  // alert(123)
  axios.post('api/order/confirmOrder', {
    order_id: orderId,
  })
    .then((successResponse) => {

    })
    .catch((failResponse) => {

    });
}

function formattime(time: any) {
    if (time == null) return ''
    var t = new Date(time)
    return `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${(t.getMinutes()).toString().padStart(2, '0')}`
}


</script>

<template>

  <div v-if="props.isMyself">
    <div type="primary" style="text-align: center; font-weight: bold;">商品订单</div>
    <!-- <van-nav-bar type="primary" title="商品订单" /> -->

    <GoodsItem v-if="order?.order_goods" :goods_id="order.order_goods">
    </GoodsItem>
    <GoodsItem v-else="order?.order_goods">
    </GoodsItem>
    <van-cell title="订单编号" :value="props.orderId"></van-cell>
    <van-cell title="卖家" :value="'我'"></van-cell>
    <van-cell title="买家" :value="order?.order_buyer"></van-cell>
    <van-cell title="时间" :value="formattime(order?.order_deal_time)"></van-cell>
    <van-cell title="地点" :value="order?.order_addr"></van-cell>
    <van-button v-if='order?.order_state == 0' type="primary" block>等待买家确认</van-button>
    <van-button v-else-if='order?.order_state == 1' type="primary"  disabled block>
      <div>订单已确认</div>
      <div style="font-size: 0.5rem;">请在约定时间地点线下交易</div>
    </van-button>
  </div>

  <div v-else>
    <div type="primary" style="text-align: center; font-weight: bold;">商品订单</div>
    <!-- <van-nav-bar type="primary" title="商品订单" /> -->
    <GoodsItem v-if="order?.order_goods" :goods_id="order.order_goods">

</GoodsItem>
    <van-cell title="订单编号" :value="props.orderId"></van-cell>
    <van-cell title="卖家" :value="order?.goods_seller"></van-cell>
    <van-cell title="买家" :value="'我'"></van-cell>
    <van-cell title="时间" :value="formattime(order?.order_deal_time)"></van-cell>
    <van-cell title="地点" :value="order?.order_addr"></van-cell>
    <van-button v-if='order?.order_state == 0' type="primary" block @click="confirmOrder(props.orderId)">确认订单</van-button>
    <van-button v-else-if='order?.order_state == 1' type="primary"  disabled block @click="confirmOrder(props.orderId)">
      <div>订单已确认</div>
      <div style="font-size: 0.5rem;">请在约定时间地点线下交易</div>
    </van-button>
  </div>

</template>

<style scoped></style>

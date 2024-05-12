<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useRouter } from 'vue-router';
const router = useRouter()
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { ref, onMounted } from 'vue'
import GoodsItem from './GoodsItem.vue';
const props = defineProps(['goodsId', 'isMyself'])
const emit = defineEmits(['onEditOrder'])
const store = useUserStore()


let hasRecord = store.loadLocal();
let goods = ref()


const onEditOrder = ()=> {
  // alert(88);
  emit('onEditOrder');
  // alert(99);
}


</script>

<template>

  <div v-if="props.isMyself">
    <div type="primary" style="text-align: center; font-weight: bold;">发送了一个商品</div>
    <GoodsItem :goods_id="props.goodsId">
    </GoodsItem>
    
  </div>

  <div v-else>
    <div type="primary" style="text-align: center; font-weight: bold;">发送了一个商品</div>
    <GoodsItem :goods_id="props.goodsId">
    </GoodsItem>
    <van-button type="primary" block @click="onEditOrder">编辑订单</van-button>
  </div>

</template>

<style scoped></style>

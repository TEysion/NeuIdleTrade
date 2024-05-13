<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router';
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { ref, onMounted, computed, watch } from 'vue'
import { showSuccessToast, showFailToast } from 'vant';

const props = defineProps(['goods', 'goods_id'])
const emit = defineEmits(['onDelete', 'onClickGoods'])
const store = useUserStore()
const router = useRouter()
const showReviewEditor = ref(false);

const rate = ref(5)
const review = ref()

const goods: any = ref({ goods_name: "加载中", goods_desc: "加载中", ban_reason: null, goods_price: 0, category_name: '加载中' })

watch(
    () => props.goods,
    (newVal, oldVal) => {
        goods.value = props.goods;
    }
)

watch(
    () => props.goods_id,
    (newVal, oldVal) => {
        axios.post("api/goods/getGoodsInfo", { id: props.goods_id })
            .then((successResponse: any) => {
                let item = successResponse.data.message[0]
                let pictureArray: { path: any; width: any; height: any; }[] = []
                try {
                    let pics = item.picture_paths.split(',')
                    let ws = item.picture_widths.split(',')
                    let hs = item.picture_heights.split(',')
                    pics.forEach((element: any, idx: any) => {
                        pictureArray.push({ path: pics[idx], width: ws[idx], height: hs[idx] })
                    });
                }
                catch (e) {
                    pictureArray.push({ path: null, width: 100, height: 100 })
                }
                item.goods_photos = pictureArray
                goods.value = (item)
            })
            .catch((failResponse: any) => {
            });
    }
)

const order_score = computed(() => {
    return goods.value.order_score;
})

onMounted(() => {
    if (props.goods) {
        goods.value = props.goods;
    }
    else if (props.goods_id) {
        axios.post("api/goods/getGoodsInfo", { id: props.goods_id })
            .then((successResponse: any) => {
                let item = successResponse.data.message[0]
                let pictureArray: { path: any; width: any; height: any; }[] = []
                try {
                    let pics = item.picture_paths.split(',')
                    let ws = item.picture_widths.split(',')
                    let hs = item.picture_heights.split(',')
                    pics.forEach((element: any, idx: any) => {
                        pictureArray.push({ path: pics[idx], width: ws[idx], height: hs[idx] })
                    });
                }
                catch (e) {
                    pictureArray.push({ path: null, width: 100, height: 100 })
                }
                item.goods_photos = pictureArray
                goods.value = (item)

            })
            .catch((failResponse: any) => {
            });

    }
})
import { showConfirmDialog } from 'vant';

const deleteGoods = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    // 禁止事件冒泡
    e.preventDefault();
    e.stopPropagation();
    showConfirmDialog({
        title: '确定吗',
        message:
            '确定要下架此商品吗？',
    })
        .then(() => {
            // on confirm
            axios.post("api/goods/deleteGoods", { goods_id: goods.value.goods_id })
                .then((successResponse: any) => {
                    showSuccessToast('下架成功！');
                    goods.value.goods_name = "已下架";
                    goods.value.goods_desc = "已下架";
                    goods.value.goods_price = 0.00;
                    emit('onDelete');
                })
                .catch((failResponse: any) => {
                    showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
                });
        })
        .catch(() => {
        });
}

const clickGoods = () => {
    emit('onClickGoods');
}

function formattime(time: any) {
    if (time == null) return ''
    var t = new Date(time)
    return `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${(t.getMinutes()).toString().padStart(2, '0')}`
}

const currentTime = new Date();

const hasGotten = () => {
    axios.post("api/order/confirmGot", { order_id: goods.value.order_id })
        .then((successResponse: any) => {
            goods.value.order_state = 2;
        })
        .catch((failResponse: any) => {
        });
}

const confirmReview = () => {

    axios.post("api/order/confirmReview", { order_id: goods.value.order_id, order_score: rate.value, order_comment: review.value })
        .then((successResponse: any) => {
            goods.value.order_state = 3;
            goods.value.order_score = rate.value;
            goods.value.order_comment = review.value;
            showReviewEditor.value = false;
        })
        .catch((failResponse: any) => {
        });
}
</script>

<template>
    <div class="goods-item">
        <van-card v-if="goods?.ban_reason != null" :price="goods?.goods_price.toFixed(2)"
            :desc="'此商品已下架，下架原因：' + goods?.ban_reason" :title="'已下架'" :thumb="'api/common/getPicture/banGoods.jpeg'"
            @click="router.push('/detail?goods_id=' + goods?.goods_id)">
            <template #tags>
                <van-tag plain type="danger">{{ goods?.category_name }}</van-tag>
            </template>
            <template #footer>
                <button v-if="goods?.goods_seller == store.getUserID()" @click="deleteGoods"
                    style="background: #FFFFFF; border: #0066FF solid 1px; outline: none; color: #0066FF; border-radius: 5px;">下架商品</button>
                <button v-else
                    style="background: #FFFFFF; border: #0066FF solid 1px; outline: none; color: #0066FF; border-radius: 5px; opacity: 0;">摆设</button>
            </template>
        </van-card>
        <van-card v-else :price="goods?.goods_price.toFixed(2)" :desc="goods?.goods_desc" :title="goods?.goods_name"
            :thumb="'api/common/getPicture/' + goods?.goods_photo"
            @click="router.push('/detail?goods_id=' + goods?.goods_id)">
            <template #tags>
                <van-tag plain type="danger">{{ goods?.category_name }}</van-tag>
            </template>
            <template #footer>
                <button v-if="goods?.goods_seller == store.getUserID()" @click="deleteGoods"
                    style="background: #FFFFFF; border: #0066FF solid 1px; outline: none; color: #0066FF; border-radius: 5px;">下架商品</button>
                <button v-else
                    style="background: #FFFFFF; border: #0066FF solid 1px; outline: none; color: #0066FF; border-radius: 5px; opacity: 0;">摆设</button>
            </template>
        </van-card>
        <div v-if="goods?.order_state != null">
            <van-cell title="订单编号" :value="goods?.order_id"></van-cell>
            <div v-if="goods?.goods_seller === store.getUserID() || goods?.order_buyer === store.getUserID()">
                <van-cell title="卖家" :value="goods?.goods_seller"></van-cell>
                <van-cell title="买家" :value="goods?.order_buyer"></van-cell>
                <van-cell title="时间" :value="formattime(goods?.order_deal_time)"></van-cell>
                <van-cell title="地点" :value="goods?.order_addr"></van-cell>
            </div>
            <van-cell title="评分">
                <template #value>
                    <van-rate v-model="order_score" readonly></van-rate>
                </template>
            </van-cell>
            <van-cell title="评价" :value="goods?.order_comment"></van-cell>
            <van-button v-if='goods?.order_state == 0' type="primary" block>等待买家确认</van-button>
            <van-button v-else-if='goods?.order_state == 1 && currentTime <= new Date(goods?.order_deal_time)'
                type="primary" disabled block>
                <div>订单已确认</div>
                <div style="font-size: 0.5rem;">请在约定时间地点线下交易</div>
            </van-button>
            <van-button v-else-if='goods?.order_state == 1 && currentTime > new Date(goods?.order_deal_time)'
                type="primary" block @click="hasGotten()">
                <div>确认收货</div>
            </van-button>
            <van-button v-else-if='goods?.order_state == 2 && goods?.order_buyer == store.getUserID()' type="primary"
                block @click="showReviewEditor = true;">
                <div>评价</div>
            </van-button>
            <van-button v-else-if='goods?.order_state == 3 && goods?.order_buyer == store.getUserID()' disabled type="primary" block>
                <div>已评价</div>
            </van-button>
            <van-steps v-if="goods?.order_buyer == store.getUserID()" :active="goods?.order_state">
                <van-step>联系卖家</van-step>
                <van-step>确认订单</van-step>
                <van-step>见面交易</van-step>
                <van-step>完成评价</van-step>
            </van-steps>
        </div>
        <van-popup v-model:show="showReviewEditor" round position="bottom">
            <div>
                <van-nav-bar title="评价" left-text="取消" right-text="确定" @click-left="showReviewEditor = false"
                    @click-right="confirmReview" />
                <van-field label="评分">
                    <template #input>
                        <van-rate v-model="rate" icon="like" void-icon="like-o" />
                    </template>
                </van-field>
                <van-field v-model="review" rows="5" autosize label="评价" type="textarea"
                    placeholder="请输入评价"></van-field>
            </div>
        </van-popup>
    </div>
</template>

<style></style>

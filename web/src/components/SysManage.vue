<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { LeftOutlined } from '@ant-design/icons-vue';
import { showSuccessToast, showFailToast, showToast, type ToastOptions } from 'vant';
import GoodsItem from './GoodsItem.vue'
import Chart from 'chart.js/auto';
const store = useUserStore()

defineProps<{
    msg: string
}>()

const searchtext = ref('')
const commentcontent = ref('')
const comments: any = ref([{ comment_content: "骗人的，大家不要信" }, { comment_content: "请审核尽快屏蔽" }])
const pics: any = ref([])
const users: any = ref([])
const usersSearchText = ref('')
const goodsSearchText = ref('')
const showUsers = computed(() => {
    if (usersSearchText.value.length == 0) {
        return users.value;
    }
    let filtered: any = [];
    users.value.forEach((user: { user_id: any; user_nickname: any; }) => {
        if (('' + user.user_id).includes(usersSearchText.value)) {
            filtered.push(user);
        }
        if (user.user_nickname.includes(usersSearchText.value)) {
            filtered.push(user);
        }
    });
    return filtered;
})
const showGoods = computed(() => {
    if (goodsSearchText.value.length == 0) {
        return goods.value;
    }
    let filtered: any = [];
    goods.value.forEach((goods: { goods_id: any; goods_name: any; }) => {
        if (('' + goods.goods_id).includes(goodsSearchText.value)) {
            filtered.push(goods);
        }
        if (goods.goods_name.includes(goodsSearchText.value)) {
            filtered.push(goods);
        }
    });
    return filtered;
})

const goods: any = ref([])
const orders: any = ref([])
function Searchresult() {

}

function showSellerinfo() {

}

const router = useRouter()
const transactionChart = ref();
const totalDealNum = ref(0);
let dailyTransactionCount: any = {};

onMounted(() => {
    axios.post("api/user/getAllUsers", { id: router.currentRoute.value.query.seller_id })
        .then((successResponse: any) => {
            users.value = successResponse.data.message;
            users.value.forEach((element:any) => {
                element.actions = []
                if (element.user_role >= 0) {
                    element.actions = [
                        {
                            text: '查看用户', code: 1, func: () => {
                                router.push('/userhome?user_id=' + element.user_id);
                            }
                        },
                        {
                            text: '重置密码', code: 3, func: () => {
                                axios.post("api/user/resetPassword", { user_id: element.user_id })
                                    .then((successResponse: any) => {
                                    })
                                    .catch((failResponse: any) => {

                                    })
                            }
                        },
                    ]
                }

                if (element.user_role == 2) {
                    element.actions.push({
                        text: '取消管理员', code: 4, func: () => {
                            axios.post("api/user/revokeManager", { user_id: element.user_id })
                                .then((successResponse: any) => {
                                })
                                .catch((failResponse: any) => {

                                })
                        }
                    })
                }
                else if (element.user_role == 0) {
                    element.actions.push({
                        text: '设为管理员', code: 5, func: () => {
                            axios.post("api/user/grantManager", { user_id: element.user_id })
                                .then((successResponse: any) => {
                                })
                                .catch((failResponse: any) => {

                                })
                        }
                    })
                }

                element.onSelect = (action: { func: () => void; }) => {
                    action.func();
                }

            });

        })
        .catch((failResponse: any) => {
        });
    axios.post("api/goods/getAllGoods", { id: router.currentRoute.value.query.seller_id })
        .then((successResponse: any) => {
            console.log(successResponse)
            goods.value = successResponse.data.message;
            goods.value.forEach((element:any) => {
                element.actions = [
                    {
                        text: '查看商品', code: 1, func: () => {
                            router.push('/detail?goods_id=' + element.goods_id);
                        }
                    },
                    {
                        text: '下架商品', code: 2, func: () => {
                            axios.post("api/goods/deleteGoods", { goods_id: element.goods_id })
                                .then((successResponse: any) => {
                                    showSuccessToast('下架成功！');
                                })
                                .catch((failResponse: any) => {

                                    showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
                                });
                        }
                    },
                ]


                element.onSelect = (action: { func: () => void; }) => {
                    action.func();
                }

            });

        })
        .catch((failResponse: any) => {
            console.log(failResponse)
        });
    axios.post("api/order/getAllOrders")
        .then((successResponse: any) => {
            console.log(successResponse)
            orders.value = successResponse.data.message;
            orders.value.forEach((order:any) => {
                const date = new Date(order.order_deal_time).toLocaleDateString();
                if (new Date(order.order_deal_time) > new Date()) {
                    return;
                }
                if (dailyTransactionCount[date]) {
                    dailyTransactionCount[date] += 1;
                } else {
                    dailyTransactionCount[date] = 1;
                }
                totalDealNum.value++;

            });

            dailyTransactionCount = Object.entries(dailyTransactionCount).map(([date, count]) => ({ date, count }));

            dailyTransactionCount.sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => {
                const dateA: any = new Date(a.date);
                const dateB: any = new Date(b.date);
                return dateA - dateB;
            });


            console.log('aa', dailyTransactionCount)
            // 提取日期和交易数量到分别的数组
            const dates = dailyTransactionCount.map((item: { date: any; }) => item.date);
            const counts = dailyTransactionCount.map((item: { count: any; }) => item.count);

            // 创建折线图
            const ctx = transactionChart.value.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: '交易量',
                            data: counts,
                            borderColor: 'blue',
                            fill: false,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            // stepSize: 1,
                        },
                    },
                },
            });


        })
        .catch((failResponse: any) => {
            console.log(failResponse)
        });
})


function onClickLeft() {
    router.go(-1);
}

function onClickRight() {
    router.replace('/login');
    store.logout();
}




const active = ref(0);

const searchText = ref('');

</script>


<template>
    <div v-if="store.getUser().user_role===-2">
        <van-nav-bar class="head" title="系统管理员" right-text="退出登录" @click-left="onClickLeft" @click-right="onClickRight" />

        <div>

            <van-tabs v-model:active="active">
                <van-tab title="统计信息">
                    <div class="body">
                        <div
                            style="border-radius: 5px; background: #FFF; text-align: center; padding: 10px; margin: 5px 0;">
                            <div style="font-weight: bold;">总交易量</div>
                            <div>{{ totalDealNum }}</div>
                        </div>
                        <div
                            style="border-radius: 5px; background: #FFF; text-align: center; padding: 10px; margin: 5px 0;">
                            <div style="font-weight: bold;">统计图</div>
                            <canvas ref='transactionChart'></canvas>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="用户管理">
                    <div class="body">
                        <van-search v-model="usersSearchText"></van-search>
                        <div v-for="user in showUsers">

                            <van-row
                                style="height: 4rem; border-radius: 0px; background: #FFF; margin: 5px 0; align-items: center;">
                                <van-col span="2">

                                </van-col>
                                <van-col span="17">
                                    <div style="margin: auto;">{{ user.user_nickname }}({{ user.user_id }})</div>
                                </van-col>

                                <van-col span="5">
                                    <van-popover v-if="user.actions?.length > 0" v-model:show="user.showPopover"
                                        :actions="user.actions" @select="user.onSelect">
                                        <template #reference>
                                            <van-button type="primary">操作</van-button>
                                        </template>
                                    </van-popover>
                                </van-col>

                            </van-row>
                        </div>
                    </div>

                </van-tab>
                <van-tab title="商品管理">
                    <div class="body">
                        <van-search v-model="goodsSearchText"></van-search>
                        <div v-for="item in showGoods">
                            <van-row
                                style="height: 4rem; border-radius: 0px; background: #FFF; margin: 5px 0; align-items: center;">
                                <van-col span="2">

                                </van-col>
                                <van-col span="17">
                                    <div>{{ item.goods_name }}({{ item.goods_id }})</div>
                                </van-col>

                                <van-col span="5">
                                    <van-popover v-if="item.actions?.length > 0" v-model:show="item.showPopover"
                                        :actions="item.actions" @select="item.onSelect">
                                        <template #reference>
                                            <van-button type="primary">操作</van-button>
                                        </template>
                                    </van-popover>
                                </van-col>
                            </van-row>
                        </div>
                    </div>


                </van-tab>
            </van-tabs>

        </div>
    </div>
</template>


<style scoped>
van-button {
    font-size: 0.5rem;
}

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
    height: calc(100vh - var(--van-nav-bar-height) - var(--van-tabs-line-height));
    /* width: 100%; */
    /* padding: 0px 10px; */
    /* margin: 10px 0; */
    overflow: auto;
}
</style>(: { actions: { text: string; code: number; func: () => void; }[]; user_role: number; user_id: string; onSelect: (action: { func: () => void; }) => void; })(: {
                    actions: {
                        text: string; code: number; func: () =>
                            /* __placeholder__ */
                            void;
                    }[]; goods_id: string; onSelect: (
                        /* __placeholder__ */
                        action: {
                            /* __placeholder__ */
                            func: () =>
                                /* __placeholder__ */
                                void;
                        }) =>
                        /* __placeholder__ */
                        void;
                })(: { order_deal_time: string | number | Date; }): { date: string | number | Date; }: { date: string | number | Date; }

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { LeftOutlined } from '@ant-design/icons-vue';
import { showSuccessToast, showFailToast } from 'vant';
const store = useUserStore()

import { NavigationFailureType, isNavigationFailure } from 'vue-router'



defineProps<{
    msg: string
}>()

const searchtext = ref('')
const goods: any = ref()
const reports = ref()
const commentcontent = ref('')
const comments: any = ref([{ comment_content: "骗人的，大家不要信" }, { comment_content: "请审核尽快屏蔽" }])
const pics: any = ref([])
const notFound = ref(false);
function Searchresult() {

}

function showSellerinfo() {

}

const router = useRouter()


// 试图离开未保存的编辑文本界面
function back() {

    router.back()

}

let maxHeight: any = ref(0);
let maxWidth = ref(0);

onMounted(() => {
    axios.post("api/goods/getGoodsInfo", { id: router.currentRoute.value.query.goods_id })
        .then((successResponse: any) => {

            let item = successResponse.data.message[0]

            let pictureArray: { path: any; width: any; height: any; }[] = []
            try {
                let pics = item.picture_paths.split(',')
                let ws = item.picture_widths.split(',')
                let hs = item.picture_heights.split(',')
                pics.forEach((element: any, idx: any) => {
                    pictureArray.push({ path: pics[idx], width: ws[idx], height: hs[idx] })


                    if (maxHeight.value < hs[idx]) {
                        maxHeight.value = hs[idx];
                        maxWidth.value = ws[idx];
                    }

                });


                let width = document.body.clientWidth
                let srcw = maxWidth.value
                let srch = maxHeight.value
                maxHeight.value = width * srch / srcw
                // return `width: ${width}px; height: ${width * srch / srcw}px;`;




            }
            catch (e) {
                pictureArray.push({ path: null, width: 100, height: 100 })
            }

            item.goods_photos = pictureArray
            goods.value = (item)


        })
        .catch((failResponse: any) => {
            notFound.value = true;
        });

    axios.post("api/report/getReportByGoods", { report_goods: router.currentRoute.value.query.goods_id })
        .then((successResponse: any) => {
            reports.value = successResponse.data.message;
        })
        .catch((failResponse: any) => {
        });

})





function addComment() {

}

function addToCollection() {
    // alert(store.getUserID())
    axios.post("api/goods/addToCart", { goodsid: router.currentRoute.value.query.goods_id })
        .then((successResponse: any) => {
            goods.value.collected = 1;
            showSuccessToast('收藏成功！');
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });


}

function removeFromCollection() {
    // alert(store.getUserID())
    axios.post("api/goods/removeFromCart", { goodsid: router.currentRoute.value.query.goods_id })
        .then((successResponse: any) => {
            goods.value.collected = 0;
            showSuccessToast('取消成功！');
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });
}

const showReportEditor = ref(false);
const report = ref('')

const showBanEditor = ref(false);
const ban = ref('')

const confirmReport = () => {
    axios.post("api/report/reportGoods", { report_goods: router.currentRoute.value.query.goods_id, report_reason: report.value })
        .then((successResponse: any) => {
            showSuccessToast('举报成功');
            showReportEditor.value = false;
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });
}


const confirmBan = () => {
    axios.post("api/report/banGoods", { ban_goods: router.currentRoute.value.query.goods_id, ban_reason: report.value })
        .then((successResponse: any) => {
            showSuccessToast('下架成功！');
            showBanEditor.value = false;
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });
}


function formattime(time: any) {
    if (time == null) return ''
    var t = new Date(time)
    return `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${(t.getMinutes()).toString().padStart(2, '0')}`
}

const rejectReport = () => {
    axios.post("api/report/rejectReport", { ban_goods: router.currentRoute.value.query.goods_id })
        .then((successResponse: any) => {
            showSuccessToast('驳回成功！');
        })
        .catch((failResponse: any) => {
            showFailToast(failResponse.response.data.message ? failResponse.response.data.message : failResponse.message);
        });
}

</script>


<template>


    <div class="publish">
        <!-- <van-sticky> -->
        <div class="head">
            <LeftOutlined @click="back" style="margin: auto 0; font-size: 18px;" />
            <div class="portrait" @click="router.push('/userhome?user_id=' + goods?.goods_seller)">
                <img :src="'api/common/getPicture/' + goods?.user_avatar" width="45" height="45"
                    title="头像" id="head">
            </div>
            <div class="user-info">
                <div class="nick">{{ goods?.user_nickname }}</div>
                <div class="uid">

                    <span>{{ goods?.user_mysign ? goods?.user_mysign : '有个性，不签名！' }}</span>
                </div>
            </div>
        </div>
        <!-- </van-sticky> -->
        <div class="body">

            <div class="flex-between">
                <div>
                    <span style="color: red; font-weight: bold;">
                        <span>
                            ￥
                        </span>
                        <span style="font-size: 2rem;">
                            {{ goods?.goods_price.toFixed(2) }}
                        </span>
                    </span>
                    <a style="text-decoration: line-through">￥{{ goods?.goods_originprice.toFixed(2) }} </a>
                </div>
                <div style="margin: auto 0; font-size: 1.2rem; font-weight: bold; color: #ff8811;">
                    {{ goods?.goods_condition }}成新
                </div>
            </div>

            <div type="text">
                <!-- <span style="font-weight: bold;">#{{ goods?.goods_name }}</span>
                <span style="font-weight: bold;">#{{ goods?.category_name }}</span>
                {{ goods?.goods_desc }} -->


                <div style="margin: 5px;">
                    <div style="text-align: left;  height: auto;">

                        <div v-if="goods?.ban_reason != null">

                            <span style="font-weight: bold; margin: 0 0rem;">商品已下架</span>
                            <van-tag type="primary" plain>
                                {{ goods?.category_name }}
                            </van-tag>
                            <div style="white-space: pre-wrap;">下架原因：{{ goods?.ban_reason }}</div>
                        </div>
                        <div v-else>

                            <span style="font-weight: bold; margin: 0 0rem;">{{ goods?.goods_name }}</span>
                            <van-tag type="primary" plain>
                                {{ goods?.category_name }}
                            </van-tag>
                            <div style="white-space: pre-wrap;">{{ goods?.goods_desc }}</div>
                        </div>




                    </div>

                </div>


            </div>

            <div>


                <div v-if="goods?.ban_reason == null" v-masonry-tile :style="{ width: 'calc((100% - 0.45rem) / 1)' }"
                    v-for="item, index in goods?.goods_photos" :key="index" ref="goodsCard"
                    @click="router.push('/detail?goods_id=' + item.goods_id);">
                    <!-- <div style="border-radius: 5px; overflow: hidden;"> -->
                    <van-image v-if="index == 0"
                        :src="'api/common/getPicture/origin/' + item.path">
                    </van-image>
                    <!-- </div> -->
                </div>
                <div v-if="goods?.ban_reason == null" v-masonry transition-duration="0.3s" item-selector=".film-item">

                    <div v-masonry-tile :class="index == 0 ? '' : 'film-item'"
                        :style="{ width: goods?.goods_photos.length == 2 ? 'calc((100% - 0.9rem) / 1)' : 'calc((100% - 0.9rem) / 2)' }"
                        v-for="item, index in goods?.goods_photos" :key="index" ref="goodsCard"
                        @click="router.push('/detail?goods_id=' + item.goods_id);">
                        <!-- <div style="border-radius: 5px; overflow: hidden;"> -->
                        <van-image v-if="index != 0"
                            :src="'api/common/getPicture/origin/' + item.path">
                        </van-image>
                        <!-- </div> -->
                    </div>
                </div>


            </div>

            <div>
                {{ formattime(goods?.goods_listingtime) }}
            </div>


            <div v-if="store.getUser().user_role === 2" style="background: #FFFFFF; padding: 10px; margin-top: 10px;">
                <div>举报({{ reports?.length }})</div>
                <div v-for="item in reports" style="background: #F3F3F3; margin: 10px 0; padding: 10px;">
                    {{ item.report_reason }}
                </div>
                <van-button v-if="reports?.length > 0" plain type="warning" block
                    @click="rejectReport">驳回全部举报</van-button>
            </div>





        </div>
    </div>

    <van-action-bar v-if="goods?.ban_reason != null || notFound">
        <div style="text-align: center; width: 100%; color: #999;">商品已下架</div>
    </van-action-bar>

    <van-action-bar v-else-if="goods?.goods_seller == store.getUserID()">
        <div style="text-align: center; width: 100%; color: #999;">我的商品</div>
    </van-action-bar>


    <van-action-bar v-else>
        <van-action-bar-icon v-if="goods?.collected" color="red" icon="star" text="已收藏" @click="removeFromCollection" />
        <van-action-bar-icon v-else icon="star-o" text="收藏" @click="addToCollection" />
        <van-action-bar-icon icon="home-o" text="卖家" @click="router.push('/userhome?user_id=' + goods?.goods_seller)" />
        <van-action-bar-icon v-if='store.getUser().user_role === 2' icon="close" text="下架"
            @click="showBanEditor = true" />
        <van-action-bar-icon v-else icon="closed-eye" text="举报" @click="showReportEditor = true" />
        <van-action-bar-button type="danger" text="联系卖家"
            @click="router.push(`/message?fuid=${goods?.goods_seller}&gid=${goods?.goods_id}`)" />
    </van-action-bar>




    <van-popup v-model:show="showReportEditor" round position="bottom">
        <div>
            <van-nav-bar title="举报" left-text="取消" right-text="确定" @click-left="showReportEditor = false"
                @click-right="confirmReport" />

            <van-field v-model="report" rows="5" autosize label="原因" type="textarea" placeholder="请输入举报原因"></van-field>

        </div>
    </van-popup>
    <van-popup v-model:show="showBanEditor" round position="bottom">
        <div>
            <van-nav-bar title="强制下架" left-text="取消" right-text="确定" @click-left="showBanEditor = false"
                @click-right="confirmBan" />

            <van-field v-model="report" rows="5" autosize label="原因" type="textarea"
                placeholder="请输入强制下架原因"></van-field>
        </div>
    </van-popup>
</template>


<style scoped>
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
}



.publish {
    height: 90vh;
    overflow: auto;
}

.flex-between {
    display: flex;
    justify-content: space-between;
}

.head {
    display: flex;
    position: relative;
    background-color: #fff;
    /* justify-content: space-between; */

    height: 10vh;
    width: 100%;
    padding: 10px;
}


.body {
    position: relative;
    height: 80vh;
    width: 100%;
    padding: 0px 10px;
    /* margin-top: 10vh; */
    overflow: auto;
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


.portrait,
.user-info,
.collection,
.nick {
    display: inline-block;
}

.portrait {
    width: 45px;
    height: 45px;
    overflow: hidden;
    border-radius: 24px;
    background-color: #ccc;
    margin: 30px 0 0 20px;
    cursor: pointer;
    margin: auto 10px;
}

.user-info {
    margin: auto 0;
}

.nick {
    font-weight: bold;
}


.collectionwrap {
    white-space: nowrap;
    height: 30px;
    line-height: 30px;
}

.goodspic {
    width: 100%;
    height: 100%;
}

.commented {
    border-top: 1px solid #f0f0f0;
    margin-top: 10px;
    display: flex;
}

.commentarea {
    width: 579px;
    margin-top: 15px;
    margin-left: 20px;
    margin-bottom: 15px;
}

.commentuser {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
}

.commentusername {
    font-weight: bold;
    color: #379be9;
}

.commenttime {
    color: #999;
    display: inline-block;
    margin-left: 12px;
}

.commentcontent {
    margin-top: 2px;
    font-size: 14px;
    color: #4b4b4b;
    line-height: 24px;
    word-wrap: break-word;
}
</style>





<style lang="scss" scoped>
.film-item {
    margin: 0 0.15rem;
}
</style>

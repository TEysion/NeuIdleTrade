<script setup lang="ts">
import { ref, getCurrentInstance, inject } from 'vue';
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { AppstoreAddOutlined, LeftOutlined } from '@ant-design/icons-vue';
import { onActivated } from 'vue';
const store = useUserStore()
defineProps<{
    msg: string
}>()

const searchtext = ref('')
const goods: any = ref([])
const listContainer = ref()
const firstLoadingState = ref(0)
const error = ref(false)
import { onMounted, onBeforeUnmount, onUpdated, nextTick } from 'vue';
import router from '@/router';
import { isEmptyBindingElement } from 'typescript';
import { computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router';
const filmList: any = ref([])
const loading = ref(false)
const finished = ref(false)
const curPage = ref(1)
const filmsTotal = ref(0)
const showPicker = ref(false)
const categorys = ref([{ text: '杭州', value: 'Hangzhou' },
{ text: '宁波', value: 'Ningbo' },
{ text: '温州', value: 'Wenzhou' },
{ text: '绍兴', value: 'Shaoxing' },
{ text: '湖州', value: 'Huzhou' }])
const search = ref();

const value1 = ref(0);
const value2 = ref('a');
const option1 = ref([
    { text: '全部商品', value: 0 },
    { text: '新款商品', value: 1 },
    { text: '活动商品', value: 2 },
]);
const option2 = ref([
    { text: '默认排序', value: 'a' },
    { text: '好评排序', value: 'b' },
    { text: '销量排序', value: 'c' },
]);

function onSearch() {
    let a = router.replace('/searchresult?searchtext=' + searchtext.value)
}

function showSellerinfo() {

}
const itemWidth = ref('calc((100% - 2rem) / 2)')



function createRangeArray(gotten: number[]) {
    // 首先对数组进行排序
    gotten.sort((a: number, b: number) => a - b);

    // 创建范围数组
    const rangeArray: number[][] = [];
    if (gotten.length === 0)
        return rangeArray;
    let start = gotten[0];
    let end = gotten[0];

    for (let i = 1; i < gotten.length; i++) {
        if (gotten[i] === end + 1) {
            // 当前数字与前一个数字连续，则更新范围的结束数字
            end = gotten[i];
        } else {
            // 当前数字与前一个数字不连续，则将当前范围加入范围数组，并更新起始和结束数字
            rangeArray.push([start, end]);
            start = gotten[i];
            end = gotten[i];
        }
    }

    // 将最后一个范围加入范围数组
    rangeArray.push([start, end]);

    return rangeArray;
}


onMounted(() => {
    search.value.focus();
})

const goodsCard = ref([])

const observer = ref() // Intersection Observer 实例


// 防抖动
function debounce0(func: { apply: (arg0: null, arg1: any[]) => void; }, delay: number | undefined) {
    let timerId: number | undefined;

    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}

// 防抖函数
function debounce(fn: { (entries: any[]): void; call?: any; }, delay = 500) {

    // let timer: number | null | undefined = null;
    return function (...args: any) {
        //   if (timer) clearTimeout(timer);
        //   timer = setTimeout(() => {
        //     // fn.call(null, args);
        fn.apply(null, args);
        //   }, delay);
    };
    // fn.apply(null, args);
}


function initIntersectionObserver() {
    if (observer.value) {
        observer.value.disconnect();
    }

    const handleIntersection = debounce((entries: any[]) => {
        // 处理 Intersection Observer 回调的逻辑
        entries.forEach((entry: { isIntersecting: any; target: any; }) => {
            if (entry.isIntersecting && !finished.value) {
                loadImage(entry.target);
            }
        });
    }, 200); // 设置防抖动的延迟时间


    observer.value = new IntersectionObserver(handleIntersection);

    const lazyImages = document.querySelectorAll('#lazyimage');
    // alert(lazyImages.length)
    lazyImages.forEach((image) => {
        // if(image.getAttribute('srcdata'))
        observer.value.observe(image);
    });

}

// const loadNum = ref(0)
function loadImage(image: any) {
    // 加载图片的逻辑

    if (image.getAttribute("srcdata"))
        image.src = 'api/common/getPicture/' + image.getAttribute("srcdata")
    adjustMasonryLayout()
    // loadNum.value++
    // }, 0);
}

onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
})


function generateBlankSrc(width: number, height: number) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const canvasWidth = width;
    const canvasHeight = height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    (context as any).fillStyle = '#ffffff'; // 设置背景颜色为白色
    (context as any).fillRect(0, 0, canvasWidth, canvasHeight);

    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
}

const container = ref()
const masonryID = 123
const redraw = inject('redrawVueMasonry') as any;
function adjustMasonryLayout() {
    nextTick(() => {
        const masonry = container.value;
        // redraw();

    });
}

const goodsPicStyles = computed(() => {
    return goodsCard.value.map((parentContainer, idx) => {
        // const width = (parentContainer as any).width * 2;
        // const height = (parentContainer as any).height * 2;
        let doc = parentContainer as any
        let width = doc.clientWidth
        let srcw, srch;
        if (goods.value[idx].goods_photos.length > 0) {
            srcw = goods.value[idx].goods_photos[0].width
            srch = goods.value[idx].goods_photos[0].height
        }
        return `width: ${width}px; height: ${width * srch / srcw}px;`;


        // return {
        //     width: `${width}px`,
        //     height: `${height}px`
        // };
    });
})

const goodsPicSize = computed(() => {
    return goodsCard.value.map((parentContainer, idx) => {
        // const width = (parentContainer as any).width * 2;
        // const height = (parentContainer as any).height * 2;
        let doc = parentContainer as any
        let width = doc.clientWidth
        let srcw, srch;
        if (goods.value[idx].goods_photos.length > 0) {
            srcw = goods.value[idx].goods_photos[0].width
            srch = goods.value[idx].goods_photos[0].height
        }
        return { width: width, height: width * srch / srcw };


        // return {
        //     width: `${width}px`,
        //     height: `${height}px`
        // };
    });
})

</script>


<template>


<!-- 
    <van-nav-bar left-arrow @click-left="router.go(-1);">
        <template #left>
            <van-search ref="search" v-model="searchtext" show-action placeholder="请输入搜索关键词" @search="onSearch">
                <template #action>
                    <div style="display: flex; justify-content: center; align-items: center; margin: 0 20px 0 0">
                        <div @click="onSearch">搜索</div>
                    </div>
                </template>

            </van-search>
        </template>
    </van-nav-bar> -->


    <!-- <div style="height: 10vh; background-color: #ff3"> -->
    <van-row style="height: 10vh; background-color: #fff; align-items: center;"  gutter="0">
        <van-col span="2" style="align-items: center; text-align: center;">
            <!-- <LeftOutlined @click-left="router.go(-1);"></LeftOutlined> -->
            <van-icon name="arrow-left" size="20"  @click="router.go(-1);"/>
        </van-col>
        <van-col span="21">
            <van-search ref="search" v-model="searchtext" show-action placeholder="请输入搜索关键词" @search="onSearch">
                <template #action>
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <div @click="onSearch">搜索</div>
                    </div>
                </template>

            </van-search>
        </van-col>

    </van-row>


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
    /* background-color: #f3f3f3; */
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
    /* padding: 0px 10px; */
    padding-top: 10vh;
    overflow: auto;
}



h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
}

h3 {
    font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {

    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}

.card {
    display: flex;
    flex-wrap: wrap;
}

.card div {
    background-color: #0c9;
    width: 50%;
    /* 每列宽度为 50% */
    box-sizing: border-box;
    padding: 10px;
}

.card img {
    border-radius: 5px;
    width: 100%;
    height: 80%;
    border: none;
}

.card name {
    display: inline-block;
    width: 30px;
    margin: 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
}

.card info_bottom {
    height: 24px;
    display: block;
}

.card info_bottom:after {
    width: 0;
    height: 0;
    display: block;
    clear: both;
    content: "";
}

.price_info,
.user_info {
    height: 24px;
    display: inline-block;
}

.user_info {
    float: left;
}

.price_info {
    vertical-align: top;
    float: right;
}

.headpic1 {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    border: none;
}

.price_info img {
    width: 18px;
    height: 18px;
    border: none;
}

.user_name {
    color: rgb(114, 113, 118);
    font-size: 13px;
    vertical-align: top;
    line-height: 24px;
    height: 24px;
    display: inline-block;
    cursor: pointer;
}

.user_name:hover {
    color: orangered;
}

.oldprice {
    color: #777;
    font-size: 12px;
}

.price {
    color: #2c2c2c;
    font-size: 21px;
    line-height: 24px;
    font-weight: bold;
    height: 24px;
    display: inline-block;
    margin-left: 3px;
}

.sellerinfo {
    border: 3px solid #0c9;
    height: 100px;
    width: 200px;
    position: relative;
    top: -142px;
    left: 10px;
    background: #fff;
    opacity: 0.7;
    display: none;
}

.triangle1 {
    height: 15px;
    width: 15px;
    display: block;
    position: absolute;
    top: 97px;
    left: 30px;
    border-width: 15px;
    border-style: solid dashed dashed;
    border-color: #0c9 transparent transparent;
    font-size: 0;
    line-height: 0;
}

.triangle2 {
    display: block;
    position: absolute;
    border-width: 17px;
    top: 90px;
    left: 29px;
    border-style: solid dashed dashed;
    border-color: #fff transparent transparent;
    font-size: 0;
    line-height: 0;
}

.user_info img {
    cursor: pointer;
}

.qwe {
    display: flex;
}

.sellerhead {
    height: 60px;
    width: 60px;
    margin-top: 5px;
    margin-left: 5px;
    display: inline-block;
}

.headpic2 {
    height: 60px;
    widows: 60px;
    border-radius: 30px;
}

.sellerinfo1 {
    height: 60px;
    width: 111px;
    display: inline-block;
    margin-left: 10px;
    margin-top: 5px;
    font-size: 12px;
}

.sellerinfo1 p {
    margin: 3px auto;
}

.sellerinfo2 {
    height: 24px;
    line-height: 24px;
    text-align: center;
    width: 185px;
    margin: 2px auto;
    font-size: 12px;
}
</style>




<style lang="scss" scoped>
.van-cell {
    padding: 0.25rem 0.3rem 0.25rem 0.3rem;
}

.film-item {
    background: white;
    margin: 0.5rem;
    width: calc((100% - 2rem) / 2);
    border-radius: 0.35rem;
    box-shadow: 0 0 0 0.05rem #e7e7e7;

    img {
        width: 100%;
        object-fit: cover;
        border-radius: 0.35rem 0.35rem 0rem 0rem;
    }

}
</style>

<script setup lang="ts">
import { ref, getCurrentInstance, inject } from 'vue';
import axios from 'axios'
import { useUserStore } from '../stores/user'
import { AppstoreAddOutlined } from '@ant-design/icons-vue';
import { onActivated } from 'vue';
const store = useUserStore()
defineProps<{
    msg: string
}>()

const searchtext = ref('')

const listContainer = ref()
const firstLoadingState = ref(0)
const error = ref(false)
import { onMounted, onBeforeUnmount, onUpdated, nextTick } from 'vue';
import router from '@/router';
import { computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router';
const filmList: any = ref([])
const loading = ref(false)
const finished = ref(false)

const showPicker = ref(false)


const value1 = ref(0);
const value2 = ref('a');
const option1: any = ref([]);



const goods: any = computed(() => {
    if (value1.value == 0) {
        return goodsSrc.value;
    }
    let ans = [];
    for (let item of goodsSrc.value) {
        if (item.goods_category == value1.value) {
            ans.push(item);
        }
    }
    return ans;
})



onBeforeRouteUpdate(() => {
    // alert(0)


})


onActivated(() => {
    showPicker.value = false;
    listContainer.value.scrollTo({ top: scrollTop.value })

})

let gotten: number[] = []

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


function loadData() {
    let excludeArray = createRangeArray(gotten)
    let number = 8;
    axios.post("api/goods/getGoodsList", { classifyid: 0, searchtext: router.currentRoute.value.query.searchtext, excludes: excludeArray, number: number })
        .then((successResponse: any) => {

            if (successResponse.data.message.length < number) {
                finished.value = true;
            }
            successResponse.data.message.forEach((item: any) => {

                gotten.push(item.goods_id)
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
                }
                item.goods_photos = pictureArray
                goodsSrc.value.push(item)
            });
            init()
            firstLoadingState.value = 1
            loading.value = false;
        })
        .catch((failResponse: any) => {
            
            firstLoadingState.value = 2
            error.value = true;
            loading.value = false;

            if (failResponse.response.data.code === 40005) {
                if (!jumped) {
                    alert("登录超时，请重新登录");
                    router.push('/login');
                }
            }

        });
}



const options = ref();
let jumped = false;
onMounted(() => {
    if (!store.loadLocal()) {
        jumped = true;
        router.push('/login');
        return;
    }
    if (store.getUser().user_role === -2) {
        jumped = true;
        router.push('/sysmanage');
        return;

    }
    searchtext.value = router.currentRoute.value.query.searchtext as any


    axios.post("api/goods/getCategory", {})
        .then((successResponse: any) => {

            options.value = successResponse.data.message;
            successResponse.data.message.forEach((item: { category_name: any; category_id: any; }) => {
                option1.value.push({ text: item.category_name, value: item.category_id });
            });
        })
        .catch((failResponse: any) => {

        });


})


onUpdated(() => {
    // alert('up')
    console.log('up')
    // nextTick(initIntersectionObserver)
    // alert(0)
    setTimeout(() => {
        adjustMasonryLayout();
    }, 0);

})

const scrollTop = ref(0)
onBeforeRouteLeave(() => {
    // alert("bl")
    scrollTop.value = (listContainer.value.scrollTop)


})

// onBeforeRouteUpdate(()=>{
//     alert('bu')
// })

async function init() {
    await nextTick()
    initIntersectionObserver()
}


function onLoad(this: any) {
    if (loading.value == true) {
        return;
    }
    loading.value = true;



    let excludeArray = createRangeArray(gotten)
    setTimeout(() => {
        loadData();

    }, 1000);


}


function addNewFilmItems(newFilmList: any) {
    return filmList.value.concat(newFilmList);
}

// function filteredActors(actors: any[], index: any) {
//     const actorsName = actors.map((item: { name: any; }) => {
//         return item = item.name;
//     });

//     return actorsName.join(' ');
// }


const goodsCard = ref([])

const observer = ref() // Intersection Observer 实例

const goodsSrc: any = ref([])
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
        redraw();

    });
}

// const goodsPicStyle = computed((idx: number) => {
//     let doc = goodsCard.value[idx] as any
//     if (doc) {
//         let width = doc.clientWidth
//         let srcw = goods.value[idx].goods_photos[0].width
//         let srch = goods.value[idx].goods_photos[0].height
//         return `width: ${width}px; height: ${width * srch / srcw}px;`;
//     }
//     return ``;
// })

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

const onSearch = (text: string) => {
    // showPicker.value = false;
    nextTick(() => {
        setTimeout(() => {
            router.push('/searchresult?searchtext=' + text);
        }, 0);
    })

}

const onCategoryButtonClicked = () => {

}



</script>


<template>

    <van-row style="height: 10vh; background-color: #fff; align-items: center;" justify="space-around">
        <van-col span="6">
            <div
                style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 1.2rem;">
                东大闲易
            </div>
        </van-col>
        <van-col span="16">
            <van-search v-model="searchtext" show-action placeholder="搜索" @click="router.push('./search')">
                <template #action>
                </template>
            </van-search>
        </van-col>
        <van-col span="2">
            <div style="font-size: 22px; margin: auto">
                <!-- <AppstoreAddOutlined @click="showPicker = true" /> -->
                <van-icon @click="showPicker = true" name="list-switch" />
                <!-- list-switch -->
            </div>
        </van-col>
    </van-row>


    <div>

        <div style="height: calc(90vh - var(--van-tabbar-height)); position: relative; overflow: auto;"
            ref="listContainer">

            <van-list :loading="loading" v-model:error="error" :finished="finished" finished-text="我是有底线的"
                @load="onLoad" :immediate-check="true">
                <template #loading>
                    <van-loading style="margin: 20px" vertical>
                        <template #icon>
                            <van-icon name="star-o" size="30" />
                        </template>
                        商品加载中...
                    </van-loading>
                </template>

                <template #error>
                    <van-empty image="network" description="无法连接服务器" />
                </template>

                <div v-masonry transition-duration="0s" item-selector=".film-item" class="masonry">
                    <div v-masonry-tile class="film-item" v-for="(item, index) in goods" :key="item.id" ref="goodsCard"
                        @click="router.push('/detail?goods_id=' + item.goods_id);">
                        <div :style="goodsPicStyles[index]" style="border-radius: 5px; overflow: hidden;">
                            <van-image v-if="item.goods_photos.length > 0" :width="goodsPicSize[index]?.width"
                                :height="goodsPicSize[index]?.height"
                                :src="'api/common/getPicture/' + item.goods_photos[0].path"
                                :goods-idx="index" lazy-load></van-image>
                        </div>

                        <div style="margin: 5px;">
                            <div style="text-align: left;  height: auto;
  display:-webkit-box;
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis;/*隐藏后添加省略号*/
  -webkit-box-orient:vertical; 
  -webkit-line-clamp:3;">
                                <van-tag type="primary" plain>
                                    {{ item.category_name }}
                                </van-tag>
                                <van-tag v-if="item.goods_seller==store.getUserID()" type="warning" plain>
                                    我的商品
                                </van-tag>
                                <span style="font-weight: bold; margin: 0 0.5rem;">{{ item.goods_name }}</span>
                                <span>{{ item.goods_desc }}</span>
                            </div>
                            <div style="text-align: left;">
                                <span style="color: red; font-weight: bold;">
                                    <span>￥</span>
                                    <span style="font-size: 1.2rem;">
                                        {{ item.goods_price.toFixed(2) }}
                                    </span>
                                </span>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </van-list>
        </div>
    </div>

    <van-tabbar>
        <van-tabbar-item active icon="hot-o" @click="router.replace('/home')">推荐</van-tabbar-item>
        <van-tabbar-item icon="add-o" @click="router.replace('/publish')">发布</van-tabbar-item>
        <van-tabbar-item icon="friends-o" @click="router.replace('/friends')">消息</van-tabbar-item>
        <van-tabbar-item icon="contact-o" @click="router.replace('/mine')">我的</van-tabbar-item>
    </van-tabbar>


    <!-- <transition name="slide"> -->
        <van-popup v-model:show="showPicker" position="right"
            :style="{ width: '80%', height: '100%' }">
            <van-nav-bar title="选择类别" @click-left="showPicker = false">
                <template #left>
                    <van-icon name="cross" size="18" />
                </template>
            </van-nav-bar>
            <div>
                <van-button v-for="item in option1" :title="item.text" block style="margin: 10px 0;"
                    @click="onSearch(item.text)">
                    {{ item.text }}
                </van-button>
            </div>
        </van-popup>
    <!-- </transition> -->



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

.masonry {
    margin: 0 0.15rem;
}

.film-item {
    background: white;
    margin: 0.15rem;
    width: calc((100% - 0.9rem) / 2);
    border-radius: 0.35rem;
    box-shadow: 0 0 0 0.05rem #e7e7e7;
}
</style>

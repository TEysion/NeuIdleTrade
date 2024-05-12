<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user'
import { message } from 'ant-design-vue';
// import pica from 'pica';
const store = useUserStore()

defineProps<{
    msg: string
}>()

const goodsname = ref('')
const options: any = ref([])
const uploads: any = ref([])
const priceValue = ref('')
const recommend = ref('')
const columns: any = ref([]);
const inputID = ref(0)
const pickerValue = ref("");
const form = ref({ price: '0', originPrice: '0', condition: 0, category: 0 })
const formTemp = ref({ price: '0', originPrice: '0', condition: 0, category: 0 })
const showPicker = ref(false)
const showPriceEditor = ref(false);


const router = useRouter()

function addGoods() {
    var param = new FormData();
    for (var i = 0; i < uploads.value.length; i++) {
        if (uploads.value[i] != null) {
            param.append('file', uploads.value[i].file, uploads.value[i].file.name);
        }
    }

    param.append('goodsname', goodsname.value);
    param.append('oldprice', form.value.originPrice as any);
    param.append('price', form.value.price as any);
    param.append('goodstype', form.value.category as any);
    param.append('goodsnewold', form.value.condition as any);
    param.append('recommend', recommend.value);

    axios.post("/api/goods/addGoods", param, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((successResponse: any) => {
            message.success('商品发布成功');
            setTimeout(function () {
                router.push('/home');
            }, 1000);
        })
        .catch((failResponse: any) => {
            message.warn(failResponse.response.data.message);
        });
}

function addImg() {

    var reader = new FileReader();
    var f = (document.querySelectorAll("#upload")[0] as any).files[0];

    reader.readAsDataURL(f);
    reader.onload = function () {
        uploads.value.push({ file: f, src: this.result })

    };

}

function chooseImg() {
    (document.querySelectorAll("#upload")[0] as any).click();
}




function onClose(confirm = false) {
    inputID.value = 0
    if (confirm == true) {
        form.value.category = formTemp.value.category
        form.value.condition = formTemp.value.condition
        form.value.originPrice = formTemp.value.originPrice
        form.value.price = formTemp.value.price
    }
}

function confirmPrice() {
    form.value.originPrice = formTemp.value.originPrice
    form.value.price = formTemp.value.price
    showPriceEditor.value = false;
    priceValue.value = `￥${formTemp.value.price}`
}



onMounted(() => {
    axios.post("api/goods/getCategory", {})
        .then((successResponse: any) => {

            options.value = successResponse.data.message;
            successResponse.data.message.forEach((item: { category_name: any; category_id: any; }) => {
                columns.value.push({ text: item.category_name, value: item.category_id });
            });
        })
        .catch((failResponse: any) => {

        });

})

const active = ref(1)


const onConfirm = ({ selectedOptions }: any) => {
    showPicker.value = false;
    pickerValue.value = selectedOptions[0].text;
    form.value.category = selectedOptions[0].value;
    showPicker.value = false;
};


const onInput = (value: string) => {
    if (focused.value == 0) {
        if (Number(formTemp.value.price) === 0) {
            formTemp.value.price = value;
        }
        else {
            formTemp.value.price += '' + value;
        }
    }
    else if (focused.value == 1) {
        if (Number(formTemp.value.originPrice) === 0) {
            formTemp.value.originPrice = value;
        }
        else {
            formTemp.value.originPrice += '' + value;
        }
    }
}

const onDelete = () => {
    if (focused.value == 0) {
        let priceString = formTemp.value.price;
        priceString = priceString.substring(0, priceString.length - 1);
        if (priceString.length == 0)
            priceString = '0.00';
        formTemp.value.price = priceString;
    }
    else if (focused.value == 1) {
        let priceString = formTemp.value.originPrice;
        priceString = priceString.substring(0, priceString.length - 1);
        if (priceString.length == 0)
            priceString = '0.00';
        formTemp.value.originPrice = priceString;
    }
}

const focused = ref(0)

const conditionValue = ref('')
const showConditionEditor = ref(false)

const confirmCondition = () => {
    form.value.condition = formTemp.value.condition;
    conditionValue.value = form.value.condition + "成新";
    showConditionEditor.value = false;
}
</script>


<template>
    <div class="publish">

        <div class="head">
            <a>发闲置</a>
            <button @click="addGoods">发布</button>
        </div>

        <div class="body">
            <div class="describ">
                <input type="text" placeholder="商品名" v-model="goodsname">
                <HR width="100%" color=#f3f3f3 SIZE=3>
                </HR>
                <textarea type="text" placeholder="商品描述" v-model="recommend"></textarea>

                <div class="goodspic">
                    <img v-for="pic in uploads" class="picimg" :src="pic.src">
                    <input type="file" id="upload" @change="addImg" style="display:none;" accept="image/*">
                    <img class="picimg" src="/public/addphoto.png" style="display: inline-block" @click="chooseImg">
                    <p>好图片更吸引人</p>
                </div>
            </div>

            <div class="card">
                <ul>

                    <van-cell-group style="border-radius: 15px; overflow: hidden;">

                        <van-field v-model="pickerValue" is-link readonly label="商品类别" placeholder="选择类别"
                            input-align="right" @click="showPicker = true" />
                        <van-popup v-model:show="showPicker" round position="bottom">
                            <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
                        </van-popup>

                        <van-field v-model="priceValue" is-link readonly label="商品价格" placeholder="0.00"
                            input-align="right" @click="showPriceEditor = true"></van-field>

                        <van-popup v-model:show="showPriceEditor" round position="bottom">
                            <div>
                                <van-nav-bar title="商品价格" left-text="取消" right-text="确定"
                                    @click-left="showPriceEditor = false" @click-right="confirmPrice" />

                                <!-- <div>好的价格更能吸引买家</div> -->


                                <van-cell-group inset>
                                    <van-cell @click="focused = 0" :title="`价格`">
                                        <div :style="{ background: focused === 0 ? '#c7e2ff' : '' }"
                                            style="color: #000;">
                                            ￥{{
                                                formTemp.price }}</div>
                                    </van-cell>
                                    <van-cell @click="focused = 1" :title="`原价`">
                                        <div :style="{ background: focused === 1 ? '#c7e2ff' : '' }"
                                            style="color: #000;">
                                            ￥{{
                                                formTemp.originPrice }}</div>
                                    </van-cell>
                                </van-cell-group>


                                <div style="height: 50vh;">

                                </div>

                                <!-- <van-number-keyboard :show="showPriceEditor" theme="custom" extra-key="." @blur=""
                                @input="onInput" @delete="onDelete" /> -->
                                <van-number-keyboard :show="showPriceEditor" extra-key="." @input="onInput"
                                    @delete="onDelete" />
                            </div>

                        </van-popup>


                        <van-field v-model="conditionValue" is-link readonly label="商品成色" placeholder="成色"
                            input-align="right" @click="showConditionEditor = true"></van-field>

                        <van-popup v-model:show="showConditionEditor" round position="bottom">
                            <div>
                                <van-nav-bar title="商品成色" left-text="取消" right-text="确定"
                                    @click-left="showConditionEditor = false" @click-right="confirmCondition" />

                                <van-slider v-model="formTemp.condition" :min="1" :max="10" :step="1" style="margin: 100px 10vw; width: 80vw;">
                                    <template #button>
                                        <div class="custom-button">{{ formTemp.condition }}成新</div>
                                    </template>
                                </van-slider>


                            </div>

                        </van-popup>

                    </van-cell-group>

                </ul>
            </div>

        </div>
    </div>


    <a-drawer title="请输入" :width="50" :open="inputID != 0" placement="bottom" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'bottom' }" @close="onClose">
        <ul v-if="inputID == 1">
            <li style="display: flex;">
                <a style="margin: auto 0;">价格</a>
                <a-input-number v-model:value="formTemp.price"
                    :formatter="(value: any) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value: string) => value.replace(/￥\s?|(,*)/g, '')" />
            </li>
            <li style="display: flex;">
                <a style="margin: auto 0;">原价</a>
                <a-input-number v-model:value="formTemp.originPrice"
                    :formatter="(value: any) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="(value: string) => value.replace(/￥\s?|(,*)/g, '')" />
            </li>
        </ul>

        <div v-if="inputID == 2">
            <a style="margin: auto 0;">成色</a>
            <a-input-number v-model:value="formTemp.condition" :min="0" :max="10"
                :formatter="(value: any) => `${value}成新`" :parser="(value: string) => value.replace('成新', '')" />
        </div>


        <div v-if="inputID == 3">
            <select class="form-control" v-model="formTemp.category">
                <option value="">请选择商品类别</option>
                <option :value="item.category_id" v-for="item in options">{{ item.category_name }}</option>
            </select>
        </div>


        <template #extra>
            <a-space>
                <a-button @click="onClose(true)">确定</a-button>
            </a-space>
        </template>
    </a-drawer>

    <van-tabbar v-model="active">
        <van-tabbar-item icon="hot-o" @click="router.replace('/home')">推荐</van-tabbar-item>
        <van-tabbar-item icon="add-o" @click="router.replace('/publish')">发布</van-tabbar-item>
        <van-tabbar-item icon="friends-o" @click="router.replace('/friends')">消息</van-tabbar-item>
        <van-tabbar-item icon="contact-o" @click="router.replace('/mine')">我的</van-tabbar-item>
    </van-tabbar>
</template>


<style scoped>

.custom-button {
    /* width: 26px; */
    color: #fff;
    font-size: 10px;
    /* line-height: 18px; */
    text-align: center;
    background-color: var(--van-primary-color);
    border-radius: 100px;
    padding: 10px;
    display: inline-block;
    white-space: nowrap;
  }
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
    /* position: absolute; */
    /* right: 0; */
}

.body {
    position: relative;
    /* margin-top: 10px; */
    /* top: 10%; */

    height: 90vh;
    width: 100%;
    padding: 0px 10px;
    padding-top: 10vh;
    overflow: auto;
}



.publish option {
    background-color: #00bc9b;
    height: 100%;
    width: 100%;
}

.describ {
    padding: 20px 10px;
    margin: 10px 0px;
    background: rgb(255, 255, 255);
    border-radius: 10px;
}

.card {
    padding: 0px 0px;
    margin: 10px 0;
    background: rgb(255, 255, 255);
    border-radius: 10px;
}

.describ input {
    background: transparent;
    /* font-weight: bold; */
    font-size: 1rem;
    display: block;
    border: none;
    width: 100%;
}


.describ input:focus {
    /* background-color: red; */
    border-radius: 3px;
    border: 0;
    outline: 0px solid aqua;
    /* box-shadow: 1px 1px 10px 1px aqua; */
}


.describ textarea {
    background: transparent;
    width: 100%;
    height: 30vh;
    /* font-weight: bold; */
    font-size: 1rem;
    display: block;
    border: none;
}

.describ textarea:focus {
    /* background-color: red; */
    border-radius: 3px;
    border: 0;
    outline: 0px solid aqua;
    /* box-shadow: 1px 1px 10px 1px aqua; */
}


.listitem {
    display: flex;
    justify-content: space-between;
}

.input_div {
    width: 600px;
    margin: 0 auto;
}

.input_top {
    font-weight: bold;
    border: 1px solid #c8c8c8;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    margin-bottom: 1px;
}

.input_bottom {
    font-size: 14px;
    border: 1px solid #c8c8c8;
    border-radius: 0 0 4px 4px;
    background-color: #f5f5f5;
    width: 100%;
    padding: 4px 0 4px 15px;
    height: 120px;
    box-sizing: border-box;
    margin-top: 1px;
}

.input_middle {
    border: 1px solid #c8c8c8;
    border-radius: 0;
    border-bottom: none;
    margin-bottom: 1px;
}

.input_normal {
    background-color: #f5f5f5;
    width: 100%;
    padding: 4px 0 4px 15px;
    height: 50px;
    box-sizing: border-box;
}

.publish_button {
    display: block;
    font-size: 18px;
    color: #fff;
    background: #00bc9b;
    border: none;
    border-radius: 5px;
    outline: none;
    width: 300px;
    height: 43px;
    line-height: 43px;
    margin: 30px auto;
    cursor: pointer;
}

.publish_button:hover {
    background: green;
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
</style>: FormData: { name: any; }: Blob | MediaSource(: any)

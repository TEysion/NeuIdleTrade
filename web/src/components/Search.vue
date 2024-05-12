<script setup lang="ts">
import { ref } from 'vue';

import { useUserStore } from '../stores/user'

defineProps<{
    msg: string
}>()

const searchtext = ref('')


import { onMounted, onBeforeUnmount } from 'vue';
import router from '@/router';



const search = ref();


function onSearch() {
    let a = router.replace('/searchresult?searchtext=' + searchtext.value)
}



onMounted(() => {
    search.value.focus();
})



const observer = ref() // Intersection Observer 实例



onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
})




</script>


<template>

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
</style>




<style lang="scss" scoped>
</style>

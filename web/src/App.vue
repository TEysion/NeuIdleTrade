<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useUserStore } from './stores/user'
import { useCounterStore } from './stores/counter'
import { ref, onMounted } from 'vue'
const store = useUserStore()
const countStore = useCounterStore()




store.update();


const version = 'v1.0.0'

import { showDialog } from 'vant';

if (localStorage.getItem('idletrade_version') !== version)
  showDialog({
    title: '欢迎使用',
    message: `<div>你好，欢迎体验<span style='font-weight:bold;'> 东大闲易${version}</span>，<br>本软件为2024年软件工程大作业，<br>体验帐号：<br><b style='color:red'>普通用户：20240002 密码：neu20240002<br>管理员：20240001 密码：neu20240001</b><br>开发组成员：<br>庄志宇、葛政锟、汪飞、赖泓峰、王宇暄<br>项目地址：<a href='https://github.com/TEysion/NeuIdleTrade'>https://github.com/TEysion/NeuIdleTrade</a></div>`,
    confirmButtonText: '不再显示',
    // cancelButtonText: '不再显示',
    // showCancelButton: true,
    cancelButtonColor: '#aaa',
    allowHtml: true,
    // theme: 'round-button'
  }).then(() => {
    // on confirm
    localStorage.setItem('idletrade_version', version);
  })
    .catch(() => {
      // on cancel
      localStorage.setItem('idletrade_version', version);
    });


onMounted(() => {
  

  if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        // isMobile.value = true // 移动端
    } else {
        // isMobile.value = false; // PC端
        alert("本网站专为移动端开发，使用手机访问体验更佳哦")
    }
})


</script>

<template>

  <router-view v-slot="{ Component }">
    <!-- <transition name="fade"> -->
    <keep-alive include="Home">
      <component :is="Component" :key="countStore.count" class="rt"/>
    </keep-alive>
    <!-- </transition> -->
  </router-view>




</template>

<style scoped>



.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #acd5ff;
  width: 100%;
  height: 10%;
  padding: 10px;
  position: absolute;
  bottom: 0;
}

.toolbar ul {
  width: 100%;
}

.toolbar li {
  width: 33%;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  color: white;
  /* background: #456789; */
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  overflow: auto;
  position: absolute;
  top: 0%;
  bottom: 0%;
  /* background: #111222; */
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

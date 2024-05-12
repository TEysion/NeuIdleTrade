<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from '../router'
const logining = ref(false)
const account = ref('')
const password = ref('')
const tip = ref("")

import { useUserStore } from '../stores/user'
import { useCounterStore } from '../stores/counter'
const countStore = useCounterStore()
const store = useUserStore()
onMounted(() => {
    init();
});

function init() {
    function keydownFn(e: any) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            login();
        }
    }
    document.getElementById('mform')?.addEventListener('keydown', keydownFn);
}


function login() {
    tip.value = "请稍侯..."

    axios.post('api/user/login'
        , {
            id: account.value,
            password: password.value,
        })
        .then((successResponse) => {

            if (successResponse.status === 200) {

                setTimeout(() => {
                    store.setUser((successResponse.data.message)[0])
                    if(store.getUser().user_role === -2) {
                        router.push('/sysmanage');
                    }
                    else {
                        countStore.increment();
                        router.push('/home');
                        
                    }
                   

                })

            }
        })
        .catch((failResponse) => {
            tip.value = failResponse.response.data.message?failResponse.response.data.message:failResponse.message;
        });
}



</script>

<template>
    <main>
        <div class="m-auto" v-if="logining"
            style="position: absolute; height: 100% ;width: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 9999; display: flex;justify-content: center; align-items: Center; ">
            <h5 style="margin: 50px 10px; color: aliceblue;">
                登录中......
            </h5>
        </div>
        <div class="page">
            <div style="text-align: center;">
                <img style="width: 8rem; height: 8rem" src="/public/favicon.ico"></img>
                <br>
                <img style="margin: 30px auto;" src="/public/neuit.svg"></img>
            </div>


            <form method="post" autocomplete="off">
                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="account" type="text" name="nickname" />
                        <div class="underline"></div>
                        <label>账号</label>
                    </div>
                </div>


                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="password" type="password" name="password" id="mform" />
                        <div class="underline"></div>
                        <label>密码</label>
                    </div>
                </div>



            </form>



            <a style="color: red;">{{ tip }}</a>
            <van-button @click="login" block type="primary">登录</van-button>
            <div class="other">
                <a>没有账号？</a>
                <a href="/register">前往注册</a>
            </div>


        </div>

    </main>
</template>



<style scoped>
main {
    background: linear-gradient(-45deg, #2332d5, #52c2ee);
    width: 100vw;
    height: 100vh;
    transition: all 0.3s ease-in-out;
    position: relative;
    animation: slide-down 0.3s ease-in-out;
}

.page {
    margin: auto;
    background-color: white;
    opacity: 0.8;
    padding: 40px;
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255);
    opacity: 0.8;
}

h1 {
    margin: 30px;
}

@keyframes slide-down {
    0% {
        opacity: 0.4;
    }

    100% {
        opacity: 0.8;
    }
}


.other {
    text-align: center;
    margin: 30px;
}



.wrapper {
    background-color: rgb(255, 255, 255);
    padding-top: 25px;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 20px;
}

.wrapper .input-data {
    width: 100%;
    height: 40px;
    position: relative;
}


.wrapper .input-data input {
    transition: all 0.3s ease;
    padding-left: 80px;
    outline: none;
    width: 100%;
    height: 100%;
    border: none;
    color: #000000;
    border-bottom: 2px solid silver;
    font-size: 17px;
    line-height: 0;
}

.input-data input:focus~label {
    transform: translateY(-30px);
    font-size: 15px;
    color: #4158D0;
}

.wrapper .input-data label {
    position: absolute;
    bottom: 10px;
    left: 0;
    color: grey;
    pointer-events: none;
    transition: all 0.3s ease;
    width: 70px;
    text-align: justify;
    text-align-last: justify;
    display: inline-block;
}

.wrapper .input-data .underline {
    position: absolute;
    bottom: 0px;
    height: 2px;
    width: 100%;
}

.input-data .underline:before {
    position: absolute;
    content: "";
    height: 100%;
    width: 100%;
    background: #4158D0;
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.input-data input:focus~.underline:before {
    transform: scaleX(1);
}

.input-data input:focus {
    transform: padding-left(0px);
    padding-left: 0px;
    color: #4158D0;
}

a:link {
    color: rgb(0, 179, 255);
}

a:visited {
    color: rgb(0, 179, 255);
}

a:active {
    color: rgb(31, 213, 110);
}
</style>
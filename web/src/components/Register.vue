<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from '../router'
const account = ref('')
const password = ref('')
const password2 = ref('')
const nickname = ref('')
const tip = ref("")

onMounted(() => {
    document.getElementById('mform')?.addEventListener('keydown', (e: any) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            register();
        }
    });
});


// 注册
function register() {
    tip.value = "请稍侯...";
    if (password.value != password2.value) {
        tip.value = "两次输入密码不一致"
        return
    }
    // 请求注册接口
    axios.post('api/user/register'
        , {
            id: account.value,
            nick: nickname.value,
            password: password.value
        })
        .then((successResponse) => {
                    setTimeout(() => {
                        router.replace('/login')
                    }, 0);

            
        })
        .catch((failResponse) => {
            tip.value = failResponse.response.data.message?failResponse.response.data.message:failResponse.message;
        });
}



</script>

<template>
    <main>
        <div class="page">
            <div style="align-items: center; text-align: center;">
                <div style="text-align: center; display: flex; align-items: center;">
                    <img style="width: 4rem; height: 4rem" src="/public/favicon.ico"></img>
                    <img style="margin: 30px auto;" src="/public/neuit.svg"></img>
                    <!-- <img style="margin: 30px auto;" src="/public/zhuce.svg"></img> -->
                </div>
                <!-- <img style="margin: 30px auto;" src="/public/zhuce.svg"></img> -->


            </div>



            <form auto-complete="new-password" autocomplete="new-password">

                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="nickname" type="text" name="nick" />
                        <div class="underline"></div>
                        <label>昵称</label>
                    </div>
                </div>

                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="account" type="text" name="nickname" />
                        <div class="underline"></div>
                        <label>账号</label>
                    </div>
                </div>

                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="password" type="password" name="password" />
                        <div class="underline"></div>
                        <label>密码</label>
                    </div>
                </div>

                <div class="wrapper">
                    <div class="input-data">
                        <input v-model="password2" type="password" name="password2" id="mform" />
                        <div class="underline"></div>
                        <label>确认密码</label>
                    </div>
                </div>
            </form>

            <a style="color: red;">{{ tip }}</a>
            <van-button @click="register" block type="primary">注册</van-button>
            <div class="other">
                <a>已有账号？</a>
                <a href="/login">前往登录</a>
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
    display: flex;
    align-items: center;
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
        /* transform: translateX(-100%); */
        opacity: 0.4;
    }

    100% {
        /* transform: translateX(0%); */
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
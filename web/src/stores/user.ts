import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export const useUserStore = defineStore('user', () => {
  // const user_id = ref("")
  let user = ref({ user_role: 0, user_id: '0', user_avatar: null, user_nickname: '' });
  let isLoaded = false;


  function setUser(newUser: any) {
    user.value = newUser;
    saveLocal();
  }

  function getUser() {
    return user.value;
  }

  function logout() {
    localStorage.removeItem("useUserStoreUser");
    user = ref({ user_role: 0, user_id: '0', user_avatar: null, user_nickname: '' });
    isLoaded = false;
    axios.post("api/user/logout")
      .then((successResponse: any) => {

      })
      .catch((failResponse: any) => {

      });
  }


  function setUserID(new_user_id: string) {
    user.value.user_id = new_user_id;
  }
  function getUserID() {
    return user.value.user_id;
  }

  function update() {
    axios.post("api/user/getUserinfo")
      .then((successResponse: any) => {
        setTimeout(() => {
          setUser(successResponse.data.message[0]);
        }, 1000);
      })
      .catch((failResponse: any) => {

      });
  }

  function saveLocal() {
    localStorage.setItem("useUserStoreUser", JSON.stringify(user.value))
  }

  function loadLocal() {
    if (isLoaded)
      return isLoaded;
    let saved = localStorage.getItem("useUserStoreUser") || null;
    if (saved) {
      try {
        user.value = JSON.parse(saved);
        isLoaded = true;
      }
      catch (e) {
        isLoaded = false;
      }
    }
    return isLoaded;
  }


  return { getUserID, getUser, setUser, setUserID, loadLocal, update, logout }
})

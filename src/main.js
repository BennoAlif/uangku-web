import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth, db } from "./firebase/index";

Vue.config.productionTip = false;

const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
  unsubscribe();
});

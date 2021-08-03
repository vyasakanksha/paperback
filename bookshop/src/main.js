import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './firebase'

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

new Vue({
  vuetify : new Vuetify(),
});

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      // store,
      vuetify: new Vuetify(),
      render: h => h(App)
    }).$mount('#app')    
  }
})

export default new Vuetify({})


import Vue from 'vue'
import App from './App.vue'
import Error from './views/errors/500.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { bgoStore, fetcher, ns, dref } from './models/bgo.js';

// console.table(dref("/partition/p1"));

fetcher.load(dref("/app")).then(
  response => {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  },
  error => {
    new Vue({
      vuetify,
      render: h => h(Error)
    }).$mount('#app')
  }
)





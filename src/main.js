import Vue from 'vue'
import App from './App.vue'
import Error from './views/errors/500.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { dref, fetcher } from './services/rdfService';

// console.table(dref("/app"));

fetcher.load(dref("/app")).then(
  response => {
    new Vue({
      router,
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





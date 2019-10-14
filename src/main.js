import Vue from 'vue'
import App from './App.vue'
import Error from './views/errors/500.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { store, dref, fetcher as fetcher2 } from './services/rdfService';

console.table(dref("/app"));

fetcher2.load(dref("/app")).then(
  response => {
    console.log ('store popolato')
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





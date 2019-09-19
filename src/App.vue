<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
      <Navigation/>
      <v-toolbar-title class="headline text-uppercase title">
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Social class="sharing" v-if="hasSocialSharing"/>
      <Option class="option" v-if="hasOptionMenu"/>
    </v-app-bar>

    <!-- CONTENT -->
    <v-content>
      <router-view />
    </v-content>

    <!-- FOOTER -->
    <Footer v-if="hasFooterMenu"/>
  </v-app>
</template>

<script>
import { bgoStore, fetcher, ns } from "./models/bgo.js";
import Navigation from "@/components/menu/Navigation.vue"
import Social from "@/components/menu/Social.vue"
import Option from "@/components/menu/Option.vue"
import Footer from "@/components/menu/Footer.vue"

export default {
  name: "App",
  components: {
    Social,
    Navigation,
    Option,
    Footer
  },
  data() {
    return {
      title: "",
      //render social menu
      hasSocialSharing: false,
      //render option menu
      hasOptionMenu: false,
      //render footer menu
      hasFooterMenu: false,
    };
  },

  mounted() {
    fetchData(this);
  }
};

function fetchData(app){

  let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
  //if domain doesn't exist go to error page
  if(!domain){
    app.$router.push("error")
  }
  //if title doesn't exist use default
  let title=bgoStore.any(domain,ns.bgo("title"));
  app.title= title? (title.value) : "LODMAP 2D";
  //
  let socialShering=bgoStore.any(domain, ns.bgo("hasSocialSharing"))
  app.hasSocialSharing = socialShering ? Boolean(Number(socialShering.value)) : false;
  //
  app.hasOptionMenu =  bgoStore.any(domain, ns.bgo("hasOptionMenu"));
  app.hasFooterMenu = bgoStore.any(domain, ns.bgo("hasFooterMenu"));
}
</script>

<style scoped>
html, body{
height: 100%;
}
.title, .shariing, .option{
  margin-left: 1em;
  margin-right: 1em;
}

</style>

<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
      <!-- NAVIGATION MENU -->
      <Navigation/>
      <!--TITLE-->
      <v-toolbar-title class="headline text-uppercase">
        <span>{{title}}</span>
      </v-toolbar-title>
      <!--SPACER-->
      <v-spacer></v-spacer>
      <!-- SOCIAL -->
      <Social v-if="hasSocialSharing"/>
      <!-- OPTION -->
      <v-menu v-if="optionItems">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">fas fa-ellipsis-v</v-icon>
        </template>
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item v-for="(el, i) in optionItems" :key="i" :href="el.path" target="_blank">
              <v-list-item-icon>
                <v-icon v-text="el.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="el.title"></v-list-item-title>
                <v-icon v-if="el.external" size="10px">fas fa-share</v-icon>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <!-- CONTENT -->
    <v-content>
      <router-view />
    </v-content>
    <!-- FOOTER -->
    <v-footer absolute class="font-weight-medium">
      <v-btn
          v-for="(el,k) in footerItems"
          :key="k"
          class="my-2"

        >
          <v-icon size="24px">{{ el.icon }}</v-icon>
          {{el.title}}
        </v-btn>

    <v-spacer></v-spacer>
    <span>{{copyright}}</span>
    </v-footer>

  </v-app>
</template>

<script>
import { bgoStore, fetcher, ns } from "./models/bgo.js";
import Navigation from "@/components/menu/Navigation.vue"
import Social from "@/components/menu/Social.vue"

export default {
  name: "App",
  components: {
    Social,
    Navigation
  },
  data() {
    return {
      //Tutte le variabili da inserire nel template saranno messe qui
      title: "",
      hasSocialSharing: false,
      //option
      optionItems: [],
      //footer
      footerItems: [],
      //copyright
      copyright: ""
    };
  },

  mounted() {
    fetchData(this);
  }
};

function fetchData(app){
  let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
  //title
  let title=bgoStore.any(domain,ns.bgo("title"));
  app.title= title? (title.value) : "LODMAP 2D";
  //social sharing
  app.hasSocialSharing = Boolean(Number(bgoStore.any(domain, ns.bgo("hasSocialSharing")).value));



  let optionMenu = bgoStore.any(domain, ns.rdf("hasOptionMenu"));
  let footerMenu = bgoStore.any(domain, ns.rdf("hasFooterMenu"));
  //option menu
  app.optionItems = getDefaultMenuItem(optionMenu);
  //footer menu
  app.footerItems = getDefaultMenuItem(footerMenu);
  //copyright
  app.copyright=bgoStore.any(domain,ns.bgo("hasCopyrigth"))
}

function getDefaultMenuItem(parent) {
  let items = [];
  if (parent) {
    bgoStore
      .any(parent, ns.bgo("withCustomMenuItems"))
      .elements.forEach(element => {
        let path = bgoStore.any(element, ns.bgo("link"));

        items.push({
          title: bgoStore.any(element, ns.bgo("title")),
          icon: bgoStore.any(element, ns.bgo("icon")).value,
          path: path.value,
          external: path.termType == "NamedNode"
        });
      });
    return items;
  } else {
    return undefined;
  }
}
</script>

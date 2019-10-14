<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
      <!-- <Navigation /> -->
      <v-toolbar-title class="headline text-uppercase title">
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <Social class="sharing" v-if="socialSheringMenu.hasIt" :title="socialSheringMenu.title" :description="socialSheringMenu.description" :hashtag="hashtsg"/> -->
      <!-- <Option class="option" v-if="optionMenu.hasIt" :optionItems="optionMenu.optionItems" /> -->
    </v-app-bar>

    <!-- CONTENT 
    <v-content>
      <router-view />
    </v-content>-->

    <!-- FOOTER -->
    <!-- <Footer v-if="footerMenu.hasIt" :footerItems="footerMenu.footerItems"/> -->
  </v-app>
</template>

<script>
import { ServiceFactory } from "@/services/ServiceFactory.js";
const AppService = ServiceFactory.get("app");
import Navigation from "@/components/menu/Navigation.vue";
import Social from "@/components/menu/Social.vue";
import Option from "@/components/menu/Option.vue";
import Footer from "@/components/menu/Footer.vue";

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
      //navigation
      navigationMenu:{},
      //option
      optionMenu:{},
      //
      socialSheringMenu:{},
      //footer
      footerMenu:{}
    };
  },
  created() {
    this.title= AppService.getTitle();
    // this.navigationMenu= AppService.getNavigationMenu();
    // this.optionMenu= AppService.getOptionMenu();
    // this.socialSheringMenu= AppService.getSocialSharingMenu();
    // this.footerMenu= AppService.getFooterMenu();
    // console.log(this.title)
    // console.log(this.optionMenu)
    // console.log(this.navigationMenu)
    // console.log(this.socialSheringMenu)
    // console.log(this.footerMenu)
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
}
.title,
.shariing,
.option {
  margin-left: 1em;
  margin-right: 1em;
}
</style>

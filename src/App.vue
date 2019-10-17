<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
      <Navigation :overview="navigationMenu.overview" :partitions="navigationMenu.partitions" :otherNavigationItem="navigationMenu.otherNavigationItems" />
      <v-toolbar-title class="headline text-uppercase title">
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Social class="sharing" v-if="socialSheringMenu.hasIt" :title="socialSheringMenu.title" :description="socialSheringMenu.description" :hashtag="socialSheringMenu.hashtag"/>
      <Option class="option" v-if="optionMenu.hasIt" :optionItems="optionMenu.optionItems" />
    </v-app-bar>

    <!-- CONTENT -->
    <v-content>
      <router-view />
    </v-content>

    <!-- FOOTER -->
    <Footer v-if="footerMenu.hasIt" :footerItems="footerMenu.footerItems" :copyright="footerMenu.copyright"/>
  </v-app>
</template>

<script>
import AppService from "@/services/appService";
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
    const appService= new AppService();
    this.title= appService.getTitle();
    this.navigationMenu= appService.getNavigationMenu();
    this.optionMenu= appService.getOptionMenu();
    this.socialSheringMenu= appService.getSocialSharingMenu();    
    this.footerMenu= appService.getFooterMenu();
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

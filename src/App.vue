<template>
  <v-app>
    <v-app-bar app light>
      <v-toolbar-title class="headline text-uppercase">
        <span>title</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <social-sharing url="variabile"
                      title="da config"
                      description="da config"
                      quote="da config"
                      hashtags="da config"
                      twitter-user="da config"
                      inline-template>
  <div>
      <network network="facebook">
        <i class="fab fa-facebook"></i>
      </network>
      <network network="linkedin">
        <i class="fab fa-linkedin"></i>
      </network>
      <network network="twitter">
        <i class="fab fa-twitter"></i>
      </network>
  </div>
</social-sharing>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
var socialSharing = require("vue-social-sharing");
export default {
  name: "App",
  components:{
    socialSharing
  },
  
  data: () => ({
    //
  })
};
</script>

<template>
  <v-dialog width="500">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">fas fa-share-alt</v-icon>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Share</v-card-title>
      <SocialSharing
        :url="getUrl"
        :title="title"
        :description="description"
        :hashtags="hashtag"
        inline-template>
      <div >
          <network network="email" class="g0v-social-link">
            <i class="fas fa-envelope"></i>
          </network>
          <network network="facebook">
            <i class="fab fa-facebook"></i>
          </network>
          <network network="line">
            <i class="fab fa-line"></i>
          </network>
          <network network="linkedin">
            <i class="fab fa-linkedin"></i>
          </network>
          <network network="odnoklassniki">
            <i class="fab fa-odnoklassniki"></i>
          </network>
          <network network="pinterest">
            <i class="fab fa-pinterest"></i>
          </network>
          <network network="reddit">
            <i class="fab fa-reddit"></i>
          </network>
          <network network="skype">
            <i class="fab fa-skype"></i>
          </network>
          <network network="twitter">
            <i class="fab fa-twitter"></i>
          </network>
          <network network="vk">
            <i class="fab fa-vk"></i>
          </network>
          <network network="weibo">
            <i class="fab fa-weibo"></i>
          </network>
          <network network="whatsapp">
            <i class="fab fa-whatsapp"></i>
          </network>
      </div>
      </SocialSharing>
      <hr>
      <div>
        <input type="text" readonly ref="url" :value="getUrl" />
        <button v-on:click="copyToClipboard()">Copy url</button>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import SocialSharing from "vue-social-sharing";
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
export default {
  name: "Social",
  components: {
    SocialSharing
  },
  data() {
    return {
      title:"",
      description: "",
      hashtag: "",
    };
  },
  computed: {
    getUrl() {
      return window.location.origin + this.$route.path;
    }
  },
  methods: {
    copyToClipboard() {
      var copyText = this.$refs["url"];
      copyText.select();
      document.execCommand("copy");
    }
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
    //description
    let description=bgoStore.any(domain,ns.bgo("description"));
    app.description= description? (description.value) : "";
    //hashtag
    let hashtag=bgoStore.any(domain,ns.bgo("hashtag"));
    app.hashtag= hashtag? (hashtag.value) : "#LODMAP2D";
}
</script>
<style scoped>
  .g0v-social-link {
  width: 32px;
  font-size: 20px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54)!important;
}
</style>



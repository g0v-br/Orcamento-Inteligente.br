<template>
  <v-dialog class="dialog" width="500">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">mdi-share-variant</v-icon>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>Share</v-card-title>
      <SocialSharing
        :url="getUrl"
        :title="title"
        :description="description"
        :hashtags="hashtag"
        inline-template>
      <div class="container-social-link" >
        <div class="social-link email-link">
          <network  network="email" >
            <i class="fa fa-envelope"></i>
          </network></div>
          <div class="social-link facebook-link">
          <network network="facebook">
            <i class="fab fa-facebook"></i>
          </network>
          </div>
          <div class="social-link line-link">
          <network network="line">
            <i class="fab fa-line"></i>
          </network>
          </div>
          <div class="social-link linkedin-link">
          <network network="linkedin">
            <i class="fab fa-linkedin"></i>
          </network>
          </div>
          <div class="social-link ok-link">
          <network network="odnoklassniki">
            <i class="fab fa-odnoklassniki"></i>
          </network>
          </div>
          <div class="social-link pinintrest-link">
          <network network="pinterest">
            <i class="fab fa-pinterest"></i>
          </network>
          </div>
          <div class="social-link reddit-link">
          <network network="reddit">
            <i class="fab fa-reddit"></i>
          </network>
          </div>
          <div class="social-link skype-link">
          <network network="skype">
            <i class="fab fa-skype"></i>
          </network>
          </div>
          <div class="social-link twitter-link">
          <network network="twitter">
            <i class="fab fa-twitter"></i>
          </network>
          </div>
          <div class="social-link vk-link">
          <network network="vk">
            <i class="fab fa-vk"></i>
          </network>
          </div>
          <div class="social-link weibo-link">
          <network network="weibo">
            <i class="fab fa-weibo"></i>
          </network>
          </div>
          <div class="social-link whatsapp-link">
          <network network="whatsapp">
            <i class="fab fa-whatsapp"></i>
          </network>
          </div>
      </div>
      </SocialSharing>
      <hr>
      <div class="copy-url">
        <input class="input-link" type="text" readonly ref="url" :value="getUrl" />
        <v-icon   class="icon-copy" v-on:click="copyToClipboard()">mdi-content-copy</v-icon>
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
  console.log(this.$el);
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
<style>
.copy-url{
  padding: 0.5em;

}

.input-link{
  width: 95%!important;
};
  .container-social-link{
    padding: 0.5em;
    height: 200px;
  }

  .social-link{
    text-align: center;
    font-size: 50px;
    width: 50px;
    display: inline-block;
	 margin: 14px;
    -webkit-transition: all 0.3s ease-in-out;
	-moz-transition: all 0.3s ease-in-out;
	-ms-transition: all 0.3s ease-in-out;
	-o-transition: all 0.3s ease-in-out;
	transition: all 0.3s ease-in-out;

}

.social-link:hover, .social-link:active {
 	-webkit-transform: scale(1.1);
	-moz-transform: scale(1.1);
	-ms-transform: scale(1.1);
	-o-transform: scale(1.1);
	transform: scale(1.1);
}
.facebook-link{ color:#3C599F;}
.line-link{color:#00c300;}
.linkedin-link{color:#0077B5;}
.pinintrest-link{color:#bd081c;}
.whatsapp-link{color:#25D366;}
.skype-link{color:#00AFF0;}
.twitter-link{color:#55acee;}
.vk-link{color:#4c75a3;}
.weibo-link{color:#df2029;}
.reddit-link{color:#ff4500;}
.ok-link{color:#ff9900;}
.email-link{color:	#383838;}
</style>



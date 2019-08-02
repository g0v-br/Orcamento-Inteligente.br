<template>
  <v-app>
    <!-- TOOLBAR -->
    <v-app-bar app light>
      <!-- NAVIGATION MENU -->
      <v-menu v-model="menuShow" :close-on-content-click="false">
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">fas fa-bars</v-icon>
        </template>
        <v-list>
          <!--overview-->
          <v-list-item v-on:click="menuShow=false" :to="overview.path">
            <v-list-item-icon>
              <v-icon v-text="overview.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="overview.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!--partitions-->
          <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="partition.title"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="el in partition.partitionList"
              :key="el.title"
              v-on:click="menuShow=false"
              :to="el.path"
            >
              <v-list-item-content>
                <v-list-item-title v-text="el.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <!--otherlinks-->
          <v-list-item
            v-for="el in otherNavigationItem"
            :key="el.title"
            v-on:click="menuShow=false"
            :to="el.path"
          >
            <v-list-item-icon>
              <v-icon v-text="el.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="el.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <!--TITLE-->
      <v-toolbar-title class="headline text-uppercase">
        <span>{{title}}</span>
      </v-toolbar-title>
      <!--SPACER-->
      <v-spacer></v-spacer>
      <!-- SOCIAL -->
      <v-dialog v-if="hasSocialSharing" width="500">
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
            inline-template
          >
            <div>
              <network network="email">
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
              <network network="telegram">
                <i class="fab fa-telegram"></i>
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
          <hr />
          <div>
            <input type="text" readonly ref="url" :value="getUrl" />
            <button v-on:click="copyToClipboard()">Copy url</button>
          </div>
        </v-card>
      </v-dialog>
      <!-- OPTION -->
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-icon v-on="{ on }">fas fa-ellipsis-v</v-icon>
        </template>
        <v-list>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
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
  </v-app>
</template>

<script>
import { bgoStore, fetcher, ns } from "./models/bgo.js";
import SocialSharing from "vue-social-sharing";
export default {
  name: "App",
  components: {
    SocialSharing
  },
  data() {
    return {
      //Tutte le variabili da inserire nel template saranno messe qui
      title: "",
      description: "",
      hashtag: "",
      //nav
      menuShow: false,
      overview: {},
      partition: {},
      otherNavigationItem: [],
      //social
	  hasSocialSharing: false,
	  //option
	  optionItem:[],
	  //footer
		footerItem:[],
		//copyright
		copyright:""
    };
  },
  methods: {
    copyToClipboard() {
      var copyText = this.$refs["url"];
      copyText.select();
      document.execCommand("copy");
    }
  },
  computed:{

	  getUrl(){
		  return window.location.origin+this.$route.path;
	  }
  },
  mounted() {
	  console.log(window.location);
    fatchData(this);
  }
};

//to do gestione errori/default
function fatchData(app) {	
  let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
  let overview = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Overview"));
  let credits = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("CreditsView"));
  let terms = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TermsView"));
  let tabview = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TableView"));
  let optionMenu = bgoStore.any(domain,ns.bgo("hasOptionMenu"));
  //app title
  app.title = bgoStore.any(domain, ns.bgo("title")).value;
  app.description = bgoStore.any(domain, ns.bgo("description")).value;
  //overview for navigation menu
  app.overview.title = bgoStore.any(overview, ns.bgo("label")).value;
  app.overview.icon = "fas fa-atom";
  app.overview.path = "/";
  //partitions
  app.partition.title = "Partitions";
  app.partition.partitionList = [];
  bgoStore.any(overview, ns.bgo("hasPartitionList")).elements.forEach(el => {
    app.partition.partitionList.push({
      title: bgoStore.any(el, ns.bgo("label")).value,
      path: "/partition/" + bgoStore.any(el, ns.bgo("partitionId")).value
    });
  });
  //otherlinks
  app.otherNavigationItem.push({
    icon: "fas fa-table",
    title: bgoStore.any(tabview, ns.bgo("title")).value,
    path: "/table"
  });
  app.otherNavigationItem.push({
    icon: "fas fa-users",
    title: bgoStore.any(credits, ns.bgo("title")).value,
    path: "/credits"
  });
  app.otherNavigationItem.push({
    icon: "fas fa-gavel",
    title: bgoStore.any(terms, ns.bgo("title")).value,
    path: "/terms"
  });
  //social sharing
  app.hasSocialSharing = Boolean(
    Number(bgoStore.any(domain, ns.bgo("hasSocialSharing")).value)
  );
  //option menu
  if(optionMenu==undefined){
	  app.optionItem=undefined;
  }else{
	  bgoStore.any(optionMenu,ns.bgo("withCustomMenuItems")).elements.forEach(element => {
		  optionItem.push(
			  {
				  
			  }
		  )
	  });
  }
  app.optionItem.push()
}
</script>

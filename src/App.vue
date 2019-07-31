<template>
  <v-app>
    <v-app-bar app light>
      <!-- <VMenu :nudge-width="100">
        <VToolbarSideIcon slot="activator" />
        <VList>
          <VListTile
            value="true" v-for="(item, i) in items"
            :key="i"
          >
            <VListTileAction>
              <VIcon v-html="item.icon" />
            </VListTileAction>
            <VListTileContent>
              <VListTileTitle>
                <RouterLink v-if="!item.external" :to="item.path" v-text="item.title" />
                <a v-if="item.external" target="_blank" rel="noopener noreferrer" :href="item.path">{{item.title}}</a>
                 <v-icon v-if="item.external" size="10px" class="external-link">launch</v-icon>
              </VListTileTitle>
            </VListTileContent>
          </VListTile>
        </VList>
      </VMenu>-->
      <v-toolbar-title class="headline text-uppercase">
        <span>{{title}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { bgoStore, fetcher, ns } from "./models/bgo.js";

export default {
  name: "App",
  components: {},

  data: () => ({
    title: null,
    links: []
  }),
  created() {
    //console.log("store in APP:", bgoStore.toNT());
    let app = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
    this.title = bgoStore.any(app, ns.bgo("title")).value;
    let menu = bgoStore.any(app, ns.bgo("hasNavigationMenu"));
    // console.log("menu:", menu);
    console.log(bgoStore.any(menu, ns.bgo("hasUserMenuEntries")));
      /*.elements.forEach(element => {
        //  console.log("element", element);
        //console.log("title", bgoStore.any(element, ns.bgo("title")));
        //console.log("icon", bgoStore.any(element, ns.bgo("icon")));
        //console.log(bgoStore.each(null, ns.rdf("type"),ns.bgo("Account")));
        this.links.push(bgoStore.any(element, ns.bgo("menuLink")));
      });*/
    //  console.log("LINKS: ",this.links);
  }
};
</script>

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
      </VMenu> -->
      <v-toolbar-title class="headline text-uppercase">
        <span>title</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
     
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components:{
  },
  
  data: () => ({
    //
  })
};
</script>

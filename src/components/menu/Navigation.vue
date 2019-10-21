<template>
  <v-menu v-model="menuShow" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">mdi-menu</v-icon>
    </template>
    <v-list>
      <!--overview-->
      <v-list-item v-on:click="menuShow=false" :to="overview.path + '?s='+($route.query.s||'')">
        <v-list-item-icon>
          <v-icon v-text="overview.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="overview.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!--partitions-->
      <v-list-group v-if="partitions" no-action>
        <template v-slot:activator>
          <v-list-item-icon>
          <v-icon v-text="partitions.icon"></v-icon>
        </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="partitions.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="el in partitions.partitionsList"
          :key="el.title"
          v-on:click="menuShow=false"
          :to="el.path + '?s='+($route.query.s||'')"
        >
          <v-list-item-content>
            <v-list-item-title v-text="el.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <!--table view-->
      <v-list-item
        v-on:click="menuShow=false"
        :to="tableView.path + '?s='+($route.query.s||'')"
      >
        <v-list-item-icon>
          <v-icon v-text="tableView.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="tableView.title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!--otherlinks-->
      <v-list-item
        v-for="el in otherNavigationItem"
        :key="el.title"
        v-on:click="menuShow=false"
        :href="el.path"
      >
        <v-list-item-icon>
          <v-icon v-text="el.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="el.title"></v-list-item-title>
        </v-list-item-content>
        <v-icon class="external" v-if="el.external" size="10px">fas fa-share</v-icon>
      </v-list-item>
      <!-- default -->
      <v-list-item
        v-for="el in defaultNavigationItems"
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
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
export default {
  name: "Navigation",
  props: {
      overview: Object,
      partitions: Object,
      otherNavigationItem: Array,
      tableView:Object,
      defaultNavigationItems:Array
  },
  data(){
    return {
      menuShow:false
    }
  },
};

</script>

<style scoped>
 .external{
     padding: 0.5em;
 }
</style>


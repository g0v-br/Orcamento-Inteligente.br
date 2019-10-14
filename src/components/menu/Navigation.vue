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
      <v-list-group v-if="partition" no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="partition.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="el in partition.partitionList"
          :key="el.title"
          v-on:click="menuShow=false"
          :to="el.path + '?s='+($route.query.s||'')"
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
        :to="el.path + '?s='+($route.query.s||'')"
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
      menuShow: Boolean,
      overview: Object,
      partition: Object,
      otherNavigationItem: Array
  }
};

</script>


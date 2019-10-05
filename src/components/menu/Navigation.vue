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
  data() {
    return {
      menuShow: false,
      overview: {},
      partition: {},
      otherNavigationItem: []
    };
  },
  mounted() {
    fetchData(this);
  }
};
function fetchData(app) {
  let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
  let overview = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Overview"));
  let credits = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("CreditsView"));
  let terms = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TermsView"));
  let tabview = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TableView"));
  //overview for navigation menu
  app.overview.title = bgoStore.any(overview, ns.bgo("label")).value;
  app.overview.icon =  bgoStore.any(overview, ns.bgo("icon")).value;
  app.overview.path = "/";
  //partitions
  let partitionNode = bgoStore.any(overview, ns.bgo("hasPartitions"));
  let partitionList=bgoStore.any(partitionNode, ns.bgo("hasPartitionList"));
  app.partition.title = bgoStore.any(partitionNode, ns.bgo("label")).value;
  app.partition.icon = bgoStore.any(partitionNode, ns.bgo("icon")).value;
  app.partition.partitionList = [];
  if (partitionList && partitionList.elements.length != 0) {
    partitionList.elements.forEach(el => {
      app.partition.partitionList.push({
        title: bgoStore.anyValue(el, ns.bgo("label")),
        path: "/partition/" + bgoStore.any(el, ns.bgo("partitionId")).value
      });
    });
  } else {
    app.partition = undefined;
  }
  //otherlinks
  if (tabview) {
    app.otherNavigationItem.push({
      icon: "fas fa-table",
      title: bgoStore.any(tabview, ns.bgo("title")).value,
      path: "/table"
    });
  }
  if (credits) {
    app.otherNavigationItem.push({
      icon: "fas fa-users",
      title: bgoStore.any(credits, ns.bgo("title")).value,
      path: "/credits"
    });
  }
  if (terms) {
    app.otherNavigationItem.push({
      icon: "fas fa-gavel",
      title: bgoStore.any(terms, ns.bgo("title")).value,
      path: "/terms"
    });
  }
}
</script>


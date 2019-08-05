<template>
   <v-menu>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">fas fa-ellipsis-v</v-icon>
        </template>
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item v-for="(el, i) in optionItems" :key="i" :href="el.path" target="_blank">
              <v-list-item-icon>
                <v-icon v-text="el.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="el.title"></v-list-item-title>
              </v-list-item-content>
            <v-icon class="external" v-if="el.external" size="10px">fas fa-share</v-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu> 
</template>
<script>
import { bgoStore, fetcher, ns, getDefaultMenuItems } from "@/models/bgo.js";
export default {
   data() {
    return {
      optionItems: [],
    };
  },
  mounted(){
      fetchData(this)
  }   
}
function fetchData(app){
    let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
    let optionMenu=bgoStore.any(domain, ns.bgo("hasOptionMenu"));
    app.optionItems = getDefaultMenuItems(optionMenu);
}
</script>

<style scoped>
 .external{
     padding: 0.5em;
 }
</style>


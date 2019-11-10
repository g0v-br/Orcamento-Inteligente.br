<template>
   <v-menu>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">mdi-dots-vertical</v-icon>
        </template>
        <v-list>
          <v-list-item-group color="primary">
            <v-list-item v-for="(el, i) in optionItems" :key="i" :href="el.path" :target="el.target">
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
export default {
  props:{
    optionItems:Array
  },
}
</script>

<style scoped>
 .external{
     padding: 0.5em;
 }
</style>


<template>
  <v-footer class="font-weight-medium">
    <v-btn
      text
      icon
      small
      v-for="(el,k) in footerItems"
      :key="k"
      class="my-2 footer-btn"
      :href="el.path"
      target="_blank"
    >
      <v-icon size="24px">{{ el.icon }}</v-icon>
    </v-btn>
    <span class="copyright">
      <StringFormatter :string="copyright"/>
    </span>
  </v-footer>
</template>
<script>
import { bgoStore, fetcher, ns, getDefaultMenuItems } from "@/models/bgo.js";
import StringFormatter from "@/components/StringFormatter"
export default {
  components:{
    StringFormatter
  },
  data() {
    return {
      footerItems: [],
      copyright: undefined
    };
  },
  created() {
    fetchData(this);
  }
};
function fetchData(app) {
  let domain = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Domain"));
  let footerMenu = bgoStore.any(domain, ns.bgo("hasFooterMenu"));
  app.footerItems = getDefaultMenuItems(footerMenu);
  app.copyright = bgoStore.any(domain, ns.bgo("hasCopyrigth"));
}
</script>

<style scoped>
.copyright {
  margin-left: auto;
  margin-right: 10px;
  font-style: italic;
  color: rgba(100, 100, 100, 1);
}
.footer-btn {
  color: rgba(100, 100, 100, 1);
}
</style>

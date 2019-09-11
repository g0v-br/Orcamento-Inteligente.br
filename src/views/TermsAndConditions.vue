<template>
    <StringFormatter :string="abstract"/>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js"; 
import StringFormatter from "@/components/StringFormatter.vue";
export default {
  name: "Table",
  components: {
    StringFormatter
  },
  data() {
    return {
      title: {},
      abstract: {}
    };
  },
  created() {
    let creditsView = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TermsView"));
    this.title = bgoStore.any(creditsView, ns.bgo("title"));
    this.abstract = bgoStore.any(creditsView, ns.bgo("abstract"));
  }
};
</script>
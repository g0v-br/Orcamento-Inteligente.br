<template>
  <div class="container">
    <h1><StringFormatter :string="title"/></h1>
    <StringFormatter :string="abstract"/>
    </div>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js"; 
import StringFormatter from "@/components/StringFormatter.vue";
export default {
  name: "TermsAndCond",
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
<style scoped>
  .container{
    margin:0px;
    padding-left: 1em;
    padding-right: 1em;
  }
  .container div{
    width: 100%;
    height: 100%;
  }

</style>
<template>
  <div class="container">
    <h1>
      <StringFormatter :string="title" />
    </h1>
    <StringFormatter :string="abstract" />
  </div>
</template>
<script>
import { ServiceFactory } from "@/services/ServiceFactory.js";
import StringFormatter from "@/components/StringFormatter.vue";

const TermsService = ServiceFactory.get('terms');
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
    const data = TermsService.getData();

    this.title = data.title;
    this.abstract = data.abstract;
  }
};
</script>
<style scoped>
.container {
  margin: 0px;
  padding-left: 1em;
  padding-right: 1em;
}
.container div {
  width: 100%;
  height: 100%;
}
</style>
<template>
  <div class="container">
    <h1>
      <StringFormatter :string="data.title" />
    </h1>
    <StringFormatter :string="data.abstract" />
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
      data: {
        title: {},
        abstract: {}
      }
    };
  },
  created() {
    this.data = TermsService.getData();
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
<template>
  <div class="container">
    <h1>
      <StringFormatter :string="data.title" />
    </h1>
    <StringFormatter :string="data.abstract" />
    <!-- Warning: removing or changing the following statement breaks the LODMAP2D license -->
    <div class="ldc-credits">
      <p>
        This application includes the
        <a
          href="https://github.com/linkeddatacenter/LODMAP2D"
        >LODMAP2D software</a> developed by
        <a href="http://LinkedData.Center/">LinkedData.Center</a> and contributors.
      </p>
    </div>
  </div>
</template>
<script>
import { ServiceFactory } from "@/services/ServiceFactory.js";
import StringFormatter from "@/components/StringFormatter.vue";

const CreditsService = ServiceFactory.get("credits");
export default {
  name: "Credits",
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
    this.data = CreditsService.getData();
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
.ldc-credits {
  margin-left: auto;
  margin-top: 1em;
  font-style: italic;
  color: rgba(100, 100, 100, 1);
}
</style>
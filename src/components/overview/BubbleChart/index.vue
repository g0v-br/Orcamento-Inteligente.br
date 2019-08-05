<template>
  <div class="bc-container">
    <!-- <div  class="partitions-grid"></div> -->
    <svg id="vis" />
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart/BubbleChart.js";
import * as d3 from "d3";
export default {
  data() {
    return {};
  },

  mounted() {
    //    let bubbles = d3
    //         .select("svg")
    //         .append('circle');
    //         console.log('bubbles', bubbles);
    let chart = new BubbleChart("#vis", { bgoStore, ns }, 500, 770);
    chart.render();
  }
};
</script>


<style scoped>
.bc-container {
  position: relative;
}

#vis {
  height: 100%;
  width: 100%;
}
</style>

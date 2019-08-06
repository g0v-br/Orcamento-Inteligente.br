<template>
  <div ref="bound" class="bc-container">
    <!-- <div  class="partitions-grid"></div> -->
    <svg id="vis" />
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart/BubbleChart.js";
import * as d3 from "d3";
import _debounce from "lodash/debounce";
export default {
  data() {
    return {};
  },

  mounted() {
    let chart = new BubbleChart(
      "#vis",
      { bgoStore, ns },
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight
    );
    chart.render();

    window.addEventListener(
      "resize",
      _debounce(() => {
        console.log("resize");
        chart.update(
          this.$refs.bound.offsetWidth,
          this.$refs.bound.offsetHeight
        );
      }, 200)
    );
  },

  beforeDestroy() {
    // window.removeEventListener('resize');
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

#vis circle.bubble {
  /* pointer-events: all; */
  stroke-width: 1px;
  opacity: 1;
  transition: opacity 0.5s;
}
</style>

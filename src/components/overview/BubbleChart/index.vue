<template>
  <div ref="bound" class="bc-container">
    <div ref="grid" v-if="activePartitionId != 'overview'" class="partitions-grid">
      <div v-for="subset in activePartitionSubSet" :key="subset.id" class="grid-block">{{subset.id}}</div>
    </div>
    <svg id="vis" />
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart/BubbleChart.js";
import * as d3 from "d3";
import _debounce from "lodash/debounce";
let debouncedUpdate;
export default {
  props: {
    activePartitionId: {
      type: String
    },
    partitions: {
      type: Array
    }
  },

  data() {
    return {};
  },

  computed: {
    activePartitionSubSet: function() {
      return this.partitions.find(partition => {
        console.log(partition);
        return partition.id == this.activePartitionId;
      }).subsets;
    }
  },

  mounted() {
    let chart = new BubbleChart(
      "#vis",
      { bgoStore, ns },
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight
    );

    chart.render();

    debouncedUpdate = _debounce(() => {
      console.log("resize");
      chart.update(
        this.$refs.bound.offsetWidth,
        this.$refs.bound.offsetHeight,
        this.$refs.grid.childNodes,
        this.partitions,
        this.activePartitionId
      );
    }, 200);

    window.addEventListener("resize", debouncedUpdate);
  },

  beforeDestroy() {
    window.removeEventListener("resize", debouncedUpdate);
  }
};
</script>


<style scoped>
.bc-container {
  position: relative;
}
.partitions-grid {
  height: 100%;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-auto-rows: 30em;
}

.grid-block:nth-child(odd) {
  background-color: salmon;
}

#vis {
  /* background-color: aqua; */
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* buuble svg el */
#vis circle.bubble {
  /* pointer-events: all; */
  stroke-width: 1px;
  opacity: 1;
  transition: opacity 0.5s;
}
</style>

<template>
  <div ref="bound" class="bc-container">
    <div ref="grid" v-if="activePartitionId != 'overview'" class="partitions-grid">
      <div
        v-for="subset in activePartitionSubSets"
        :key="subset.id"
        class="grid-block"
      >{{subset.id}}</div>
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
let chart;
export default {
  props: {
    activePartitionId: {
      type: String
    },
    partitions: {
      type: Array
    },
    search: {
      type: String
    }
  },

  computed: {
    activePartitionSubSets: function() {
      return this.partitions.find(partition => {
        return partition.id == this.activePartitionId;
      }).subsets;
    }
  },
  watch: {
    search: {
      handler: _debounce(newVal => {
        chart.filterBubbles(newVal);
        if (this.activePartitionId == "overview") {
          let overviewPartition=this.partitions.find(p=>{return p.id=="overview" });
          emitTotalEvent(this,overviewPartition.total, 
            overviewPartition.total_filtered);
        }
      }, 1000),
      deep: true
    }
  },

  mounted() {
    chart = new BubbleChart(
      "#vis",
      { bgoStore, ns },
      this.partitions,
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight
    );
    const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];

    chart.render(this.search);
    chart.update(
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight,
      gridBloks,
      this.activePartitionId
    );

    debouncedUpdate = _debounce(() => {
      const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];
      chart.update(
        this.$refs.bound.offsetWidth,
        this.$refs.bound.offsetHeight,
        gridBloks,
        this.activePartitionId
      );
    }, 200);
    if (this.activePartitionId == "overview") {
       let overviewPartition=this.partitions.find(p=>{return p.id=="overview" });
      emitTotalEvent(this,overviewPartition.total, 
            overviewPartition.total_filtered);
    }
    window.addEventListener("resize", debouncedUpdate);
  },

  beforeDestroy() {
    window.removeEventListener("resize", debouncedUpdate);
  },

  updated() {
    const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];
    chart.update(
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight,
      gridBloks,
      this.activePartitionId
    );
  }
};
function emitTotalEvent(app,total, total_filtered){
  let data={
    total,
    total_filtered
  }
  app.$emit('total_changed',data);
}
</script>


<style>
.bc-container {
  position: relative;
}
.partitions-grid {
  height: 100%;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(384px, 1fr));
  grid-auto-rows: 30em;
}
/*
.grid-block:nth-child(odd) {
  background-color: salmon;
} */

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
#vis circle.disabled {
  pointer-events: none;
  opacity: 0.1;
}
</style>

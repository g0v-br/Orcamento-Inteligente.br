<template>
  <div ref="bound" class="bc-container">
    <div ref="grid" v-if="activePartition.id != 'overview'" class="partitions-grid">
      <div v-for="subset in activePartition.subsets" :key="subset.id" class="grid-block">
        <StringFormatter class="title" :string="subset.title" :popup="subset.abstract" />
        <div v-if="condition_totalizer_rate">{{totalizer(subset.total, subset.totalFiltered)}}</div>
        <Rate
          v-else
          :rate="subset.totalFiltered"
          :show_icon="true"
          :formatterOptions="totalizerOptions.rateFormatter"
        />
      </div>
    </div>
    <svg ref="vis" id="vis" />
  </div>
</template>

<script>
import { store, fetcher, ns } from "@/services/rdfService.js";
import BubbleChart from "@/components/overview/BubbleChart/BubbleChart.js";
import _debounce from "lodash/debounce";
import Totalizer from "@/components/Totalizer.vue";
import Rate from "@/components/Rate";
import StringFormatter from "@/components/StringFormatter.vue";
let debouncedUpdate;
let debouncedSearch;
let chart;
export default {
  components: {
    Totalizer,
    StringFormatter,
    Rate
  },
  props: {
    accounts: Array,
    legend : Object,
    totalizer: {
      type: Function
    },
    activePartition: {
      type: Object
    },
    search: {
      type: String
    }
  },
  data() {
    return {
      totalizerOptions: this.totOption
    };
  },
  computed: {
    activePartitionSubSets: function() {
      let partition_active = this.partitions.find(partition => {
        return partition.id == this.activePartitionId;
      });
      sortSubset(partition_active, ns);
      return partition_active.subsets;
    },
    //when rate group function is used show the rate for each subset
    //show total otherwise
    condition_totalizer_rate: function() {
      const cur_partition = store.any(
        undefined,
        ns.bgo("partitionId"),
        this.activePartitionId
      );
      return (
        store.anyValue(cur_partition, ns.bgo("withGroupFunction")) !=
        ns.bgo("trend_average").value
      );
    }
  },
  
  mounted() {
    chart = new BubbleChart(
      "#vis",
      this,
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight,
      this.accounts,
      this.legend
    );
    const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];
    chart.render(this.search);
    chart.update(
      this.$refs.bound.offsetWidth,
      this.$refs.bound.offsetHeight,
      gridBloks,
      this.activePartition.subsets,
      this.activePartition.id
    );
    //new update can't be called twice in 200ms
    debouncedUpdate = _debounce(() => {
      const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];
      chart.update(
        this.$refs.bound.offsetWidth,
        this.$refs.bound.offsetHeight,
        gridBloks,
        this.activePartition.subsets,
        this.activePartition.id
      );
    }, 200);
   
      
    
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
      this.activePartition
    );
  }
};
</script>


<style>
.bc-container {
  position: relative;
  height: 100%;
  width: 100%;
}
.partitions-grid {
  height: 100%;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(384px, 1fr));
  grid-auto-rows: 30em;
}

.grid-block {
  text-align: center;
}
.grid-block:nth-child(odd) {
}

#vis {
  /* background-color: aqua; */
  pointer-events: none;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* buuble svg el */
#vis circle.bubble {
  pointer-events: all;
  stroke-width: 1px;
  opacity: 1;
  transition: opacity 0.5s;
}
#vis circle.disabled {
  pointer-events: none;
  opacity: 0.1;
}
</style>

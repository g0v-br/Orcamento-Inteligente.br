<template>
  <div ref="bound" class="bc-container">
    <div ref="grid" v-if="activePartitionId != 'overview'" class="partitions-grid">
      <div v-for="subset in activePartitionSubSets" :key="subset.id" class="grid-block">
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
    totalizer: {
      type: Function
    },
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
  methods: {
    total_subset(subset) {
      return "" + subset.total + ";" + subset.totalFiltered;
    }
  },
  watch: {
    search: {
      handler: function(newVal) {
        let app = this;
        debouncedSearch(newVal, app);
      },
      deep: true
    }
  },
  mounted() {
    chart = new BubbleChart(
      "#vis",
      this,
      { store, ns },
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
    //new update can't be called twice in 200ms
    debouncedUpdate = _debounce(() => {
      const gridBloks = this.$refs.grid ? this.$refs.grid.childNodes : [];
      chart.update(
        this.$refs.bound.offsetWidth,
        this.$refs.bound.offsetHeight,
        gridBloks,
        this.activePartitionId
      );
    }, 200);
    //wait that user finisc to write search string
    debouncedSearch = _debounce((newVal, app) => {
      chart.filterBubbles(newVal);
      let overviewPartition = app.partitions.find(p => {
        return p.id == "overview";
      });
      emitTotalEvent(
        app,
        overviewPartition.total,
        overviewPartition.totalFiltered
      );
    }, 200);

    if (this.activePartitionId == "overview") {
      let overviewPartition = this.partitions.find(p => {
        return p.id == "overview";
      });
      emitTotalEvent(
        this,
        overviewPartition.total,
        overviewPartition.totalFiltered
      );
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
function emitTotalEvent(app, total, totalFiltered) {
  let data = {
    total,
    totalFiltered
  };
  app.$emit("total_changed", data);
}
function sortSubset(partition_active, ns) {
  // sort array asc or desc
  partition_active.subsets.sort((a, b) => {
    return a.totalFiltered - b.totalFiltered;
  });
  if (partition_active.sortOrder == ns.bgo("descending_sort").value) {
    partition_active.subsets.reverse();
  }
}
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

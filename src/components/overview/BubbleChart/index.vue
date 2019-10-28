<template>
  <div ref="bound" class="bc-container">
    <div ref="grid" v-if="activePartition.id != 'overview'" class="partitions-grid">
      <div v-for="subset in activePartition.subsets" :key="subset.id" class="grid-block">
        <StringFormatter
          class="title"
          :string="subset.title||subset.label||subset.id"
          :popup="subset.abstract"
        />
        <div class="amount">{{subset.formattedString}}</div>
      </div>
    </div>
    <svg ref="vis" id="vis" />
  </div>
</template>

<script>
import BubbleChart from "@/components/overview/BubbleChart/BubbleChart.js";
import _debounce from "lodash/debounce";
import Rate from "@/components/Rate";
import StringFormatter from "@/components/StringFormatter.vue";
let debouncedUpdate;
let chart;
export default {
  components: {
    StringFormatter,
    Rate
  },
  props: {
    accounts: Array,
    legend: Object,
    totalizer: {
      type: Function
    },
    activePartition: {
      type: Object
    },
    search: {
      type: String
    },
    criteria: Object
  },
  data() {
    return {
      totalizerOptions: this.totOption
    };
  },
  computed: {
    //when rate group function is used show the rate for each subset
    //show total otherwise
    condition_totalizer_rate: function() {
      return this.activePartition.GroupFunction != this.criteria.TrendAdverage;
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
      this.activePartition.subsets,
      this.activePartition.id
    );
  },
  watch: {
    search: function(newVal, oldVal) {
      chart.filterBubbles(newVal);
    }
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
  z-index: 4;
  pointer-events: none;
}
.amount {
  font-size: 1.2em;
  pointer-events: all;
}
.title {
  pointer-events: all;
}

#vis {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* buuble svg el */
#vis circle.bubble {
  stroke-width: 1px;
  opacity: 1;
  transition: opacity 0.5s;
}
#vis circle.disabled {
  pointer-events: none;
  opacity: 0.1;
}
</style>

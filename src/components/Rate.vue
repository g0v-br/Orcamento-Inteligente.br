<template>
  <div class="rate">
    <v-icon v-if="show_icon" :color="color">{{icon}}</v-icon>
    {{ formatPercentage(rate) }}
  </div>
</template>
<script>
import { formatPercentage } from "@/utils/utils.js";
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import { scaleLinear } from "d3-scale";
export default {
  props: {
    rate: {
      type: Number
    },
    show_icon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      noTrendColor:"",
      rangeTresholds: [],
      colorTresholds: []
    };
  },
  computed: {
    icon() {
      if (this.rate < 0) return "mdi-trending-down";
      if (this.rate > 0) return "mdi-trending-up";
      if (this.rate == 0) return "mdi-equal";
    },
    color() {
      let fill = scaleLinear()
        .domain(this.rangeTresholds)
        .range(this.colorTresholds)
        .clamp(true);
      if (isFinite(this.rate)) {
        return fill(this.rate);
      } else {
        return this.noTrendColor;
      }
    }
  },
  methods: {
    formatPercentage
  },
  created() {
    fetchData(this);
  }
};

let fetchData = app => {
  const overview = bgoStore.any(null, ns.rdf("type"), ns.bgo("Overview"));
  // Colore schema
  const colorScheme = bgoStore.any(overview, ns.bgo("hasTrendColorScheme"));
  app.noTrendColor = bgoStore.anyValue(colorScheme, ns.bgo("noTrendColor"));
  bgoStore
    .each(colorScheme, ns.bgo("rateTreshold"))
    .sort((tresholdA, tresholdB) => {
      let rateA = bgoStore.anyValue(tresholdA, ns.bgo("rate"));
      let rateB = bgoStore.anyValue(tresholdB, ns.bgo("rate"));
      return rateA - rateB;
    })
    .forEach(treshold => {
      app.rangeTresholds.push(bgoStore.anyValue(treshold, ns.bgo("rate")));
      app.colorTresholds.push(bgoStore.anyValue(treshold, ns.bgo("colorId")));
    });
};
</script>
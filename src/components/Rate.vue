<template>
  <div class="rate">
    <v-icon v-if="show" :color="color">{{icon}}</v-icon>
    {{ formatter(rate) }}
  </div>
</template>
<script>
// import { numberFormatter } from "@/utils/utils.js";
// import { bgoStore, fetcher, ns } from "@/models/bgo.js";
// import { scaleLinear } from "d3-scale";

export default {
  props: {
    rate: Number,
    show_icon: {
      type: Boolean,
      default: true
    },
    formatter: Function
  },
  // data() {
  //   return {
  //     noTrendColor: "",
  //     rangeTresholds: [],
  //     colorTresholds: []
  //   };
  // },
  methods: {
    // formatter
  },
  computed: {
    icon() {
      if (this.rate < 0) return "mdi-trending-down";
      if (this.rate > 0) return "mdi-trending-up";
      if (this.rate == 0) return "mdi-equal";
    },
    show() {
      return this.show_icon && isFinite(this.rate);
    },
    color() {
      if (isFinite(this.rate)) {
        if (this.rate < 0) return "red";
        if (this.rate > 0) return "green";
      }
      return "lightgrey";
      // let fill = scaleLinear()
      //   .domain(this.rangeTresholds)
      //   .range(this.colorTresholds)
      //   .clamp(true);
      // if (isFinite(this.rate)) {
      //   return fill(this.rate);
      // } else {
      //   return this.noTrendColor;
      // }
    }
  }

  // mounted() {
  //   fetchData(this);
  // }
};

// let fetchData = app => {
//   const domain = bgoStore.any(undefined, ns.bgo("hasOverview"));
//   const overview = bgoStore.any(domain, ns.bgo("hasOverview"));
//   // Colore schema
//   const colorScheme = bgoStore.any(overview, ns.bgo("hasTrendColorScheme"));
//   app.noTrendColor = bgoStore.anyValue(colorScheme, ns.bgo("noTrendColor"));
//   let legend = bgoStore.each(colorScheme, ns.bgo("rateTreshold"));
//   legend.sort((tresholdA, tresholdB) => {
//     let rateA = bgoStore.anyValue(tresholdA, ns.bgo("rate"));
//     let rateB = bgoStore.anyValue(tresholdB, ns.bgo("rate"));
//     return rateA - rateB;
//   });
//   legend.forEach(treshold => {
//     app.rangeTresholds.push(bgoStore.anyValue(treshold, ns.bgo("rate")));
//     app.colorTresholds.push(bgoStore.anyValue(treshold, ns.bgo("colorId")));
//   });
// };
</script>

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
      color: "",
      icon: "",
      rangeTresholds: [],
      colorTresholds: []
    };
  },
  methods: {
    formatPercentage
  },
  created() {
    fetchData(this);
    //set icon
    if (this.rate == 0) this.icon = "mdi-equal";
    if (this.rate < 0) this.icon = "mdi-trending-down";
    if (this.rate > 0) this.icon = "mdi-trending-up";
    //set color
    let fill = scaleLinear()
      .domain(this.rangeTresholds)
      .range(this.colorTresholds)
      .clamp(true);
    if (isFinite(this.rate)) {
      this.color = fill(this.rate);
    } else {
      this.color = this.noTrendColor;
    }
  }
};

let fetchData = app => {
  const overview = bgoStore.any(null, ns.rdf("type"), ns.bgo("Overview"));
  // Colore schema
  const colorScheme = bgoStore.any(overview, ns.bgo("hasTrendColorScheme"));
  app.noTrendColor = bgoStore.anyValue(colorScheme, ns.bgo("noTrendColor"));
      bgoStore.each(colorScheme, ns.bgo("rateTreshold"))
            .sort((tresholdA, tresholdB) => {
                let rateA=bgoStore.anyValue(tresholdA,ns.bgo("rate"));
                let rateB=bgoStore.anyValue(tresholdB,ns.bgo("rate"));
                return rateA-rateB;
            })
            .forEach(treshold => {

                app.rangeTresholds.push(bgoStore.anyValue(treshold,ns.bgo("rate")));
                app.colorTresholds.push(bgoStore.anyValue(treshold,ns.bgo("colorId")))
            })

};
</script>
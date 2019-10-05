<template>
  <p>{{display}}</p>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import { formatPercentage, formatAmount, printf } from "@/utils/utils.js";
export default {
  props: {
    total:[String, Number],
    filtered: [String, Number],
    options: Object
  },
  computed: {
    display() {
      let text, data;
      let total, filtered, rate; //Numbers

      total = formatAmount(this.total, this.options.precision);
      filtered = formatAmount(this.filtered, this.options.precision);

      if (Math.round(this.filtered) == Math.round(this.total)) 
        text = this.options.format.replace("%s", total);
      else {
        rate = parseFloat(this.filtered) / parseFloat(this.total);
        text = this.options.filteredFormat.replace("%s", filtered);

        if (Math.abs(rate) < this.options.rateFormatter.minValue)
          text = text + this.options.rateFormatter.lessThanMinFormat;
        else {
          rate = formatPercentage(rate, options.rateFormatter.precision);
          text = text + this.options.rateFormatter.format.replace("%s", rate);
        }
      }

      return text;
    }
  }
};
</script>

<style scoped>
/* p {
  margin: 0;
} */
</style>

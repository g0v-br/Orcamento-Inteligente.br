<template>
  <p>{{display}}</p>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import {
  formatPercentage,
  formatAmount,
  printf,
  numberFormatter
} from "@/utils/utils.js";
export default {
  props: {
    total: [String, Number],
    filtered: [String, Number],
    options: Object
  },
  computed: {
    display() {
      let text, data;
      let rate;

      if (Math.round(this.filtered) == Math.round(this.total))
        text = numberFormatter(this.total, {
          precision: this.options.precision,
          format: this.options.format
        });
      else {
        rate =
          (parseFloat(this.filtered) / parseFloat(this.total)) *
          this.options.rateFormatter.scaleFactor;
        text = numberFormatter(this.filtered, {
          precision: this.options.precision,
          format: this.options.filteredFormat
        });
        text = text + numberFormatter(rate, this.options.rateFormatter);
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

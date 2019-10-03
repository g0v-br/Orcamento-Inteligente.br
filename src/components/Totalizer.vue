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

      total = formatAmount(this.total);
      filtered = formatAmount(this.filtered);

      if (Math.round(this.filtered) == Math.round(this.total)) 
        text = this.options.format.replace("%s", total);
      else {
        rate = parseFloat(this.filtered) / parseFloat(this.total);
        text = this.options.filteredFormat.replace("%s", filtered);

        if (Math.abs(rate) < this.options.rateFormatter.minValue)
          text = text + this.options.rateFormatter.lessThanMinFormat;
        else {
          rate = formatPercentage(rate);
          text = text + this.options.rateFormatter.format.replace("%s", rate);
        }
      }

      return text;
    }
  }
};

function fetchData(filterActive) {
  let totalizer, object;

  object = {};
  totalizer = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Totalizer"));
  object["text"] = bgoStore.anyValue(
    totalizer,
    filterActive
      ? ns.bgo("totalFilteredPrintfTemplate")
      : ns.bgo("totalPrintfTemplate")
  );

  object["treshold"] = parseFloat(
    bgoStore.anyValue(totalizer, ns.bgo("treshold"))
  );
  object["tresholdPrintTemplate"] = bgoStore.anyValue(
    totalizer,
    ns.bgo("tresholdPrintTemplate")
  );

  return object;
}
</script>

<style scoped>
/* p {
  margin: 0;
} */
</style>

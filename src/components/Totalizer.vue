<template>
  <p>{{display}}</p>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import { formatPercentage, formatAmount, printf } from "@/utils/utils.js";
export default {
  props: {
    total: {
      type: [String, Number]
    },
    filtered: {
      type: [String, Number]
    }
  },
  computed: {
    display() {
      let text, data;
      let total, filtered, rate; //Numbers

      total = formatAmount(this.total);
      filtered = formatAmount(this.filtered);

      this.filtered == this.total
        ? (data = fetchData(false))
        : (data = fetchData(this.filtered));

      text = data.text;
      if (!this.filtered) text = text.replace("%s", total);
      else {
        rate = parseFloat(this.filtered) / parseFloat(this.total);

        if (rate < data.treshold)
          text = text
            .replace("%s", filtered)
            .replace("%s", data.tresholdPrintTemplate);
        else {
          rate = formatPercentage(rate);

          text = text.replace("%s", filtered).replace("%s", rate);
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
p {
  margin: 0;
}
</style>
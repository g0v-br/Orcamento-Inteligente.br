<template>
  <p>{{totalString}}</p>
</template>
<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
export default {
  props: {
    total: {
      type: String
    }
  },
  computed: {
    totalString() {
      let totals = this.total.split(";");

      let total0 = new Intl.NumberFormat({ maximumFractionDigits: 2 }).format(
        totals[0]
      );

      let total1 = new Intl.NumberFormat({ maximumFractionDigits: 2 }).format(
        totals[1]
      );

      let text = fetchData(totals[0] != totals[1]);
      if (totals[0] == totals[1]) {
        return text.replace("%s", total0);
      } else {
        let rate = totals[1] / totals[0];
        rate = new Intl.NumberFormat(undefined, {
          style: "percent",
          maximumFractionDigits: 2
        }).format(rate);
        
        if(parseFloat(rate)<0.01)
          return text.replace("%s", total1).replace("%s", "Meno dello 0,01% ");
        //replace works only with the first occourrence of %2
        return text.replace("%s", total1).replace("%s", rate);
      }
    }
  }
};
function fetchData(filter_active) {
  let totalizer = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("Totalizer"));
  return bgoStore.anyValue(
    totalizer,
    filter_active
      ? ns.bgo("totalFilteredPrintfTemplate")
      : ns.bgo("totalPrintfTemplate")
  );
}
</script>

<style scoped>
p {
  margin: 0;
}
</style>
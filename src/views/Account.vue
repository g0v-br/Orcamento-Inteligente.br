<template>
  <div>
    <v-system-bar window class="status">
      <div class="flex-grow-1"></div>
      <v-icon v-on:click="$router.push('/overview' + '?s='+accountId)">mdi-magnify</v-icon>
      <v-icon v-on:click="$router.push('/overview')">mdi-close</v-icon>
    </v-system-bar>
    <div class="content-grid">
      <div class="metadata">
        <Metadata :accountId="accountId"  />
      </div>
      <div v-if="historicRec!=undefined" class="bar">
        <BarChart :historic-rec="historicRec.records" :title="historicRec.title" />
      </div>
      <div v-if="breakDown!=undefined" class="pie">
        <PieChart :breakdown="breakDown.records" :title="breakDown.title" :total="breakDown.total" :totalizerOptions="totalizerOptions"/>
      </div>
    </div>
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BarChart from "@/components/account/perspectives/BarChart";
import Metadata from "@/components/account/perspectives/Metadata";
import PieChart from "@/components/account/perspectives/PieChart";
import { isNullOrUndefined } from "util";
export default {
  components: {
    BarChart,
    Metadata,
    PieChart
  },
  props: {
    accountId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      historicRec: {
        title: "",
        records: []
      },
      breakDown: {
        title: "",
        records: [],
        total: 0
      },
      title: "",
      totalizerOptions:{
                  format: "",
          filteredFormat: "",
          precision: 0,
          rateFormatter: {
            format: "",
            precision: 0,
            scaleFactor: 0,
            maxValue: 0,
            minValue: 0,
            moreThanMaxFormat: "",
            lessThanMinFormat: ""
          }
      }
    };
  },
  created() {
    fetchData(this);
  }
};

let fetchData = app => {
  const domain= bgoStore.any(undefined,ns.bgo("hasAccountView"))
  const accountView = bgoStore.any(domain, ns.bgo("hasAccountView"));
  let account = bgoStore.any(undefined, ns.bgo("accountId"), app.accountId);
  app.title = bgoStore.anyValue(account, ns.bgo("title"));

  //Bar chart data
  let historical_perspective = bgoStore.any(
    accountView,
    ns.bgo("hasHistoricalPerspective")
  );
  if (isNullOrUndefined(historical_perspective)) {
    app.historicRec = null;
  } else {
    app.historicRec.title =
      bgoStore.anyValue(historical_perspective, ns.bgo("title")) || "";
    bgoStore.each(account, ns.bgo("hasHistoryRec")).forEach(rec => {
      const version = bgoStore.anyValue(rec, ns.bgo("versionLabel"));
      const amount = bgoStore.anyValue(rec, ns.bgo("amount"));
      app.historicRec.records.push({ x: version, y: amount });
    });
    app.historicRec.records.sort((a, b) => {
      return a.x.localeCompare(b.x);
    });
  }

  //pie chart data
  let breakdown_perspective = bgoStore.any(
    accountView,
    ns.bgo("hasBreakdownPerspective")
  );
  if (isNullOrUndefined(breakdown_perspective)) {
    app.breakDown = null;
  } else {
    //pie chart title
    app.breakDown.title =
      bgoStore.anyValue(breakdown_perspective, ns.bgo("title")) || "";
    //total amount
    app.breakDown.total = parseFloat(
      bgoStore.anyValue(account, ns.bgo("amount"))
    );
    //breakdown set
    bgoStore.each(account, ns.bgo("hasBreakdown")).forEach(br => {
      const title = bgoStore.anyValue(br, ns.bgo("title"));
      const amount = bgoStore.anyValue(br, ns.bgo("amount"));
      app.breakDown.records.push({ title, amount });
    });
     // Totalizer metadata
  let totalizer = bgoStore.any(breakdown_perspective, ns.bgo("hasTotalizer"));
  let rateFormatter = bgoStore.any(totalizer, ns.bgo("ratioFormatter"));

  app.totalizerOptions.format = bgoStore.anyValue(totalizer, ns.bgo("format"));
  app.totalizerOptions.filteredFormat = bgoStore.anyValue(
    totalizer,
    ns.bgo("filteredFormat")
  );
  app.totalizerOptions.precision = bgoStore.anyValue(
    totalizer,
    ns.bgo("precision")
  );

  app.totalizerOptions.rateFormatter.format = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("format")
  );
  app.totalizerOptions.rateFormatter.precision = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("precision")
  );
  app.totalizerOptions.rateFormatter.scaleFactor = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("scaleFactor")
  );
  app.totalizerOptions.rateFormatter.maxValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("maxValue")
  );
  app.totalizerOptions.rateFormatter.minValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("minValue")
  );
  app.totalizerOptions.rateFormatter.moreThanMaxFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("moreThanMaxFormat")
  );
  app.totalizerOptions.rateFormatter.lessThanMinFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("lessThanMinFormat")
  );
  }
};
</script>

<style scoped>
.status {
  background-color: #f5f5f5;
}
.status i {
  margin-left: 0.5em;
  margin-right: 0.5em;
}
.content-grid {
  padding: 24px 12px;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-auto-rows: 30em;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-rows: repeat(3, minmax(500px, 1fr));
    grid-template-columns: 1fr;
  }
}
</style>
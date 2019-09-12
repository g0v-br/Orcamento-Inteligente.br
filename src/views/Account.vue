<template>
  <div class="content-grid">
    <div class="metadata">
      <Metadata :accountId="accountId"/>
    </div>
    <div class="bar">
      <BarChart :historic-rec="historicRec.records" :title="historicRec.title"/>
    </div>
    <div class="pie">
      <PieChart :breakdown="breakDown.records" :title="breakDown.title" :total="breakDown.total"/>
    </div>
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BarChart from "@/components/account/perspectives/BarChart";
import Metadata from "@/components/account/perspectives/Metadata";
import PieChart from "@/components/account/perspectives/PieChart";
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
      }
    };
  },
  created() {
    fetchData(this);
  }
};

let fetchData = app => {
  let accountId = app.accountId;
  let account = bgoStore.any(undefined, ns.bgo("accountId"), accountId);
  /*
   const tagCloud = bgoStore.any(overview, ns.bgo("hasTagCloud"));

  bgoStore.each(tagCloud, ns.bgo("hasTag")).forEach(tag => {
    const label = bgoStore.anyValue(tag, ns.bgo("label"));
    const weight = bgoStore.anyValue(tag, ns.bgo("tagWeight"));
    app.tags.push({ label, weight });
  });
   */
  
  //Bar chart data
  let historical_perspective = bgoStore.any(
    account,
    ns.bgo("usesHistoricalPerspective")
  );

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
   //pie chart data
  let breakdown_perspective = bgoStore.any(
    account,
    ns.bgo("usesBreakdownPerspective")
  );
  //pie chart title
  app.breakDown.title = bgoStore.anyValue(breakdown_perspective, ns.bgo("title")) || "";
  //total amount
  app.breakDown.total = parseFloat(bgoStore.anyValue(account, ns.bgo('amount')));
  //breakdown set
  bgoStore.each(account, ns.bgo("hasBreakdown")).forEach(br => {
    const title = bgoStore.anyValue(br, ns.bgo("title"));
    const amount = bgoStore.anyValue(br, ns.bgo("amount"));
    app.breakDown.records.push({ title, amount });
  });

 
};
</script>

<style scoped>
.content-grid {
  padding: 24px 12px;
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  grid-auto-rows: 30em;
}

.metadata {
}
.bar {
}
.pie {
 
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-rows: repeat(3, minmax(500px, 1fr));
    grid-template-columns: 1fr;
  }
}
</style>
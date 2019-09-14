<template>
  <div>
    <v-system-bar window class="status">
      <div class="flex-grow-1"></div>
      <v-icon v-on:click="$router.push('/overview' + '?s='+title)">fas fa-search</v-icon>
      <v-icon v-on:click="$router.push('/overview')">fas fa-times</v-icon>
    </v-system-bar>
    <div class="content-grid">
      <div class="metadata">
        <Metadata :accountId="accountId" />
      </div>
      <div class="bar">
        <BarChart :historic-rec="historicRec.records" :title="historicRec.title" />
      </div>
      <div class="pie">
        <PieChart :breakdown="breakDown.records" :title="breakDown.title" :total="breakDown.total" />
      </div>
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
      },
      title :""

    };
  },
  created() {
    fetchData(this);
  },
  methods:{
    back: ()=>{
      console.log("BACK")
    },
    backWithFilter: ()=>{
      console.log("BACK WITH FILTER")
    }
  }
};

let fetchData = app => {
  let accountId = app.accountId;
  let account = bgoStore.any(undefined, ns.bgo("accountId"), accountId);
 
  app.title=bgoStore.anyValue(account,ns.bgo("title"))
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
};
</script>

<style scoped>
.status{
  background-color:#f5f5f5;
}
.status i{
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
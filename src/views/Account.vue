<template>
  <div>
    <v-system-bar window class="status">
      <div class="flex-grow-1"></div>
      <v-icon v-on:click="$router.push('/overview' + '?s='+accountId)">mdi-magnify</v-icon>
      <v-icon v-on:click="$router.push('/overview')">mdi-close</v-icon>
    </v-system-bar>
    <div class="content-grid">
      <div class="metadata">
        <Metadata
          :accountId="accountId"
          :title="account.title"
          :description="account.description"
          :abstract="account.abstract"
          :total="account.amount"
          :rate="account.rate"
          :formatAmount="metadataPerspective.formatters.formatAmount"
          :formatPercentage="metadataPerspective.formatters.formatPercentage"
        />
      </div>
      <div v-if="historicalPerspective && account.historicRecords.length > 0" class="bar">
        <BarChart
          :historic-rec="historicRecords"
          :formatAmount="historicalPerspective.formatters.formatAmount"
          :title="historicalPerspective.title"
        />
      </div>
      <div v-if="breakdownPerspective && account.breakDownRecords.length >0" class="pie">
        <PieChart
          :breakdown="breakdownRecords"
          :title="breakdownPerspective.title"
          :total="account.amount"
          :totalizer="breakdownPerspective.totalizer"
        />
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
import { ServiceFactory } from "@/services/ServiceFactory.js";
const AccountService = ServiceFactory.get("account");

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
      account: null,
      metadataPerspective: null,
      historicalPerspective: null,
      breakdownPerspective: null
    };
  },
  created() {
    this.account = AccountService.getAccountById(this.accountId);
    this.metadataPerspective = {
      formatters: AccountService.getMetadataFormatter()
    };
    this.historicalPerspective = AccountService.getHistoricPerspective();
    this.breakdownPerspective = AccountService.getBreakdownPerspective();
    // fetchData(this);
  },
  computed: {
    historicRecords() {
      return this.account.historicRecords
        .map(rec => ({
          x: rec.version,
          y: rec.amount
        }))
        .sort((a, b) => {
          return a.x.localeCompare(b.x);
        });
    },
    breakdownRecords() {
      return this.account.breakDownRecords;
    }
  }
};

let fetchData = app => {
  const domain = bgoStore.any(undefined, ns.bgo("hasAccountView"));
  const accountView = bgoStore.any(domain, ns.bgo("hasAccountView"));
  //metadata fetch data
  //rate metadata formatter: metadata don't have formatter, use accountView metadata
  let rateFormatter = bgoStore.any(accountView, ns.bgo("trendFormatter"));

  app.metadata.rateFormatterOptions.format = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("format")
  );
  app.metadata.rateFormatterOptions.precision = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("precision")
  );
  app.metadata.rateFormatterOptions.scaleFactor = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("scaleFactor")
  );
  app.metadata.rateFormatterOptions.maxValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("maxValue")
  );
  app.metadata.rateFormatterOptions.minValue = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("minValue")
  );
  app.metadata.rateFormatterOptions.moreThanMaxFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("moreThanMaxFormat")
  );
  app.metadata.rateFormatterOptions.lessThanMinFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("lessThanMinFormat")
  );
  app.metadata.rateFormatterOptions.nanFormat = bgoStore.anyValue(
    rateFormatter,
    ns.bgo("nanFormat")
  );
  //------------------------------------------------------------------------//
  //metadata amount formatter
  let metadataNumberFormatter = bgoStore.any(
    accountView,
    ns.bgo("amountFormatter")
  );
  app.metadata.totalFormatterOptions.format =
    bgoStore.anyValue(metadataNumberFormatter, ns.bgo("format")) || "";
  app.metadata.totalFormatterOptions.precision =
    bgoStore.anyValue(metadataNumberFormatter, ns.bgo("precision")) || 0;
  //--------------------------------------------------------------------------//
  //metadata data
  let account = bgoStore.any(null, ns.bgo("accountId"), app.accountId);
  app.metadata.title =
    bgoStore.any(account, ns.bgo("title")) ||
    bgoStore.any(account, ns.bgo("accountId"));
  app.metadata.description = bgoStore.any(account, ns.bgo("description")) || {
    value: "",
    datatype: "litteral"
  };
  app.metadata.abstract = bgoStore.any(account, ns.bgo("abstract")) || {
    value: "",
    datatype: "litteral"
  };
  app.metadata.total = bgoStore.anyValue(account, ns.bgo("amount"));
  let reference = bgoStore.anyValue(account, ns.bgo("referenceAmount"));
  app.metadata.rate = (app.metadata.total - reference) / reference;

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
    // Breakdown Totalizer  metadata
    let totalizer = bgoStore.any(breakdown_perspective, ns.bgo("hasTotalizer"));
    let rateFormatter = bgoStore.any(totalizer, ns.bgo("ratioFormatter"));

    app.breakDown.totalizerOptions.format = bgoStore.anyValue(
      totalizer,
      ns.bgo("format")
    );
    app.breakDown.totalizerOptions.filteredFormat = bgoStore.anyValue(
      totalizer,
      ns.bgo("filteredFormat")
    );
    app.breakDown.totalizerOptions.precision = bgoStore.anyValue(
      totalizer,
      ns.bgo("precision")
    );
    app.breakDown.totalizerOptions.rateFormatter.format = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("format")
    );
    app.breakDown.totalizerOptions.rateFormatter.precision = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("precision")
    );
    app.breakDown.totalizerOptions.rateFormatter.scaleFactor = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("scaleFactor")
    );
    app.breakDown.totalizerOptions.rateFormatter.maxValue = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("maxValue")
    );
    app.breakDown.totalizerOptions.rateFormatter.minValue = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("minValue")
    );
    app.breakDown.totalizerOptions.rateFormatter.moreThanMaxFormat = bgoStore.anyValue(
      rateFormatter,
      ns.bgo("moreThanMaxFormat")
    );
    app.breakDown.totalizerOptions.rateFormatter.lessThanMinFormat = bgoStore.anyValue(
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
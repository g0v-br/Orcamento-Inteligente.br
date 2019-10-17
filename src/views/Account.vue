<template>
  <div>
    <v-system-bar window class="status">
      <div class="flex-grow-1"></div>
      <v-icon v-on:click="$router.push('/overview' + '?s='+accountId)">mdi-magnify</v-icon>
      <v-icon v-on:click="$router.push('/overview')">mdi-close</v-icon>
    </v-system-bar>
    <div class="content-grid">
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

      <BarChart
        v-if="historicalPerspective && account.historicRecords.length > 0"
        :historic-rec="historicRecords"
        :formatAmount="historicalPerspective.formatters.formatAmount"
        :title="historicalPerspective.title"
      />

      <PieChart
        v-if="breakdownPerspective && account.breakDownRecords.length >0"
        :breakdown="breakdownRecords"
        :title="breakdownPerspective.title"
        :total="account.amount"
        :totalizer="breakdownPerspective.totalizer"
      />
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/account/perspectives/BarChart";
import Metadata from "@/components/account/perspectives/Metadata";
import PieChart from "@/components/account/perspectives/PieChart";
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
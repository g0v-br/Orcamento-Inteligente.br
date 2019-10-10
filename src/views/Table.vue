<template>
  <div class="container">
    <div class="g0v-table-container">
      <v-card>
        <v-card-title>
          <div>{{totalizer(total, total)}}</div>
          <!-- <Totalizer :total="total" :filtered="total" :options="totalizerOptions" /> -->
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :placeholder="searchPane.label"
            single-line
            hide-details
            @input="onSearchInput"
          ></v-text-field>
          <v-icon @click="downloadCSV()">mdi-cloud-download</v-icon>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="accounts"
          :search="search"
          :items-per-page="25"
          :footer-props="{
          prevIcon: 'mdi-arrow-left',
          nextIcon: 'mdi-arrow-right'
        }"
          class="elevation-1 fixed"
        >
          <template class="text-cell" v-slot:item.title="{ item }">
            {{item.title}}
            <v-icon
              class="link-icon"
              @click="goToAccount(item.accountId)"
              small
              color="blue"
            >mdi-link</v-icon>
          </template>
          <template v-slot:item.amount="{ item }">{{ formatters.formatAmount(item.amount) }}</template>
          <template v-slot:item.trend="{ item }">
            <Rate :rate="item.trend" :formatter="formatters.formatPercentage" />
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>


<script>
import Totalizer from "@/components/Totalizer";
import StringFormatter from "@/components/StringFormatter.vue";
import Rate from "@/components/Rate";
import { ServiceFactory } from "@/services/ServiceFactory.js";
const TableFactory = ServiceFactory.get("table");

export default {
  name: "Table",
  components: {
    Totalizer,
    StringFormatter,
    Rate
  },
  data() {
    return {
      search: "",
      headers: null,
      accounts: null,
      searchPane: null,
      formatters: null,
      totalizer: null
    };
  },
  created() {
    this.headers = TableFactory.getHeaders();
    this.accounts = TableFactory.getAccounts();
    this.searchPane = TableFactory.getSearchPane();
    this.formatters = TableFactory.getFormatters();
    this.totalizer = TableFactory.getTotalizer();
    this.search = this.$route.query.s || "";
  },
  computed: {
    total() {
      return this.filteredAccounts.reduce((sum, node) => {
        return sum + parseInt(node.amount);
      }, 0);
    },
    filteredAccounts() {
      return this.accounts.filter(node => {
        let search = this.search.toLowerCase(),
          title = node.title.toLowerCase().includes(search),
          description = node.description.toLowerCase().includes(search);

        return title || description;
      });
    }
  },
  methods: {
    onSearchInput() {
      this.$router.replace({
        name: "table",
        query: { s: this.search }
      });
    },
    goToAccount(accountId) {
      this.$router.push({
        name: "account",
        params: { accountId: accountId }
      });
    },
    downloadCSV() {
      let element, csv;

      element = document.createElement("a");
      csv = this.buildCSV();
      element.setAttribute(
        "href",
        "data:csv/plain;charset=utf-8," + encodeURIComponent(csv)
      );
      element.setAttribute("download", "filtered-accounts.csv");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    buildCSV() {
      let csv = this.buildHeader() + "\r\n";
      this.filteredAccounts.forEach(account => {
        csv += Object.values(account).join(",") + "\r\n";
      });
      return csv;
    },
    buildHeader() {
      let top = "accountId,";
      this.headers.forEach(header => {
        top += header.text + ",";
      });
      return top.substring(0, top.length - 1);
    }
  }
};
</script>



<!-- CSS -->
<style scoped>
.g0v-table-container {
  background-color: #aaaaaa;
}
.g0v-title {
  font-weight: 400;
  margin-bottom: 0.5em;
}
.text-cell::first-letter {
  text-transform: uppercase;
}
.download-csv {
  margin-left: 1rem;
}
/* .account-second {
  width: auto;
  } */
</style>

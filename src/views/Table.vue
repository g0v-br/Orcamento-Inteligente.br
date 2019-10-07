<template>
  <div class="container">
    <div class="g0v-table-container">
      <v-card>
        <v-card-title>
          <Totalizer :total="total" :filtered="total" :options="totalizerOptions" />
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :placeholder="label"
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
          <template
            v-slot:item.amount="{ item }"
          >{{ printf(totalizerOptions.format, formatAmount(item.amount)) }}</template>
          <template v-slot:item.trend="{ item }">
            <Rate :rate="item.trend" :show_icon="true" />
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>


<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import Totalizer from "@/components/Totalizer";
import StringFormatter from "@/components/StringFormatter.vue";
import Rate from "@/components/Rate";
import { formatAmount, printf } from "@/utils/utils.js";

export default {
  name: "Table",
  components: {
    Totalizer,
    StringFormatter,
    Rate
  },
  data() {
    return {
      title: "",
      headers: [],
      accounts: [],
      search: "",
      label: "",
      totalizerOptions: {
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
          //let search = "1";
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
    },
    formatAmount,
    printf
  }
};

function fetchData(app) {
  //Fetch tableView and searchPane  const domain = bgoStore.any(undefined, ns.bgo("hasOverview"));
  const domain = bgoStore.any(undefined, ns.bgo("hasOverview"));
  const tableView = bgoStore.any(domain, ns.bgo("hasTableView"));

  let searchPane = bgoStore.any(tableView, ns.bgo("hasSearchPane"));

  //fetch Title
  app.title = bgoStore.anyValue(tableView, ns.bgo("title"));

  //Fetch Headers
  app.headers.push({
    text: bgoStore.anyValue(tableView, ns.bgo("headerTitle")),
    value: "title",
    width: "45%"
  });
  app.headers.push({
    text: bgoStore.anyValue(tableView, ns.bgo("headerAmount")),
    value: "amount",
    width: "15%",
    filter: () => true
  }); //unserachable
  app.headers.push({
    text: bgoStore.anyValue(tableView, ns.bgo("headerTrend")),
    value: "trend",
    width: "15%",
    filter: () => true
  }); //unsearchable
  app.headers.push({
    text: bgoStore.anyValue(tableView, ns.bgo("headerDescription")),
    value: "description",
    width: "25%"
  });

  //Set the search
  app.label = bgoStore.anyValue(searchPane, ns.bgo("label"));

  //Fetch Accounts
  let accounts = bgoStore.each(null, ns.bgo("accountId"));
  accounts.forEach(account => {
    let title = bgoStore.anyValue(account, ns.bgo("title")) || "",
      amount = bgoStore.anyValue(account, ns.bgo("amount")) || 1,
      description = bgoStore.anyValue(account, ns.bgo("description")) || "",
      previousValue =
        bgoStore.anyValue(account, ns.bgo("referenceAmount")) || 1,
      accountId = bgoStore.anyValue(account, ns.bgo("accountId")) || "",
      trend = (amount - previousValue) / previousValue;

    app.accounts.push({
      accountId,
      title,
      amount,
      trend,
      description
    });
  });

  // Totalizer
  let totalizer = bgoStore.any(tableView, ns.bgo("hasTotalizer"));
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

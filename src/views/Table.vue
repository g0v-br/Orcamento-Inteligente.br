<template>
  <div class="container">
    <div class="g0v-table-container">
      <v-card>
        <v-card-title>
          <Totalizer :total="total +';'+total" />
          <!-- {{title}} : {{total}} -->
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :placeholder="label"
            single-line
            hide-details
            @input="onSearchInput"
          ></v-text-field>
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
        ></v-data-table>
      </v-card>
    </div>
  </div>
</template>


<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import Totalizer from "@/components/Totalizer";
import StringFormatter from "@/components/StringFormatter.vue";
export default {
  name: "Table",
  components: {
    Totalizer,
    StringFormatter
  },
  data() {
    return {
      title: "",
      headers: [],
      accounts: [],
      search: "",
      label: ""
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
    }
  }
};

function fetchData(app) {
  //Fetch tableView and searchPane
  let tableView = bgoStore.any(undefined, ns.rdf("type"), ns.bgo("TableView")),
    searchPane = bgoStore.any(tableView, ns.bgo("hasSearchPane"));

  //fetch Title
  app.title = bgoStore.anyValue(tableView, ns.bgo("title"));


  //Fetch Headers
  //TODO decide where to get the width values
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
  let accounts = bgoStore.each(undefined, ns.rdf("type"), ns.bgo("Account"));
  accounts.forEach(account => {
    let title = bgoStore.anyValue(account, ns.bgo("title")),
      amount = bgoStore.anyValue(account, ns.bgo("amount")),
      description = bgoStore.anyValue(account, ns.bgo("description")),
      previousValue = bgoStore.anyValue(account, ns.bgo("referenceAmount")),
      trend = (amount - previousValue) / previousValue;

    app.accounts.push({
      title,
      amount,
      trend,
      description
    });

    //i'm already here so i can just calculate the total
    //app.total += parseInt(amount);

    // Get the partitions using the hasAccount attribute
    // let partitionLabel, partitionLabels =[];
    // let partitions = bgoStore.each(undefined, ns.bgo('hasAccount'), account);
    // partitions.forEach((partition) => {
    //     partitionLabels.push(bgoStore.anyValue(partition, ns.bgo('title')));
    // });

    //Format partition labels
    //description = partitionLabels.join(', ');
  });
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
td::first-letter {
  text-transform: uppercase;
}
.download-csv {
  margin-left: 1rem;
}
/* .account-second {
  width: auto;
  } */
</style>
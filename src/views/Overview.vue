<template>
  <div class="container-fluid">
    <!-- partitioned is used to remove the side content -->
    <div :class="{'content-grid':true, 'partitioned': activePartitionId != 'overview'}">
      <div class="partitions">
        <v-btn-toggle v-model="activePartitionId" mandatory>
          <v-btn
            v-for="partition in partitions"
            :key="partition.id"
            :value="partition.id"
            @click="onPartitionChange(partition.id)"
          >{{partition.label}}</v-btn>
        </v-btn-toggle>
      </div>

      <div class="search">
        <v-text-field
          append-icon="mdi-magnify"
          outlined
          v-model="search"
          :placeholder="searchPaneLabel"
        ></v-text-field>
      </div>

      <div class="meta">Metadata, sul cellulare solo il totale, per il resto c'è il popup</div>

      <BubbleChart
        class="chart"
        :active-partition-id="activePartitionId"
        :partitions="partitions"
        :search="search"
      ></BubbleChart>

      <div class="tools">Tools, tag cloud e legenda</div>
    </div>
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart";
import { debounce } from "lodash";

export default {
  name: "overview",
  props: {
    partitionId: {
      type: String,
      default: "overview"
    }
  },
  data() {
    return {
      activePartitionId: this.partitionId,
      partitions: [],
      searchPaneLabel: "",
      search: ""
    };
  },
  components: {
    BubbleChart
  },
  beforeRouteUpdate(to, from, next) {
    // Update activePartition when the view is reused with new id
    this.activePartitionId = to.params.partitionId;
    next();
  },
  created() {
    fetchData(this);
  },
  methods: {
    onPartitionChange(partitionId) {
      this.$router.push({
        name: "accounts-partition",
        params: { partitionId }
      });
    }
  }
};

function fetchData(app) {
  const overview = bgoStore.any(null, ns.rdf("type"), ns.bgo("Overview"));
  // Partition metadata
  // Push default partition with id 'overview'
  app.partitions.push({
    id: "overview",
    label: bgoStore.anyValue(overview, ns.bgo("label"))
  });
  const partitions = bgoStore.any(overview, ns.bgo("hasPartitionList"))
    .elements;
  for (const partition of partitions) {
    //add other partitions
    //fetch partitions data
    let id = bgoStore.anyValue(partition, ns.bgo("partitionId"));
    let label = bgoStore.anyValue(partition, ns.bgo("label"));
    let title = bgoStore.anyValue(partition, ns.bgo("title"));
    let sortOrder =
      bgoStore.anyValue(partition, ns.bgo("sortOrder")) ||
      ns.bgo("descending_sort").value;
    let sortCriteria =
      bgoStore.anyValue(partition, ns.bgo("sortCriteria")) ||
      ns.bgo("abs_sort").value;
    let groupFunction =
      bgoStore.anyValue(partition, ns.bgo("groupFunction")) ||
      ns.bgo("amounts_sum").value;
    //fetch subset data
    let subsets_uri = bgoStore.each(partition, ns.bgo("hasAccountSubSet"));
    let subsets = [];
    subsets_uri.forEach(subset => {
      //for each partition add its subsets
      let s_title = bgoStore.anyValue(subset, ns.bgo("title"));
      let s_label = bgoStore.anyValue(subset, ns.bgo("label")) || "";
      let description = bgoStore.anyValue(subset, ns.bgo("description")) || "";
      let abstract = bgoStore.anyValue(subset, ns.bgo("abstract")) || "";
      subsets.push({
        id: subset.value,
        title: s_title,
        description,
        abstract,
        label: s_label,
        total: 0,
        total_filtered: 0
      });
    });

    app.partitions.push({
      id,
      label,
      title,
      sortOrder,
      sortCriteria,
      groupFunction,
      subsets
    });
  }
  // Search metadata
  const searchPane = bgoStore.any(overview, ns.bgo("hasSearchPane"));
  app.searchPaneLabel = bgoStore.anyValue(searchPane, ns.bgo("label"));
}
</script>

<style scoped>
/* Large desktop */
.container-fluid {
  padding: 24px 12px;
  height: 100%;
}

.content-grid {
  position: relative;
  height: 100%;
  display: grid;
  grid-gap: 0.5em;
  grid-template-areas:
    "part part search"
    "meta chart tools"
    "meta chart tools";
  grid-template-rows: auto 11fr;
  grid-template-columns: 1fr 2fr 1fr;
}

/* Extends chart column to fill the screen */
.content-grid.partitioned {
  grid-template-areas:
    "part part search"
    "chart chart chart"
    "chart chart chart";
}

/* remove meta and tools columns when partioned */
.content-grid.partitioned .tools,
.content-grid.partitioned .meta {
  display: none;
}

.partitions {
  grid-area: part;
  /* background-color: aquamarine; */
}
.search {
  grid-area: search;
  /* background-color: blueviolet; */
}
.meta {
  grid-area: meta;
  /* background-color: cadetblue; */
}
.chart {
  grid-area: chart;
  /* background-color: chartreuse; */
}
.tools {
  grid-area: tools;
  /* background-color: coral; */
}

/* Landscape phones to portrait tablets and desktop */
@media (max-width: 979px) {
  .content-grid {
    grid-template-areas:
      "part part search"
      "meta chart chart"
      "meta chart chart";

    grid-template-columns: 1fr 1fr 1fr;
  }

  .tools {
    display: none;
  }
}

/* Landscape phones and down */
@media (max-width: 768px) {
  .container-fluid {
    min-height: 120vh;
  }
  .content-grid {
    grid-template-areas:
      "part"
      "search"
      "meta"
      "chart";

    grid-template-rows: 1fr 1fr 1fr 9fr;
    grid-template-columns: 1fr;
  }

  .content-grid.partitioned {
    grid-template-areas:
      "part"
      "search"
      "chart";
    grid-template-rows: 1fr 1fr auto;
  }

  .tools {
    display: none;
  }
}
</style>
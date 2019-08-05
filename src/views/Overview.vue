<template>
  <div class="container-fluid">
    <div class="content-grid">
      <div class="partitions">
        <v-btn-toggle v-model="activePartitionId" mandatory>
          <!-- <v-btn  value="overview">Stato</v-btn> -->
        <v-btn v-for="partition in partitions" :key="partition.id"
             :value="partition.id" >{{partition.label}}</v-btn>
        </v-btn-toggle>
      </div>
      <div class="search">
        <v-text-field append-icon="mdi-magnify" solo placeholder="Filtra le bolle"></v-text-field>
      </div>
      <div class="meta">Metadata, sul cellulare solo il totale, per il resto c'è il popup</div>
      <BubbleChart class="chart"></BubbleChart>
      <div class="tools">Tools, tag cloud e legenda</div>
    </div>
  </div>
</template>

<script>
import { bgoStore, fetcher, ns } from "@/models/bgo.js";
import BubbleChart from "@/components/overview/BubbleChart";

export default {
  name:"overview",
  props: {
    partitionId: {
      type: String,
      default: "overview"
    }
  },
  data() {
    return {
      activePartitionId: this.partitionId,
      partitions:[]
    };
  },
  components: {
    BubbleChart
  },
  beforeRouteUpdate (){
    // this.activePartitionId = this.partitionId;
  },
  mounted() {
    const overview = bgoStore.any(null, ns.rdf("type"), ns.bgo("Overview"));
    this.partitions.push({
      id:"overview",
      label:bgoStore.anyValue(overview, ns.bgo('label'))
    });
    const partitions = bgoStore.any(overview, ns.bgo("hasPartitionList"))
      .elements;
    for (const partition of partitions) {
      const id = bgoStore.anyValue(partition, ns.bgo('partitionId'));
      const label = bgoStore.anyValue(partition, ns.bgo('label'));
      this.partitions.push({
        id,
        label
      })
    }
  }
};
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
    height: 120vh;
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
    grid-template-rows: 1fr 1fr 9fr;
  }

  .tools {
    display: none;
  }
}
</style>